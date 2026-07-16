import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
import joblib
import os

# Load dataset
data = pd.read_csv("dataset.csv")

# Convert grades to numbers
encoder = LabelEncoder()

data["previous_grade"] = encoder.fit_transform(data["previous_grade"])
data["final_grade"] = encoder.fit_transform(data["final_grade"])

# Features
X = data[[
    "study_hours",
    "attendance",
    "assignments",
    "sleep_hours",
    "previous_grade"
]]

# Target
y = data["final_grade"]

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

# Train model
model = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)

model.fit(X_train, y_train)

# Create models folder if it doesn't exist
os.makedirs("../models", exist_ok=True)

# Save model
joblib.dump(model, "../models/model.pkl")

print("✅ Model trained successfully!")
