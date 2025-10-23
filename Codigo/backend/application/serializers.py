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
    password = CharField(write_only=True)  # 🔥 Adicionar isso

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'first_name', 'last_name']
        extra_kwargs = {
            'password': {'write_only': True}
        }


class PerfilUsuarioSerializer(ModelSerializer):
    class Meta:
        model = PerfilUsuario
        fields = ['cpf', 'rg', 'endereco']


class AlunoSerializer(ModelSerializer):
    user = UserSerializer()
    perfil = PerfilUsuarioSerializer(write_only=True)

    class Meta:
        model = Aluno
        fields = ('user', 'perfil', 'instituicao', 'curso')

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        perfil_data = validated_data.pop('perfil')

        # cria usuário com senha criptografada
        user = User.objects.create_user(
            username=user_data['username'],
            email=user_data['email'],
            password=user_data['password']
        )

        # cria perfil
        perfil = PerfilUsuario.objects.create(
            user=user,
            tipo='ALUNO',
            **perfil_data
        )

        # finalmente cria aluno
        aluno = Aluno.objects.create(
            user=user,
            **validated_data
        )

        return aluno
