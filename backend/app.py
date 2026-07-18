from flask import Flask, request, jsonify
import joblib
import pandas as pd
import psycopg2
import os
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)

# Set this in Render's Environment Variables once your Neon database
# exists. Neon gives you this connection string when you create a
# project - it looks like:
# postgresql://user:password@ep-xxxx.aws.neon.tech/neondb?sslmode=require
DATABASE_URL = os.environ.get("DATABASE_URL")


def get_db():
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL
        )
    """)
    cur.execute("""
        CREATE TABLE IF NOT EXISTS predictions (
            id SERIAL PRIMARY KEY,
            email TEXT NOT NULL,
            study_hours REAL,
            attendance REAL,
            assignments REAL,
            sleep_hours REAL,
            previous_grade TEXT,
            predicted_grade TEXT,
            confidence INTEGER,
            created_at TIMESTAMP DEFAULT NOW()
        )
    """)
    conn.commit()
    cur.close()
    return conn


@app.after_request
def add_cors_headers(response):
    # Manual CORS handling - allows predict.html (served from GitHub
    # Pages, a different origin) to call this API from the browser.
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    return response


@app.route("/signup", methods=["POST"])
def signup():
    data = request.json
    required_fields = ["name", "email", "password"]
    missing = [f for f in required_fields if f not in data or not data[f]]
    if missing:
        return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400

    if len(data["password"]) < 6:
        return jsonify({"error": "Password must be at least 6 characters."}), 400

    conn = get_db()
    cur = conn.cursor()

    cur.execute("SELECT id FROM users WHERE email = %s", (data["email"],))
    existing = cur.fetchone()
    if existing:
        cur.close()
        conn.close()
        return jsonify({"error": "An account with this email already exists."}), 409

    password_hash = generate_password_hash(data["password"])
    cur.execute(
        "INSERT INTO users (name, email, password_hash) VALUES (%s, %s, %s)",
        (data["name"], data["email"], password_hash)
    )
    conn.commit()
    cur.close()
    conn.close()

    return jsonify({"message": "Account created successfully."})


@app.route("/login", methods=["POST"])
def login():
    data = request.json
    required_fields = ["email", "password"]
    missing = [f for f in required_fields if f not in data or not data[f]]
    if missing:
        return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400

    conn = get_db()
    cur = conn.cursor()
    cur.execute(
        "SELECT id, name, password_hash FROM users WHERE email = %s",
        (data["email"],)
    )
    user = cur.fetchone()
    cur.close()
    conn.close()

    if not user or not check_password_hash(user[2], data["password"]):
        return jsonify({"error": "Incorrect email or password."}), 401

    return jsonify({"message": "Login successful.", "name": user[1]})


# Load trained model and the encoders saved alongside it
model = joblib.load("../models/model.pkl")
previous_grade_encoder = joblib.load("../models/previous_grade_encoder.pkl")
final_grade_encoder = joblib.load("../models/final_grade_encoder.pkl")


@app.route("/predict", methods=["POST"])
def predict():
    data = request.json

    # Basic input validation - the original version trusted the request
    # completely, so a missing field or unseen grade letter would crash
    # the server with a raw 500 error instead of a useful message.
    required_fields = ["study_hours", "attendance", "assignments", "sleep_hours", "previous_grade"]
    missing = [f for f in required_fields if f not in data]
    if missing:
        return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400

    if data["previous_grade"] not in previous_grade_encoder.classes_:
        return jsonify({
            "error": f"Unrecognized previous_grade '{data['previous_grade']}'. "
                     f"Expected one of: {list(previous_grade_encoder.classes_)}"
        }), 400

    encoded_previous_grade = previous_grade_encoder.transform([data["previous_grade"]])[0]

    features = pd.DataFrame([{
        "study_hours": data["study_hours"],
        "attendance": data["attendance"],
        "assignments": data["assignments"],
        "sleep_hours": data["sleep_hours"],
        "previous_grade": encoded_previous_grade
    }])

    prediction = model.predict(features)
    probabilities = model.predict_proba(features)[0]
    confidence = round(max(probabilities) * 100)

    # FIX: decode the numeric prediction back into an actual letter grade
    # instead of returning a bare number the frontend can't interpret.
    predicted_grade = final_grade_encoder.inverse_transform(prediction)[0]

    # Save this prediction to history if the request came from a logged-in
    # user (email included). Anonymous predictions (no email) still work,
    # they just won't show up on anyone's dashboard.
    if data.get("email"):
        conn = get_db()
        cur = conn.cursor()
        cur.execute(
            """INSERT INTO predictions
               (email, study_hours, attendance, assignments, sleep_hours, previous_grade, predicted_grade, confidence)
               VALUES (%s, %s, %s, %s, %s, %s, %s, %s)""",
            (data["email"], data["study_hours"], data["attendance"], data["assignments"],
             data["sleep_hours"], data["previous_grade"], str(predicted_grade), confidence)
        )
        conn.commit()
        cur.close()
        conn.close()

    return jsonify({
        "prediction": predicted_grade,
        "confidence": confidence
    })


@app.route("/history/<email>", methods=["GET"])
def history(email):
    conn = get_db()
    cur = conn.cursor()

    cur.execute("SELECT name FROM users WHERE email = %s", (email,))
    user = cur.fetchone()
    if not user:
        cur.close()
        conn.close()
        return jsonify({"error": "No account found for this email."}), 404

    cur.execute(
        """SELECT study_hours, attendance, assignments, sleep_hours, previous_grade,
                  predicted_grade, confidence, created_at
           FROM predictions WHERE email = %s ORDER BY created_at DESC""",
        (email,)
    )
    rows = cur.fetchall()
    cur.close()
    conn.close()

    predictions = [
        {
            "study_hours": r[0], "attendance": r[1], "assignments": r[2],
            "sleep_hours": r[3], "previous_grade": r[4], "predicted_grade": r[5],
            "confidence": r[6], "created_at": r[7].isoformat()
        }
        for r in rows
    ]

    # Streak = number of distinct calendar days with at least one prediction,
    # counting back consecutively from the most recent one.
    distinct_days = sorted({p["created_at"][:10] for p in predictions}, reverse=True)
    streak = 0
    if distinct_days:
        expected = datetime.strptime(distinct_days[0], "%Y-%m-%d").date()
        for day_str in distinct_days:
            day = datetime.strptime(day_str, "%Y-%m-%d").date()
            if day == expected:
                streak += 1
                expected -= timedelta(days=1)
            else:
                break

    avg_confidence = round(sum(p["confidence"] for p in predictions) / len(predictions)) if predictions else 0

    return jsonify({
        "name": user[0],
        "total_predictions": len(predictions),
        "streak_days": streak,
        "average_confidence": avg_confidence,
        "latest": predictions[0] if predictions else None,
        "history": predictions
    })


@app.route("/")
def home():
    return "Lumora AI Backend Running 🚀"


if __name__ == "__main__":
    app.run(debug=True)
