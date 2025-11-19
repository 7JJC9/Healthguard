from django.shortcuts import render
from rest_framework import generics
from .models import Patient, Doctor,AbstractUser,CustomUser,Appointment,AssignedPatient
from .serializers import *
from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from datetime import datetime

from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.core.mail import send_mail
from django.conf import settings

class PatientCreateView(generics.CreateAPIView):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    permission_classes = [AllowAny] 


class DoctorCreateView(generics.CreateAPIView):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    lookup_field = 'username'
    permission_classes = [AllowAny] 



class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            return Response({'message': 'Login successful', 'username': username ,"role": user.role,}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

def logout_view(request):
    if request.method == "POST":
        logout(request)
        return JsonResponse({"message": "Logout successful"})
    return JsonResponse({"error": "Invalid request"}, status=400)


from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.http import JsonResponse

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def patient_info(request, username):
    try:
       
        if request.user.username != username:
            return Response({"error": "Unauthorized access"}, status=403)

        patient = Patient.objects.select_related('user').get(user__username=username)
        data = {
            "id": patient.id,  
            "full_name": patient.full_name,
            "username": patient.user.username,
            "blood_group": patient.blood_group,
            "mobile_number": patient.mobile_number,
            "age": patient.age,
            
            
        }
        return JsonResponse(data)
    except Patient.DoesNotExist:
        return JsonResponse({"error": "Patient not found"}, status=404)



    
def doctor_info(request, username):
    try:
        doctor = Doctor.objects.select_related('user').get(user__username=username)
        data = {
            "full_name": doctor.full_name,
            "username": doctor.user.username,
            "blood_group": doctor.blood_group,
            "mobile_number": doctor.mobile_number,
            "age":doctor.age,
            "specialization":doctor.specialization,
            "hospital_name":doctor.hospital_name,
        }
        return JsonResponse(data)
    except Doctor.DoesNotExist:
        return JsonResponse({"error": "Doctor not found"}, status=404)
    



import os
import joblib
import pandas as pd
import numpy as np
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "ml_model", "pipeline.pkl")
pipeline = joblib.load(MODEL_PATH)


FEATURE_ORDER = [
    "age", "gender", "height", "weight", "bmi", "bmi_category",
    "smoking", "alcohol", "exercise", "diet", "sleep", "waterintake", "stress",
    "fever", "cough", "headache", "chestpain", "fatigue", "vomiting",
    "shortnessofbreath", "stomachpain", "nothungry", "rashes"
]

DISEASE_SPECIALIZATION = {
    # Cardiovascular
    "Heart Attack": ["Cardiologist"],
    "Hypertension": ["Cardiologist"],
    "Stroke": ["Neurologist", "Cardiologist"],

    # Respiratory
    "Asthma": ["Pulmonologist"],
    "Pneumonia": ["Pulmonologist"],
    "Tuberculosis": ["Pulmonologist"],
    "Lung Cancer": ["Pulmonologist", "Oncologist"],

    # Neurological
    "Alzheimer’s Disease": ["Neurologist"],
    "Migraine": ["Neurologist"],

    # Metabolic & Endocrine
    "Diabetes": ["Endocrinologist"],
    "Thyroid Disorder": ["Endocrinologist"],

    # Infectious
    "COVID-19": ["Infectious Disease Specialist"],
    "Influenza": ["Infectious Disease Specialist"],
    "Dengue Fever": ["Infectious Disease Specialist"],
    "Malaria": ["Infectious Disease Specialist"],
    "Typhoid": ["Infectious Disease Specialist"],
    "HIV/AIDS": ["Infectious Disease Specialist"],
    "Chickenpox": ["Dermatologist", "Infectious Disease Specialist"],
    "Cholera": ["Infectious Disease Specialist", "Gastroenterologist"],

    # Cancers
    "Breast Cancer": ["Oncologist"],
    "Prostate Cancer": ["Oncologist"],
    "Skin Cancer": ["Dermatologist", "Oncologist"],
    "Leukemia": ["Hematologist", "Oncologist"],
    "Cervical Cancer": ["Gynecologist", "Oncologist"],

    # Digestive
    "Gastritis": ["Gastroenterologist"],
    "Peptic Ulcer": ["Gastroenterologist"],
    "Liver Cirrhosis": ["Hepatologist"],
    "Fatty Liver": ["Hepatologist"],

    # Other
    "Anemia": ["Hematologist"],
    "Kidney Disease": ["Nephrologist"],
    "Urinary Tract Infection": ["Urologist", "Nephrologist"]
}


