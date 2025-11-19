import pandas as pd
import random
import os

diseases = [
    "Alzheimer’s Disease", "Anemia", "Asthma", "Breast Cancer", "COVID-19", "Cervical Cancer",
    "Chickenpox", "Cholera", "Dengue Fever", "Diabetes", "Fatty Liver", "Gastritis",
    "HIV/AIDS", "Heart Attack", "Hypertension", "Influenza", "Kidney Disease",
    "Leukemia", "Lung Cancer", "Malaria", "Migraine", "Peptic Ulcer", "Pneumonia",
    "Prostate Cancer", "Skin Cancer", "Stroke", "Thyroid Disorder", "Tuberculosis",
    "Typhoid", "Urinary Tract Infection"
]

age_categories = ["child", "teen", "youngadult", "adult", "senior"]
genders = ["Male", "Female", "Other"]


def bmi_category(bmi):
    if bmi < 18.5:
        return "Underweight"
    elif 18.5 <= bmi < 25:
        return "Normal weight"
    elif 25 <= bmi < 30:
        return "Overweight"
    else:
        return "Obese"

def generate_record(disease):
    
    age_category = random.choice(age_categories)
    gender = random.choice(genders)

    
    height = random.randint(100, 200)
    weight = random.randint(30, 110)
    bmi = round(weight / ((height / 100) ** 2), 1)
    bmi_cat = bmi_category(bmi)

    smoking = random.randint(0, 3)
    alcohol = random.randint(0, 3)
    exercise = random.randint(0, 3)
    diet = random.randint(0, 3)
    sleep = random.randint(0, 3)
    waterintake = random.randint(0, 3)
    stress = random.randint(0, 3)

   
    symptoms = {
        "fever": 3 if disease in ["COVID-19", "Typhoid", "Malaria", "Dengue Fever", "Tuberculosis", "Influenza"] else random.randint(0, 3),
        "cough": 3 if disease in ["COVID-19", "Tuberculosis", "Pneumonia", "Asthma"] else random.randint(0, 3),
        "headache": 3 if disease in ["Migraine", "Typhoid", "Dengue Fever", "Influenza"] else random.randint(0, 3),
        "chestpain": 3 if disease in ["Heart Attack", "Pneumonia", "Asthma", "Lung Cancer"] else random.randint(0, 3),
        "fatigue": random.randint(0, 3),
        "vomiting": random.randint(0, 3),
        "shortnessofbreath": 3 if disease in ["Asthma", "Heart Attack", "Lung Cancer", "COVID-19"] else random.randint(0, 3),
        "stomachpain": random.randint(0, 3),
        "nothungry": random.randint(0, 3),
        "rashes": 3 if disease in ["Chickenpox", "Skin Cancer"] else random.randint(0, 3)
    }

    return {
        "age_category": age_category,
        "gender": gender,
        "height": height,
        "weight": weight,
        "bmi": bmi,
        "bmi_category": bmi_cat,
        "smoking": smoking,
        "alcohol": alcohol,
        "exercise": exercise,
        "diet": diet,
        "sleep": sleep,
        "waterintake": waterintake,
        "stress": stress,
        **symptoms,
        "disease": disease
    }


records = []
samples_per_disease = 2000  
for disease in diseases:
    for _ in range(samples_per_disease):
        records.append(generate_record(disease))

df = pd.DataFrame(records)

output_path = "/home/mastermind/Desktop/Healthguard/healthguards/app/data/3.csv"
os.makedirs(os.path.dirname(output_path), exist_ok=True)

df.to_csv(output_path, index=False)
print(f"Generated {len(df)} rows and saved to {output_path}")
