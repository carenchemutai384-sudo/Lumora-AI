import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
import joblib
import os

# Load dataset
data = pd.read_csv("dataset.csv")

# FIX: use two SEPARATE encoders, one per column.
# The original script reused one encoder for both previous_grade and
# final_grade — the second .fit_transform() call overwrote the first
# encoder's mapping, and neither mapping was ever saved. That meant
# predictions came back as a bare number with no way to translate it
# back into a real letter grade.
previous_grade_encoder = LabelEncoder()
final_grade_encoder = LabelEncoder()

data["previous_grade"] = previous_grade_encoder.fit_transform(data["previous_grade"])
data["final_grade"] = final_grade_encoder.fit_transform(data["final_grade"])

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
# NOTE: with only 11 rows total, an 80/20 split leaves ~2 rows for
# testing. That's too small to trust the test accuracy number below —
# treat it as a sanity check, not a real evaluation.
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

# Quick sanity check on the tiny held-out set
if len(X_test) > 0:
    test_score = model.score(X_test, y_test)
    print(f"Test accuracy on {len(X_test)} held-out rows: {test_score:.2f}")
    print("(With this little data, treat this number as a sanity check, not a real metric.)")

# Create models folder if it doesn't exist
os.makedirs("../models", exist_ok=True)

# Save model AND both encoders — app.py needs previous_grade_encoder to
# encode incoming requests, and final_grade_encoder to decode predictions
# back into real letter grades.
joblib.dump(model, "../models/model.pkl")
joblib.dump(previous_grade_encoder, "../models/previous_grade_encoder.pkl")
joblib.dump(final_grade_encoder, "../models/final_grade_encoder.pkl")

print("✅ Model and encoders trained and saved successfully!")
print(f"Grade classes learned: {list(final_grade_encoder.classes_)}")
