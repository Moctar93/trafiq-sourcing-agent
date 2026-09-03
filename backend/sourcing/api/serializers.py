from rest_framework import serializers
from sourcing.models import User, Company, SourceProfile, ModelVersion, Signal, Contact, Campaign, Activity, ProspectScore

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

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = '__all__'

    def validate_employee_count(self, value):
        if value < 0:
            raise serializers.ValidationError("Le nombre d'employés ne peut pas être négatif.")
        return value

class SourceProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = SourceProfile
        fields = '__all__'

class ModelVersionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ModelVersion
        fields = '__all__'

class SignalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Signal
        fields = '__all__'

class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = '__all__'

class CampaignSerializer(serializers.ModelSerializer):
    class Meta:
        model = Campaign
        fields = '__all__'

class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = '__all__'

class ProspectScoreSerializer(serializers.ModelSerializer):
    company_detail = CompanySerializer(source='company', read_only=True)

    class Meta:
        model = ProspectScore
        fields = '__all__'