@api_view(['POST'])
def predict_disease(request):
    try:
        payload = request.data

        row = {}
        for f in FEATURE_ORDER:
            if f not in payload:
                return Response({"error": f"Missing field: {f}"}, status=status.HTTP_400_BAD_REQUEST)
            row[f] = payload[f]

        df = pd.DataFrame([row])

        pred = pipeline.predict(df)[0]

        proba_output = pipeline.predict_proba(df)
        if isinstance(proba_output, (list, np.ndarray)):
            probabilities = np.array(proba_output)[0]
        else:
            return Response({"error": "Invalid probability output from model."},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        classes = pipeline.classes_
        top_indices = np.argsort(probabilities)[::-1][:3]
        top_diseases = [classes[i] for i in top_indices]
        top_probs = [round(float(probabilities[i]) * 100, 2) for i in top_indices]

        predicted_disease = top_diseases[0]
        main_index = list(classes).index(pred)
        main_proba = round(float(probabilities[main_index]) * 100, 2)
        
        if main_proba < 5:
                    main_proba = round(float(probabilities[top_indices[0]]) * 100, 2)

        alternative= []
        for i in range(1, len(top_diseases)):
            alt_name = top_diseases[i]
            alt_prob = top_probs[i]
            if alt_prob > 1:  
                alternative.append(f"{alt_name} ({alt_prob}%)")
        if not alternative:
            alternative = ["No strong alternative diseases detected."]


    
        recommendation = f"For {predicted_disease}, it's best to consult a specialist doctor and follow a healthy routine."

        response_data = {
            "predicted_disease": predicted_disease,
            "probability": main_proba,
            "alternative_diseases": alternative,
           
             "symptoms": [ col for col in FEATURE_ORDER
                     if str(row[col]).strip() not in ["0", "00", "000", "no", "missing", "", None]],
            "recommendation": recommendation,
           
        }

        return Response(response_data, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)





@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_doctors_for_disease(request):
    disease = request.data.get('disease')
    specializations = DISEASE_SPECIALIZATION.get(disease, [])
    doctors = Doctor.objects.all()
    filtered = []
    for doc in doctors:
        doc_specs = [s.strip() for s in doc.specialization.replace(',', '/').split('/')]
        if any(spec in doc_specs for spec in specializations):
            filtered.append({

                "id": doc.id,
                "full_name": doc.full_name,
                "specialization": doc.specialization,
                "hospital_name": doc.hospital_name,
                "mobile_number": doc.mobile_number,
                "address": doc.address,
                "district": doc.district,
                "state": doc.state
            })
    return Response({"doctors": filtered})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_assigned_patients(request, username):
    try:
        
        doctor = Doctor.objects.get(user__username=username)
        assigned = AssignedPatient.objects.filter(doctor=doctor).select_related("patient")

        data = [
            {
                "id": a.patient.id,
                "full_name": a.patient.full_name,
                "age": a.patient.age,
                "blood_group": a.patient.blood_group,
                "mobile_number": a.patient.mobile_number,
                "district": a.patient.district,
                "state": a.patient.state,
            }
            for a in assigned
        ]
        return Response(data, status=status.HTTP_200_OK)

    except Doctor.DoesNotExist:
        return Response({"error": "Doctor not found"}, status=status.HTTP_404_NOT_FOUND)


from rest_framework.permissions import IsAuthenticated

class DoctorDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({"message": f"Welcome Dr. {user.username}!"})
    

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request, username):
    try:
        user = CustomUser.objects.get(username=username)
        role = "patient" if hasattr(user, 'patient') else "doctor" if hasattr(user, 'doctor') else "unknown"

        return Response({
            "username": user.username,
            "role": role,
        })
    except CustomUser.DoesNotExist:
        return Response({"error": "User not found"}, status=404)
    



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def assign_patient(request):
    patient_id = request.data.get("patient_id")
    doctor_id = request.data.get("doctor_id")
    try:
        from .models import Patient, Doctor, AssignedPatient
        patient = Patient.objects.get(id=patient_id)
        doctor = Doctor.objects.get(id=doctor_id)

        if AssignedPatient.objects.filter(patient=patient, doctor=doctor).exists():
            return Response({"message": "Patient already assigned to this doctor."})

        AssignedPatient.objects.create(patient=patient, doctor=doctor)
        return Response({"message": f"Patient {patient.full_name} assigned to Dr. {doctor.full_name}."})

    except Patient.DoesNotExist:
        return Response({"error": "Patient not found"}, status=404)
    except Doctor.DoesNotExist:
        return Response({"error": "Doctor not found"}, status=404)
    

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Patient, Doctor

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def assign_slot(request):
    try:

        patient_id = request.data.get('patient_id')
        doctor_username = request.data.get('doctor_username')
        date = request.data.get('date')
        time_slot = request.data.get('time_slot')

        if not  all([patient_id, doctor_username, date, time_slot]):    
            return Response(
                {"error": "patient_id and doctor_id are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        
        try:
            patient = Patient.objects.get(id=patient_id)
        except Patient.DoesNotExist:
            return Response({"error": "Patient not found"}, status=status.HTTP_404_NOT_FOUND)

        try:
            doctor = Doctor.objects.get(user__username=doctor_username)
        except Doctor.DoesNotExist:
            return Response({"error": "Doctor not found"}, status=status.HTTP_404_NOT_FOUND)

    
        from datetime import datetime
        appointment_date = datetime.strptime(date, "%Y-%m-%d").date()
        appointment_time = datetime.strptime(time_slot, "%H:%M").time()


        Appointment.objects.create(
        doctor=doctor,
        patient=patient,
        appointment_date=appointment_date,
        appointment_time=appointment_time,
        status="Accepted"
    )

        return Response({"message": "Slot assigned successfully!"}, status=201)

    except Exception as e:
       
                 print("Assign slot error:", e)
    return Response(
            {"error": "Internal server error. Check server logs."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_patient_appointments(request, patient_id):
    try:
        patient = Patient.objects.get(id=patient_id)
        appointments = Appointment.objects.filter(patient=patient)

        data = [{
            "doctor_name": a.doctor.full_name,
            "appointment_date": a.appointment_date,
            "appointment_time": a.appointment_time,  
            "status": a.status
        } for a in appointments]

        return Response(data, status=200)

    except Patient.DoesNotExist:
        return Response({"error": "Patient not found"}, status=404)

