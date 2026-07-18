from flask import Flask, request, jsonify
import joblib
import pandas as pd
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)


def get_db():
    conn = sqlite3.connect("users.db")
    conn.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL
        )
    """)
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
    existing = conn.execute("SELECT id FROM users WHERE email = ?", (data["email"],)).fetchone()
    if existing:
        conn.close()
        return jsonify({"error": "An account with this email already exists."}), 409

    password_hash = generate_password_hash(data["password"])
    conn.execute(
        "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
        (data["name"], data["email"], password_hash)
    )
    conn.commit()
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
    user = conn.execute(
        "SELECT id, name, password_hash FROM users WHERE email = ?",
        (data["email"],)
    ).fetchone()
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

    return jsonify({
        "prediction": predicted_grade,
        "confidence": confidence
    })


@app.route("/")
def home():
    return "Lumora AI Backend Running 🚀"


if __name__ == "__main__":
    app.run(debug=True)
