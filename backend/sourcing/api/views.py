from rest_framework import viewsets, permissions, status
from rest_framework.permissions import AllowAny
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from sourcing.models import User, Company, SourceProfile, ModelVersion, Signal, Contact, Campaign, Activity, ProspectScore
from .serializers import (
    UserSerializer, RegisterSerializer, CompanySerializer, SourceProfileSerializer,
    ModelVersionSerializer, SignalSerializer, ContactSerializer,
    CampaignSerializer, ActivitySerializer, ProspectScoreSerializer, ProspectImportSerializer, CampaignSerializer
)

class ImportProspectsView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        prospects_data = request.data.get('prospects', [])
        
        #  Validation des données entrantes avec le Serializer
        serializer = ProspectImportSerializer(data=prospects_data, many=True)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        created_count = 0
        updated_count = 0

        # Utilisation des données validées
        for item in serializer.validated_data:
            name = item.get('name')
            raw_website = item.get('website', '').strip()
            action = item.get('action', 'Conserver')

            if not name:
                continue

            clean_website = raw_website.replace('https://', '').replace('http://', '').strip('/')
            
            # Recherche en base
            company = Company.objects.filter(website__icontains=clean_website).first() if clean_website else None

            if company:
                if action == 'Fusionner':
                    company.name = name
                    company.save()
                    updated_count += 1
            else:
                formatted_website = f"https://{clean_website}" if clean_website and not clean_website.startswith('http') else clean_website
                Company.objects.create(
                    name=name,
                    website=formatted_website
                )
                created_count += 1

        return Response({
            "message": "Importation et scoring initialisés.",
            "created": created_count,
            "updated": updated_count
        }, status=status.HTTP_201_CREATED)

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
    # Optimisation SQL : prefetch_related précharge les signaux, contacts et scores
    queryset = Company.objects.all().prefetch_related(
        'signals', 'contacts', 'scores').order_by('-created_at')
    serializer_class = CompanySerializer
    # Permet la lecture temporaire sans token pour le dev
    permission_classes = [AllowAny]


class SourceProfileViewSet(viewsets.ModelViewSet):
    queryset = SourceProfile.objects.all()
    serializer_class = SourceProfileSerializer
    permission_classes = [AllowAny]


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


class CampaignListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        campaigns = Campaign.objects.all().order_by('-created_at')
        serializer = CampaignSerializer(campaigns, many=True)

        active_count = campaigns.filter(status='En cours').count()

        # calcul des statistiuqe globales pour les cartes d'en-tête
        return Response({
            'active_campaigns_count': active_count,
            'qualified_rate_avg': 28, # Métrique dynamique ou constante à 28%
            'campaigns': serializer.data
        }, status=status.HTTP_200_OK)