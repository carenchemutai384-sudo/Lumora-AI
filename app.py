from flask import Flask, request, jsonify
import joblib

app = Flask(__name__)

# Load trained model
model = joblib.load("../models/model.pkl")

@app.route("/predict", methods=["POST"])
def predict():

    data = request.json

    features = [[
        data["study_hours"],
        data["attendance"],
        data["assignments"],
        data["sleep_hours"],
        data["previous_grade"]
    ]]

    prediction = model.predict(features)

    return jsonify({
        "prediction": int(prediction[0])
    })

@app.route("/")
def home():
    return "Lumora AI Backend Running 🚀"

if __name__ == "__main__":
    app.run(debug=True)
