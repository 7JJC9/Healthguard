import joblib
import pandas as pd
MODEL_PATH = "../ml_model/pipeline.pkl"

pipe = joblib.load(MODEL_PATH)

sample = {
    "age": "youngadult",
    "gender": "Male",
    "height": 170,
    "weight": 65,
    "bmi": 22.5,
    "bmi_category": "Normal weight",
    "smoking": 0,
    "alcohol": 0,
    "exercise": 2,
    "diet": 2,
    "sleep": 2,
    "waterintake": 2,
    "stress": 1,
    "fever": 0,
    "cough": 0,
    "headache": 0,
    "chestpain": 0,
    "fatigue": 0,
    "vomiting": 0,
    "shortnessofbreath": 0,
    "stomachpain": 0,
    "nothungry": 0,
    "rashes": 0
}

df = pd.DataFrame([sample])
pred = pipe.predict(df)[0]
prob = pipe.predict_proba(df).max()
confidence = round(prob * 100, 2)
print("Predicted:", pred, "Prob:", prob )
print(f"Predicted: {pred} | Confidence: {confidence}%")

