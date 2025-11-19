disease_symptoms = {
    "Fatty Liver": {"fever": (0, 1), "headache": (0, 1), "vomiting": (1, 2), "stomachpain": (1, 3), "fatigue": (2, 3), "jaundice": (0, 1), "alcohol": (1, 3)},
    "Diabetes": {"fever": (0, 1), "headache": (0, 1), "vomiting": (0, 1), "urination": (2, 3), "thirst": (2, 3), "fatigue": (2, 3), "weightloss": (1, 3)},
    "Hypertension": {"headache": (2, 3), "stress": (2, 3), "chestpain": (1, 2), "fatigue": (1, 2), "shortness": (1, 2)},
    "COVID": {"fever": (2, 3), "cough": (2, 3), "fatigue": (2, 3), "breathingdifficulty": (1, 3), "bodypain": (1, 3)},
    "Dengue": {"fever": (3, 3), "headache": (2, 3), "vomiting": (1, 2), "rashes": (1, 2), "bodypain": (2, 3)},
    "Heart Disease": {"chestpain": (3, 3), "shortness": (3, 3), "fatigue": (2, 3), "sweating": (2, 3)},
    "Asthma": {"cough": (2, 3), "shortness": (3, 3), "chesttightness": (2, 3), "wheezing": (2, 3)},
    "Stroke": {"headache": (2, 3), "weakness": (2, 3), "speechdifficulty": (2, 3), "dizziness": (2, 3)},
    "Kidney Disease": {"urination": (1, 3), "swelling": (1, 3), "fatigue": (2, 3), "vomiting": (1, 2)},
    "Tuberculosis": {"fever": (2, 3), "cough": (2, 3), "weightloss": (2, 3), "night_sweat": (2, 3)},
    "HIV": {"weightloss": (2, 3), "fever": (1, 3), "rashes": (1, 2), "fatigue": (2, 3)}
}


import random
import csv

symptom_list = sorted(list({s for d in disease_symptoms.values() for s in d}))

def generate_patient(disease):
    entry = {"disease": disease}

    entry["age"] = random.randint(18, 70)
    entry["gender"] = random.choice(["Male", "Female"])
    entry["bmi"] = round(random.uniform(18, 35), 1)

    patterns = disease_symptoms[disease]
    for symptom in symptom_list:
        if symptom in patterns:
            s_min, s_max = patterns[symptom]
            entry[symptom] = random.randint(s_min, s_max)
        else:
            entry[symptom] = random.randint(0, 1)

    return entry

rows = []
diseases = list(disease_symptoms.keys())

for disease in diseases:
    for _ in range(3000):  
        rows.append(generate_patient(disease))

with open("disease_dataset.csv", "w", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=["disease", "age", "gender", "bmi"] + symptom_list)
    writer.writeheader()
    writer.writerows(rows)
