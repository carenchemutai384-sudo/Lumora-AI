from flask import Flask, request, jsonify
import joblib
import pandas as pd

app = Flask(__name__)


@app.after_request
def add_cors_headers(response):
    # Manual CORS handling - allows predict.html (served from GitHub
    # Pages, a different origin) to call this API from the browser.
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    return response

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
