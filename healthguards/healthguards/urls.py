"""
URL configuration for healthguards project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path 
from app.views import *
from rest_framework_simplejwt.views import ( TokenObtainPairView, TokenRefreshView,)
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/register/patient/', PatientCreateView.as_view(), name='register-patient'),
    path('api/register/doctor/', DoctorCreateView.as_view(), name='register-doctor'),

    path('api/login/', LoginView.as_view(), name='login'),
    path("api/logout/", logout_view, name="logout"),

    #  Patient/Doctor info
    path('api/patient/<str:username>/', patient_info, name='patient_info'),
    path('api/doctor/<str:username>/', doctor_info, name='doctor_info'),

    # Disease prediction
    path("predict/", predict_disease, name="predict-disease"),
    path('api/predict_doctors/', get_doctors_for_disease),


     #  Get assigned patients for doctor
    path("api/get_assigned_patients/<str:username>/", get_assigned_patients),


    # JWT token endpoints
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('api/profile/<str:username>/', user_profile, name='user_profile'),


    #  Assign patients to doctors
    path('api/assign-patient/', assign_patient, name='assign-patient'),


    path('api/assign-slot/',assign_slot, name='assign-slot'),
    path('api/patient-appointments/<int:patient_id>/',get_patient_appointments, name='patient-appointments'),


    

]




