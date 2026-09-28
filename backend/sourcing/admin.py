from django.contrib import admin
from .models import User, Company, SourceProfile, ModelVersion, Signal, Contact, Campaign, Activity, ProspectScore

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'role', 'created_at')
    list_filter = ('role', 'created_at')
    search_fields = ('username', 'email')

@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ('name', 'website', 'sector', 'employee_count', 'created_at')
    list_filter = ('sector', 'created_at')
    search_fields = ('name', 'sector')
    ordering = ('name',)

@admin.register(SourceProfile)
class SourceProfileAdmin(admin.ModelAdmin):
    list_display = ('name', 'region', 'min_employees', 'max_employees', 'created_at')
    search_fields = ('name', 'region')
    list_filter = ('region', 'created_at')

@admin.register(ModelVersion)
class ModelVersionAdmin(admin.ModelAdmin):
    list_display = ('version_code', 'description', 'created_at')
    search_fields = ('version_code',)

@admin.register(Signal)
class SignalAdmin(admin.ModelAdmin):
    list_display = ('company', 'signal_type', 'source', 'detected_at')
    list_filter = ('signal_type', 'source', 'detected_at')
    search_fields = ('company__name', 'signal_type')

@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'position', 'email', 'company')
    search_fields = ('first_name', 'last_name', 'email', 'company__name')
    list_filter = ('position',)

@admin.register(Campaign)
class CampaignAdmin(admin.ModelAdmin):
    list_display = ('name', 'status', 'profile', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('name',)

@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ('company', 'user', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('company__name', 'user__username')

@admin.register(ProspectScore)
class ProspectScoreAdmin(admin.ModelAdmin):
    list_display = ('company', 'final_score', 'confidence', 'model_version', 'updated_at')
    list_filter = ('model_version', 'updated_at')
    search_fields = ('company__name',)