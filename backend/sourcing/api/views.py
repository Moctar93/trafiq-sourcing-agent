from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from sourcing.models import User, Company, SourceProfile, ModelVersion, Signal, Contact, Campaign, Activity, ProspectScore
from .serializers import (
    UserSerializer, RegisterSerializer, CompanySerializer, SourceProfileSerializer, 
    ModelVersionSerializer, SignalSerializer, ContactSerializer, 
    CampaignSerializer, ActivitySerializer, ProspectScoreSerializer
)

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Utilisateur créé avec succès"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer

class SourceProfileViewSet(viewsets.ModelViewSet):
    queryset = SourceProfile.objects.all()
    serializer_class = SourceProfileSerializer

class ModelVersionViewSet(viewsets.ModelViewSet):
    queryset = ModelVersion.objects.all()
    serializer_class = ModelVersionSerializer

class SignalViewSet(viewsets.ModelViewSet):
    queryset = Signal.objects.all()
    serializer_class = SignalSerializer

class ContactViewSet(viewsets.ModelViewSet):
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer

class CampaignViewSet(viewsets.ModelViewSet):
    queryset = Campaign.objects.all()
    serializer_class = CampaignSerializer

class ActivityViewSet(viewsets.ModelViewSet):
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer

class ProspectScoreViewSet(viewsets.ModelViewSet):
    queryset = ProspectScore.objects.all()
    serializer_class = ProspectScoreSerializer