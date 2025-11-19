import os, joblib

MODEL_PATH = "app/ml_models/pipeline.pkl"

pipeline = None
if os.path.exists(MODEL_PATH) and os.path.getsize(MODEL_PATH) > 0:
    try:
        pipeline = joblib.load(MODEL_PATH)
        print("Model loaded successfully.")
    except Exception as e:
        print("Model load error:", e)
else:
    print("Model file missing or empty.")
