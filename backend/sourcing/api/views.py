from rest_framework import viewsets, permissions, status
from rest_framework.permissions import AllowAny
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from sourcing.models import User, Company, SourceProfile, ModelVersion, Signal, Contact, Campaign, Activity, ProspectScore
from .serializers import (
    UserSerializer, RegisterSerializer, CompanySerializer, SourceProfileSerializer,
    ModelVersionSerializer, SignalSerializer, ContactSerializer,
    CampaignSerializer, ActivitySerializer, ProspectScoreSerializer, ProspectImportSerializer
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
        campaigns = Campaign.objects.select_related('profile').all().order_by('-created_at')
        serializer = CampaignSerializer(campaigns, many=True)

        active_count = campaigns.filter(status='En cours').count()

        return Response({
            'active_campaigns_count': active_count,
            'qualified_rate_avg': 28,
            'campaigns': serializer.data
        }, status=status.HTTP_200_OK)

class CreateCampaignView(APIView):
    permission_classes = [AllowAny]

    # GET: Récupère la liste des profils de sourcing disponibles
    def get(self, request):
        profiles = SourceProfile.objects.all().values('id_profile', 'name', 'region')
        return Response({'profiles': list(profiles)}, status=status.HTTP_200_OK)

    # POST: Crée la nouvelle campagne
    def post(self, request):
        name = request.data.get('name')
        profile_id = request.data.get('profile_id')

        if not name or not profile_id:
            return Response(
                {"error": "Le nom de la campagne et le profil sont obligatoires."},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            profile = SourceProfile.objects.get(pk=profile_id)
            campaign = Campaign.objects.create(
                name=name,
                profile=profile,
                status='En cours'
            )
            return Response(
                {
                    "message": "Campagne créée avec succès",
                    "id_campaign": campaign.id_campaign,
                    "name": campaign.name
                },
                status=status.HTTP_201_CREATED
            )
        except SourceProfile.DoesNotExist:
            return Response({"error": "Profil de sourcing introuvalble."}, status=status.HTTP_404_NOT_FOUND )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)