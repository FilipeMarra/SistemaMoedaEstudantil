from django.db import models
from django.contrib.auth.models import User
import uuid

from django.db import models
from django.contrib.auth.models import User

# ==========================================================
# PERFIL DE USUÁRIO (para diferenciar tipos)
# ==========================================================
class PerfilUsuario(models.Model):
    TIPO_USUARIO = [
        ('ALUNO', 'Aluno'),
        ('PROFESSOR', 'Professor'),
        ('EMPRESA', 'Empresa Parceira'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='perfil')
    tipo = models.CharField(max_length=20, choices=TIPO_USUARIO)
    cpf = models.CharField(max_length=14, blank=True, null=True)
    rg = models.CharField(max_length=20, blank=True, null=True)
    endereco = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"{self.user.username} ({self.tipo})"


# ==========================================================
# INSTITUIÇÃO E CURSO
# ==========================================================
class InstituicaoEnsino(models.Model):
    nome = models.CharField(max_length=255)
    cnpj = models.CharField(max_length=20, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    telefone = models.CharField(max_length=20, blank=True, null=True)
    endereco = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.nome


class Curso(models.Model):
    nome = models.CharField(max_length=255)
    instituicao = models.ForeignKey(InstituicaoEnsino, on_delete=models.CASCADE, related_name='cursos')

    def __str__(self):
        return f"{self.nome} - {self.instituicao.nome}"


# ==========================================================
# ALUNO
# ==========================================================
class Aluno(models.Model):
    perfil = models.OneToOneField(
        PerfilUsuario,
        on_delete=models.CASCADE,
        related_name='aluno_perfil'
    )    
    instituicao = models.ForeignKey(InstituicaoEnsino, on_delete=models.CASCADE, related_name='alunos')
    curso = models.ForeignKey(Curso, on_delete=models.SET_NULL, null=True, blank=True)
    saldo = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def __str__(self):
        return self.perfil.user.get_full_name() or self.perfil.user.username

# ==========================================================
# PROFESSOR
# ==========================================================
class Professor(models.Model):
    perfil = models.OneToOneField(
        PerfilUsuario,
        on_delete=models.CASCADE,
        related_name='professor_perfil'
    )  
    instituicao = models.ForeignKey(InstituicaoEnsino, on_delete=models.CASCADE, related_name='professores')
    departamento = models.CharField(max_length=255)
    saldo = models.DecimalField(max_digits=10, decimal_places=2, default=1000)

    def __str__(self):
        return f"Prof. {self.user.get_full_name()}"


# ==========================================================
# EMPRESA PARCEIRA
# ==========================================================
class EmpresaParceira(models.Model):
    perfil = models.OneToOneField(
        PerfilUsuario,
        on_delete=models.CASCADE,
        related_name='empresa_perfil'
    )        
    nome_fantasia = models.CharField(max_length=255)
    cnpj = models.CharField(max_length=20, unique=True)
    descricao = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.nome_fantasia


# ==========================================================
# VANTAGENS
# ==========================================================
class Vantagem(models.Model):
    empresa = models.ForeignKey(EmpresaParceira, on_delete=models.CASCADE, related_name='vantagens')
    nome = models.CharField(max_length=255)
    descricao = models.TextField()
    custo_moedas = models.DecimalField(max_digits=10, decimal_places=2)
    foto = models.ImageField(upload_to='vantagens/', blank=True, null=True)
    comprado = models.BooleanField(default=False) 
    def __str__(self):
        return f"{self.nome} ({self.empresa.nome_fantasia})"


# ==========================================================
# TRANSACOES
# ==========================================================
class Transacao(models.Model):
    TIPO_TRANSACAO = [
        ('ENVIO', 'Envio de Moedas (Professor → Aluno)'),
        ('RESGATE', 'Resgate de Vantagem (Aluno → Empresa)'),
        ('RECEBIDO', 'Recebeu Moedas (Aluno → Professor)'),
    ]

    id_transacao = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    tipo = models.CharField(max_length=20, choices=TIPO_TRANSACAO)
    data = models.DateTimeField(auto_now_add=True)
    valor = models.DecimalField(max_digits=10, decimal_places=2)
    mensagem = models.TextField(blank=True, null=True)

    professor = models.ForeignKey(Professor, on_delete=models.SET_NULL, null=True, blank=True)
    aluno = models.ForeignKey(Aluno, on_delete=models.SET_NULL, null=True, blank=True)
    vantagem = models.ForeignKey(Vantagem, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"{self.tipo} - {self.id_transacao}"


# ==========================================================
# NOTIFICAÇÕES
# ==========================================================
class Notificacao(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    mensagem = models.TextField()
    data_envio = models.DateTimeField(auto_now_add=True)
    lida = models.BooleanField(default=False)

    def __str__(self):
        return f"Notificação para {self.user.username}"
