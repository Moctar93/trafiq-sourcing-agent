from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    RegisterView, UserViewSet, CompanyViewSet, SourceProfileViewSet, 
    ModelVersionViewSet, SignalViewSet, ContactViewSet, 
    CampaignViewSet, ActivityViewSet, ProspectScoreViewSet
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
    # Endpoints CRUD REST
    path('', include(router.urls)),
]