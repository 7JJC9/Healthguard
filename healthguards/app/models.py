from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings

class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('patient', 'Patient'),
        ('doctor', 'Doctor'),
      
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='patient')

    def __str__(self):
        return f"{self.username} ({self.role})"


class Patient(models.Model):

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    full_name = models.CharField(max_length=100)
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=10)
    age = models.IntegerField()
    blood_group = models.CharField(max_length=5)
    address = models.TextField()
    mobile_number = models.CharField(max_length=15)
    state = models.CharField(max_length=50)
    district = models.CharField(max_length=50)

    def __str__(self):
        return self.full_name
    
class Doctor(models.Model):

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    full_name = models.CharField(max_length=100)
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=10)
    age = models.IntegerField()
    blood_group = models.CharField(max_length=5)
    address = models.TextField()
    mobile_number = models.CharField(max_length=15)

    specialization = models.CharField(max_length=100, blank=True, null=True)
    hospital_name = models.CharField(max_length=100, blank=True, null=True)
    
    state = models.CharField(max_length=50)
    district = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.full_name} - {self.specialization}"
    


class AssignedPatient(models.Model):
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name="assigned_patients")
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name="assigned_doctors")
    assigned_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.patient.full_name} → Dr. {self.doctor.full_name}"



class Appointment(models.Model):
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    appointment_date = models.DateField()
    appointment_time = models.TimeField()
    status = models.CharField(max_length=20, default="Pending")
