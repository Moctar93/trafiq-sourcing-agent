from django.test import TestCase
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from sourcing.models import Company, SourceProfile , ModelVersion

User = get_user_model()

class TrafiqAPITestCase(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username="sdr_user",
            email="sdr@trafiq.ai",
            password="Password123!",
            role="sdr"
        )
        self.client.force_authenticate(user=self.user)

        self.company = Company.objects.create(name="TechCorp", sector="SaaS")
        self.profile = SourceProfile.objects.create(name="Scale-up Target")
        self.model_version = ModelVersion.objects.create(version_code="v1.0.0")

    def test_create_signal_success(self):
        url = "/api/signals/"
        data = {
            "signal_type": "Levée de fonds",
            "value": "10M€",
            "source": "Crunchbase",
            "company": self.company.id_company
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_score_success(self):
        url = "/api/scores/"
        data = {
            "fit_score": 80,
            "need_score": 75,
            "intent_score": 85,
            "opportunity_score": 80,
            "final_score": 80,
            "confidence": 90,
            "explanation": "Bon alignement",
            "model_version": self.model_version.id_model,
            "profile": self.profile.id_profile,
            "company": self.company.id_company
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)