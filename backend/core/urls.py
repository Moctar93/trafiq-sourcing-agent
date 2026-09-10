from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from sourcing.api.views import CompanyViewSet

router = DefaultRouter()
router.register(r'companies', CompanyViewSet, basename='company')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]