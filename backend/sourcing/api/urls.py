from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    RegisterView, UserViewSet, CompanyViewSet, SourceProfileViewSet, 
    ModelVersionViewSet, SignalViewSet, ContactViewSet, 
    CampaignViewSet, ActivityViewSet, ProspectScoreViewSet, ImportProspectsView, CampaignListView, CreateCampaignView, MLPredictView, CampaignDetailView
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'companies', CompanyViewSet)
router.register(r'profiles', SourceProfileViewSet)
router.register(r'models', ModelVersionViewSet)
router.register(r'signals', SignalViewSet)
router.register(r'contacts', ContactViewSet)
router.register(r'campaigns', CampaignViewSet)
router.register(r'activities', ActivityViewSet)
router.register(r'scores', ProspectScoreViewSet)

urlpatterns = [

    # Authentification JWT

    path('auth/register/', RegisterView.as_view(), name='auth_register'),
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    
    path('import-prospects/', ImportProspectsView.as_view(), name='import-prospects'),
    path('campaigns/', CampaignListView.as_view(), name='campaign-list'),
    path('campaigns/create/', CreateCampaignView.as_view(), name='campaign-create'),
    path('audit-ml/predict/', MLPredictView.as_view(), name='ml-predict'),
    path('campaigns/<int:id_campaign>/', CampaignDetailView.as_view(), name='campaign-detail'),

    # Endpoints CRUD REST
    path('', include(router.urls)),
]