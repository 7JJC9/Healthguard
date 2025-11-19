
from rest_framework import serializers
from .models import CustomUser, Patient, Doctor
from django.contrib.auth.hashers import make_password


class PatientSerializer(serializers.ModelSerializer):
    username = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True)
    email = serializers.EmailField(write_only=True)

    class Meta:
        model = Patient
        fields = ['id', 'full_name', 'age', 'blood_group', 'mobile_number', 'username', 'password', 'email','address']

    
    def validate_username(self, value):
        if CustomUser.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already exists")
        return value
    


    def create(self, validated_data):
        username = validated_data.pop('username')
        password = validated_data.pop('password')
        email = validated_data.pop('email')

        user = CustomUser.objects.create(
            username=username,
            email=email,
            role='patient',
            password=make_password(password)
        )

        patient = Patient.objects.create(user=user, **validated_data)
        return patient


class DoctorSerializer(serializers.ModelSerializer):
    
    username = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True)
    email = serializers.EmailField(write_only=True)

    class Meta:
        model = Doctor
      
        fields = [
            'id', 'full_name', 'date_of_birth', 'gender', 'age', 'blood_group',
            'mobile_number', 'specialization', 'hospital_name',
            'state', 'district',
            'username', 'password', 'email'
        ]
  
    def validate_username(self, value):
        if CustomUser.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already exists")
        return value

    def create(self, validated_data):
        username = validated_data.pop('username')
        password = validated_data.pop('password')
        email = validated_data.pop('email')

        user = CustomUser.objects.create(
            username=username,
            email=email,
            role='doctor',
            password=make_password(password)
        )

        doctor = Doctor.objects.create(user=user, **validated_data)
        return doctor






