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

# ==========================================================
# USER
# ==========================================================
class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }


# ==========================================================
# PERFIL
# ==========================================================
class PerfilUsuarioSerializer(ModelSerializer):
    user_detalhes = UserSerializer(source='user', read_only=True)

    class Meta:
        model = PerfilUsuario
        fields = ['id', 'user_detalhes', 'tipo', 'cpf', 'rg', 'endereco']


# ==========================================================
# CURSO / INSTITUIÇÃO
# ==========================================================
class CursoSerializer(ModelSerializer):
    class Meta:
        model = Curso
        fields = ['id', 'nome']


class InstituicaoSerializer(ModelSerializer):
    class Meta:
        model = InstituicaoEnsino
        fields = ['id', 'nome']


# ==========================================================
# ALUNO
# ==========================================================
class AlunoSerializer(ModelSerializer):
    # leitura detalhada
    perfil_detalhes = PerfilUsuarioSerializer(source='perfil', read_only=True)
    curso_detalhes = CursoSerializer(source='curso', read_only=True)
    instituicao_detalhes = InstituicaoSerializer(source='instituicao', read_only=True)

    # escrita (criação)
    user = UserSerializer(write_only=True)
    perfil = PerfilUsuarioSerializer(write_only=True)

    class Meta:
        model = Aluno
        fields = [
            'id',
            'user',
            'perfil',
            'instituicao',
            'curso',
            'saldo',
            # detalhes de leitura
            'perfil_detalhes',
            'curso_detalhes',
            'instituicao_detalhes',
        ]

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        perfil_data = validated_data.pop('perfil')

        # Cria usuário
        user = User.objects.create_user(
            username=user_data['username'],
            email=user_data.get('email', ''),
            password=user_data['password']
        )

        # Cria perfil
        perfil = PerfilUsuario.objects.create(
            user=user,
            tipo='ALUNO',  # fixo para esse caso
            cpf=perfil_data.get('cpf'),
            rg=perfil_data.get('rg'),
            endereco=perfil_data.get('endereco')
        )

        # Cria aluno (agora com perfil)
        aluno = Aluno.objects.create(
            perfil=perfil,
            **validated_data
        )

        return aluno


class ProfessorSerializer(ModelSerializer):
    # leitura detalhada
    perfil_detalhes = PerfilUsuarioSerializer(source='perfil', read_only=True)
    instituicao_detalhes = InstituicaoSerializer(source='instituicao', read_only=True)

    # escrita (criação)
    user = UserSerializer(write_only=True)
    perfil = PerfilUsuarioSerializer(write_only=True)

    class Meta:
        model = Professor
        fields = [
            'id',
            'user',
            'perfil',
            'instituicao',
            'saldo',
            # detalhes de leitura
            'perfil_detalhes',
            'instituicao_detalhes',
        ]

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        perfil_data = validated_data.pop('perfil')

        # Cria usuário
        user = User.objects.create_user(
            username=user_data['username'],
            email=user_data.get('email', ''),
            password=user_data['password']
        )

        # Cria perfil
        perfil = PerfilUsuario.objects.create(
            user=user,
            tipo='PROFESSOR',  # fixo para esse caso
            cpf=perfil_data.get('cpf')
        )

        # Cria aluno (agora com perfil)
        professor = Professor.objects.create(
            perfil=perfil,
            **validated_data
        )

        return professor

class EmpresaSerializer(ModelSerializer):
    # leitura detalhada
    perfil_detalhes = PerfilUsuarioSerializer(source='perfil', read_only=True)
    # escrita (criação)
    user = UserSerializer(write_only=True)
    perfil = PerfilUsuarioSerializer(write_only=True)

    class Meta:
        model = EmpresaParceira
        fields = [
            'id',
            'user',
            'perfil',
            'nome_fantasia',
            'cnpj',
            'descricao',
            # detalhes de leitura
            'perfil_detalhes',
        ]

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        perfil_data = validated_data.pop('perfil')
        # Cria usuário
        user = User.objects.create_user(
            username=user_data['username'],
            email=user_data.get('email', ''),
            password=user_data['password']
        )

        # Cria perfil
        perfil = PerfilUsuario.objects.create(
            user=user,
            tipo='EMPRESA',  # fixo para esse caso
            cpf=perfil_data.get('cpf')
        )

        # Cria aluno (agora com perfil)
        empresa = EmpresaParceira.objects.create(
            perfil=perfil,
            **validated_data
        )

        return empresa

class VantagemSerializer(ModelSerializer):
    class Meta:
        model = Vantagem
        fields = ['id', 'empresa', 'nome', 'descricao', 'custo_moedas', 'foto']        
class TransacaoSerializer(ModelSerializer):
    # Campos detalhados (somente leitura)
    professor_detalhes = ProfessorSerializer(source='professor', read_only=True)
    aluno_detalhes = AlunoSerializer(source='aluno', read_only=True)
    vantagem_detalhes = VantagemSerializer(source='vantagem', read_only=True)

    class Meta:
        model = Transacao
        fields = [
            'id_transacao',
            'tipo',
            'data',
            'valor',
            'mensagem',
            'professor',
            'aluno',
            'vantagem',
            # leitura detalhada
            'professor_detalhes',
            'aluno_detalhes',
            'vantagem_detalhes',
        ]
        

