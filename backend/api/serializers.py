from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Category, Location, ItemPost, Comment


class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=6)

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = '__all__'


class CommentSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'username', 'user', 'post', 'message', 'created_at']
        read_only_fields = ['id', 'user', 'created_at', 'username']


class ItemPostSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    location_name = serializers.CharField(source='location.name', read_only=True)
    building_name = serializers.CharField(source='location.building', read_only=True)

    class Meta:
        model = ItemPost
        fields = [
            'id',
            'title',
            'description',
            'item_type',
            'status',
            'date_event',
            'contact_info',
            'latitude',
            'longitude',
            'user',
            'username',
            'category',
            'category_name',
            'location',
            'location_name',
            'building_name',
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'id',
            'user',
            'created_at',
            'updated_at',
            'username',
            'category_name',
            'location_name',
            'building_name',
        ]