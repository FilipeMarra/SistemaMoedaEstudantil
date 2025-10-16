from rest_framework.serializers import *
from .models import *
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password

# como nos estamos usando o django para ser uma api rest agora, quando voce cria um model, 
# voce precisa criar um serializer para dizer como que o seu modelo será traduzido para um json

class EmpresaParceiraSerializer(ModelSerializer):
    class Meta:
        model = EmpresaParceira
        # Definimos quais campos do modelo serão expostos na API.
        fields = '__all__'

class InstituicaoSerializer(ModelSerializer):
    class Meta:
        model = InstituicaoEnsino
        fields = ['id', 'nome']


class CursoSerializer(ModelSerializer):
    class Meta:
        model = Curso
        fields = ['id', 'nome', 'instituicao']


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']


class PerfilUsuarioSerializer(ModelSerializer):
    class Meta:
        model = PerfilUsuario
        fields = ['cpf', 'rg', 'endereco']


class AlunoSerializer(ModelSerializer):
    user = UserSerializer()
    perfil = PerfilUsuarioSerializer()
    
    class Meta:
        model = Aluno
        fields = ['id', 'user', 'perfil', 'instituicao', 'curso', 'saldo']

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        perfil_data = validated_data.pop('perfil')
        user = User.objects.create_user(**user_data)
        perfil = PerfilUsuario.objects.create(user=user, tipo='ALUNO', **perfil_data)
        aluno = Aluno.objects.create(user=user, **validated_data)
        return aluno