from django.db import models
from django.contrib.auth.models import AbstractUser

#  Utilisateur (Extension du modèle User Django)
class User(AbstractUser):
    ROLE_CHOICES = (
        ('sdr', 'SDR / Commercial'),
        ('admin', 'Administrateur'),
    )
    role = models.CharField(max_length=50, choices=ROLE_CHOICES, default='sdr')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'USER'

    def __str__(self):
        return f"{self.username} ({self.role})"


# Entreprise
class Company(models.Model):
    id_company = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    website = models.URLField(max_length=255, blank=True, null=True)
    sector = models.CharField(max_length=100, blank=True, null=True)
    employee_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'COMPANY'

    def __str__(self):
        return self.name


# Profil Cible / Sourcing
class SourceProfile(models.Model):
    id_profile = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    target_sectors = models.TextField(blank=True, null=True)
    min_employees = models.IntegerField(default=0)
    max_employees = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'SOURCE_PROFILE'

    def __str__(self):
        return self.name


# Version du Modèle ML
class ModelVersion(models.Model):
    id_model = models.AutoField(primary_key=True)
    version_code = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'MODEL_VERSION'

    def __str__(self):
        return self.version_code


# Signaux Faibles
class Signal(models.Model):
    id_signal = models.AutoField(primary_key=True)
    signal_type = models.CharField(max_length=100)
    value = models.TextField(blank=True, null=True)
    source = models.CharField(max_length=100, blank=True, null=True)
    detected_at = models.DateTimeField(auto_now_add=True)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, db_column='id_company', related_name='signals')

    class Meta:
        db_table = 'SIGNAL'

    def __str__(self):
        return f"{self.signal_type} - {self.company.name}"


# Contact
class Contact(models.Model):
    id_contact = models.AutoField(primary_key=True)
    first_name = models.CharField(max_length=100, blank=True, null=True)
    last_name = models.CharField(max_length=100, blank=True, null=True)
    position = models.CharField(max_length=150, blank=True, null=True)
    email = models.EmailField(max_length=255, blank=True, null=True)
    linkedin_url = models.URLField(max_length=500, blank=True, null=True)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, db_column='id_company', related_name='contacts')

    class Meta:
        db_table = 'CONTACT'

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.company.name})"


#  Campagne
class Campaign(models.Model):
    id_campaign = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    status = models.CharField(max_length=50, default='draft')
    created_at = models.DateTimeField(auto_now_add=True)
    profile = models.ForeignKey(SourceProfile, on_delete=models.CASCADE, db_column='id_profile', related_name='campaigns')

    class Meta:
        db_table = 'CAMPAIGN'

    def __str__(self):
        return self.name


# Activités Commerciales
class Activity(models.Model):
    id_activity = models.AutoField(primary_key=True)
    status = models.CharField(max_length=50, blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, db_column='id_company', related_name='activities')
    user = models.ForeignKey(User, on_delete=models.CASCADE, db_column='id_user', related_name='activities')

    class Meta:
        db_table = 'ACTIVITY'


# Scoring des Prospects
class ProspectScore(models.Model):
    id_score = models.AutoField(primary_key=True)
    fit_score = models.FloatField(default=0.0)
    need_score = models.FloatField(default=0.0)
    intent_score = models.FloatField(default=0.0)
    opportunity_score = models.FloatField(default=0.0)
    final_score = models.FloatField(default=0.0)
    confidence = models.FloatField(default=0.0)
    explanation = models.TextField(blank=True, null=True)
    model_version = models.CharField(max_length=50, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)

    model = models.ForeignKey(ModelVersion, on_delete=models.CASCADE, db_column='id_model', related_name='scores')
    profile = models.ForeignKey(SourceProfile, on_delete=models.CASCADE, db_column='id_profile', related_name='scores')
    company = models.ForeignKey(Company, on_delete=models.CASCADE, db_column='id_company', related_name='scores')

    class Meta:
        db_table = 'PROSPECT_SCORE'

    def __str__(self):
        return f"Score {self.final_score} - {self.company.name}"