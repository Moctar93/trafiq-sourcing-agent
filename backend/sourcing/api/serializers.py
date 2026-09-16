from rest_framework import serializers
from sourcing.models import (
    User, Company, SourceProfile, ModelVersion, 
    Signal, Contact, Campaign, Activity, ProspectScore
)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'created_at']
        read_only_fields = ['id', 'created_at']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name', 'role']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            role=validated_data.get('role', 'sdr')
        )
        return user

class SignalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Signal
        fields = ['id_signal', 'signal_type', 'value', 'source', 'detected_at']

class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = ['id_contact', 'first_name', 'last_name', 'position', 'email', 'linkedin_url']

class ProspectScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProspectScore
        fields = ['id_score', 'fit_score', 'need_score', 'intent_score', 'opportunity_score', 'final_score', 'confidence', 'explanation', 'updated_at']

class CompanySerializer(serializers.ModelSerializer):
    signals = SignalSerializer(many=True, read_only=True)
    contacts = ContactSerializer(many=True, read_only=True)
    scores = ProspectScoreSerializer(many=True, read_only=True)
    latest_signal = serializers.SerializerMethodField()

    class Meta:
        model = Company
        fields = [
            'id_company', 'name', 'website', 'sector', 
            'employee_count', 'created_at', 'signals', 
            'contacts', 'scores', 'latest_signal'
        ]

    def validate_employee_count(self, value):
        if value < 0:
            raise serializers.ValidationError("Le nombre d'employés ne peut pas être négatif.")
        return value

    def get_latest_signal(self, obj):
        latest = obj.signals.order_by('-detected_at').first()
        return latest.value if latest else "Aucun signal"

class SourceProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = SourceProfile
        fields = [
            'id_profile', 'name', 'region', 'target_sectors',
            'min_employees', 'max_employees',
            'fit_weight', 'need_weight', 'intent_weight', 'created_at'
        ]
        read_only_fields = ['id_profile', 'created_at']

class ModelVersionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ModelVersion
        fields = '__all__'

class CampaignSerializer(serializers.ModelSerializer):
    class Meta:
        model = Campaign
        fields = '__all__'

class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = '__all__'