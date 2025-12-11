from django.db import models
from django.contrib.auth.models import User
import uuid
import string
import random


# ==========================================================
# PERFIL DE USUÁRIO (para diferenciar tipos)
# ==========================================================
class PerfilUsuario(models.Model):
    class TipoUsuario(models.TextChoices):
        ALUNO = "ALUNO", "Aluno"
        PROFESSOR = "PROFESSOR", "Professor"
        EMPRESA = "EMPRESA", "Empresa Parceira"

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="perfil",
    )
    tipo = models.CharField(
        max_length=20,
        choices=TipoUsuario.choices,
    )
    cpf = models.CharField(max_length=14, blank=True, null=True)
    rg = models.CharField(max_length=20, blank=True, null=True)
    endereco = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self) -> str:
        return f"{self.user.username} ({self.get_tipo_display()})"


# ==========================================================
# INSTITUIÇÃO E CURSO
# ==========================================================
class InstituicaoEnsino(models.Model):
    nome = models.CharField(max_length=255)
    cnpj = models.CharField(max_length=20, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    telefone = models.CharField(max_length=20, blank=True, null=True)
    endereco = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self) -> str:
        return self.nome


class Curso(models.Model):
    nome = models.CharField(max_length=255)
    instituicao = models.ForeignKey(
        InstituicaoEnsino,
        on_delete=models.CASCADE,
        related_name="cursos",
    )

    def __str__(self) -> str:
        return f"{self.nome} - {self.instituicao.nome}"


# ==========================================================
# ALUNO
# ==========================================================
class Aluno(models.Model):
    perfil = models.OneToOneField(
        PerfilUsuario,
        on_delete=models.CASCADE,
        related_name="aluno_perfil",
    )
    instituicao = models.ForeignKey(
        InstituicaoEnsino,
        on_delete=models.CASCADE,
        related_name="alunos",
    )
    curso = models.ForeignKey(
        Curso,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    saldo = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def __str__(self) -> str:
        return self.perfil.user.get_full_name() or self.perfil.user.username


# ==========================================================
# PROFESSOR
# ==========================================================
class Professor(models.Model):
    perfil = models.OneToOneField(
        PerfilUsuario,
        on_delete=models.CASCADE,
        related_name="professor_perfil",
    )
    instituicao = models.ForeignKey(
        InstituicaoEnsino,
        on_delete=models.CASCADE,
        related_name="professores",
    )
    departamento = models.CharField(max_length=255)
    saldo = models.DecimalField(max_digits=10, decimal_places=2, default=1000)

    def __str__(self) -> str:
        # BUG original: usava self.user, que não existe no model.
        return f"Prof. {self.perfil.user.get_full_name() or self.perfil.user.username}"


# ==========================================================
# EMPRESA PARCEIRA
# ==========================================================
class EmpresaParceira(models.Model):
    perfil = models.OneToOneField(
        PerfilUsuario,
        on_delete=models.CASCADE,
        related_name="empresa_perfil",
    )
    nome_fantasia = models.CharField(max_length=255)
    cnpj = models.CharField(max_length=20, unique=True)
    descricao = models.TextField(blank=True, null=True)

    def __str__(self) -> str:
        return self.nome_fantasia


# ==========================================================
# VANTAGENS
# ==========================================================
class Vantagem(models.Model):
    empresa = models.ForeignKey(
        EmpresaParceira,
        on_delete=models.CASCADE,
        related_name="vantagens",
    )
    nome = models.CharField(max_length=255)
    descricao = models.TextField()
    custo_moedas = models.DecimalField(max_digits=10, decimal_places=2)
    foto_url = models.URLField(max_length=500, blank=True, null=True)
    comprado = models.BooleanField(default=False)

    # Código único da vantagem (ex.: usado em e-mail ou resgate)
    codigo = models.CharField(
        max_length=6,
        unique=True,
        editable=False,
        blank=True,
    )

    def __str__(self) -> str:
        return f"{self.nome} ({self.empresa.nome_fantasia})"

    def _gerar_codigo(self) -> str:
        """Gera um código aleatório de 6 caracteres (letras + números)."""
        letras_numeros = string.ascii_uppercase + string.digits
        return "".join(random.choices(letras_numeros, k=6))

    def save(self, *args, **kwargs) -> None:
        """
        Garante que o campo `codigo` seja preenchido apenas na criação
        e que seja único no banco.
        """
        if not self.codigo:
            novo_codigo = self._gerar_codigo()
            while Vantagem.objects.filter(codigo=novo_codigo).exists():
                novo_codigo = self._gerar_codigo()
            self.codigo = novo_codigo

        super().save(*args, **kwargs)


# ==========================================================
# TRANSACOES
# ==========================================================
class Transacao(models.Model):
    class TipoTransacao(models.TextChoices):
        ENVIO = "ENVIO", "Envio de Moedas (Professor → Aluno)"
        RESGATE = "RESGATE", "Resgate de Vantagem (Aluno → Empresa)"
        RECEBIDO = "RECEBIDO", "Recebeu Moedas (Aluno → Professor)"
        COMPRA = "COMPRA", "Compra de Vantagem (Aluno)"

    id_transacao = models.UUIDField(
        default=uuid.uuid4,
        editable=False,
        unique=True,
    )
    tipo = models.CharField(
        max_length=20,
        choices=TipoTransacao.choices,
    )
    data = models.DateTimeField(auto_now_add=True)
    valor = models.DecimalField(max_digits=10, decimal_places=2)
    mensagem = models.TextField(blank=True, null=True)

    professor = models.ForeignKey(
        Professor,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    aluno = models.ForeignKey(
        Aluno,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    vantagem = models.ForeignKey(
        Vantagem,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )

    class Meta:
        ordering = ("-data",)

    def __str__(self) -> str:
        return f"{self.tipo} - {self.id_transacao}"


# ==========================================================
# NOTIFICAÇÕES
# ==========================================================
class Notificacao(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    mensagem = models.TextField()
    data_envio = models.DateTimeField(auto_now_add=True)
    lida = models.BooleanField(default=False)

    def __str__(self) -> str:
        return f"Notificação para {self.user.username}"
