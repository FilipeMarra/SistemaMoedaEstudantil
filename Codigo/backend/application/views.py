from decimal import Decimal, InvalidOperation

from django.contrib.auth.hashers import make_password
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework import generics, permissions, status
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet

from django.contrib.auth.models import User

from .models import (
    Aluno,
    Curso,
    EmpresaParceira,
    InstituicaoEnsino,
    Professor,
    Transacao,
    Vantagem,
)
from .serializers import (
    AlunoSerializer,
    CursoSerializer,
    EmpresaParceiraSerializer,
    EmpresaSerializer,
    InstituicaoSerializer,
    ProfessorSerializer,
    TransacaoSerializer,
    UserSerializer,
    UsuarioCompletoSerializer,
    VantagemSerializer,
)


class MeView(APIView):
    """
    Retorna os dados completos do usuário logado.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        # Evita quebrar caso o usuário não esteja autenticado.
        if not request.user or not request.user.is_authenticated:
            return Response(
                {"detail": "Usuário não autenticado."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        serializer = UsuarioCompletoSerializer(request.user)
        return Response(serializer.data)


class SaldoView(APIView):
    """
    Retorna o saldo do aluno ou professor a partir do ID do usuário.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        user_id = request.query_params.get("id")  # /api/saldo/?id=3

        if not user_id:
            return Response(
                {"erro": "Parâmetro 'id' é obrigatório."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        aluno = Aluno.objects.filter(perfil__user__id=user_id).first()
        if aluno:
            return Response(
                {
                    "tipo": "aluno",
                    "id": aluno.id,
                    "saldo": aluno.saldo,
                    "nome": aluno.perfil.user.username,
                },
                status=status.HTTP_200_OK,
            )

        professor = Professor.objects.filter(perfil__user__id=user_id).first()
        if professor:
            return Response(
                {
                    "tipo": "professor",
                    "id": professor.id,
                    "saldo": professor.saldo,
                    "nome": professor.perfil.user.username,
                },
                status=status.HTTP_200_OK,
            )

        return Response(
            {"erro": "Usuário não encontrado."},
            status=status.HTTP_404_NOT_FOUND,
        )


class InstituicaoListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    queryset = InstituicaoEnsino.objects.all()
    serializer_class = InstituicaoSerializer


class CursoListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = CursoSerializer

    def get_queryset(self):
        instituicao_id = self.kwargs.get("instituicao_id")
        return Curso.objects.filter(instituicao_id=instituicao_id)


class TransferirMoedasView(APIView):
    """
    Professor transfere moedas para um aluno.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            remetente_id = request.data.get("remetente_id")
            destinatario_id = request.data.get("destinatario_id")
            valor_str = request.data.get("valor")

            if not remetente_id or not destinatario_id:
                return Response(
                    {"erro": "IDs inválidos."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if not valor_str:
                return Response(
                    {"erro": "Valor não informado."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            try:
                valor = Decimal(valor_str)
            except (TypeError, InvalidOperation):
                return Response(
                    {"erro": "Valor inválido."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            remetente_professor = Professor.objects.get(
                perfil__user__id=remetente_id
            )
            destinatario_aluno = Aluno.objects.get(id=destinatario_id)

            # Verifica saldo suficiente
            if remetente_professor.saldo < valor:
                return Response(
                    {"erro": "Saldo insuficiente."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Realiza a transferência
            remetente_professor.saldo -= valor
            destinatario_aluno.saldo += valor
            remetente_professor.save()
            destinatario_aluno.save()

            # Registro de envio (professor -> aluno)
            Transacao.objects.create(
                tipo=Transacao.TipoTransacao.ENVIO,
                valor=valor,
                professor=remetente_professor,
                aluno=destinatario_aluno,
                mensagem=(
                    f"Transferência de {valor} moedas de "
                    f"{remetente_professor.perfil.user.username} "
                    f"para {destinatario_aluno.perfil.user.username}"
                ),
            )

            # Registro de recebimento (para histórico do aluno)
            Transacao.objects.create(
                tipo=Transacao.TipoTransacao.RECEBIDO,
                valor=valor,
                professor=remetente_professor,
                aluno=destinatario_aluno,
                mensagem=(
                    f"Recebeu {valor} moedas de "
                    f"{remetente_professor.perfil.user.username}"
                ),
            )

            return Response(
                {
                    "mensagem": "Transferência realizada com sucesso!",
                    "remetente": ProfessorSerializer(remetente_professor).data,
                    "destinatario": AlunoSerializer(destinatario_aluno).data,
                },
                status=status.HTTP_200_OK,
            )

        except Aluno.DoesNotExist:
            return Response(
                {"erro": "Aluno não encontrado."},
                status=status.HTTP_404_NOT_FOUND,
            )
        except Professor.DoesNotExist:
            return Response(
                {"erro": "Professor não encontrado."},
                status=status.HTTP_404_NOT_FOUND,
            )
        except Exception as e:
            return Response({"erro": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name="dispatch")
class AlunoCreateView(generics.CreateAPIView):
    serializer_class = AlunoSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)


class UserViewSet(ModelViewSet):
    """
    Endpoint da API que permite que os usuários sejam vistos ou editados.
    """
    queryset = User.objects.all().order_by("-date_joined")
    serializer_class = UserSerializer


class ResetarSenha(APIView):
    """
    Endpoint para redefinição simples de senha via e-mail.
    """
    permission_classes = [AllowAny]

    def patch(self, request):
        email = request.data.get("email")
        nova_senha = request.data.get("nova_senha")

        if not email or not nova_senha:
            return Response(
                {"erro": "Dados incompletos."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {"erro": "Usuário não encontrado."},
                status=status.HTTP_404_NOT_FOUND,
            )

        user.password = make_password(nova_senha)
        user.save()

        return Response(
            {"mensagem": "Senha alterada com sucesso!"},
            status=status.HTTP_200_OK,
        )


class AlunoViewSet(ModelViewSet):
    queryset = Aluno.objects.all()
    serializer_class = AlunoSerializer
    permission_classes = [permissions.AllowAny]

    @action(detail=False, methods=["get"])
    def recentes(self, request):
        """Retorna os 3 últimos alunos cadastrados."""
        alunos_recentes = Aluno.objects.all().order_by("-id")[:3]
        serializer = self.get_serializer(alunos_recentes, many=True)
        return Response(serializer.data)


class TransacaoViewSet(ModelViewSet):
    queryset = Transacao.objects.all()
    serializer_class = TransacaoSerializer
    permission_classes = [permissions.AllowAny]

    @action(detail=False, methods=["get"])
    def recentes(self, request):
        """Retorna as 3 últimas transações cadastradas."""
        transacoes_recentes = Transacao.objects.all().order_by("-id")[:3]
        serializer = self.get_serializer(transacoes_recentes, many=True)
        return Response(serializer.data)


class EmpresasParceirasSet(ModelViewSet):
    queryset = EmpresaParceira.objects.all().order_by("nome_fantasia")
    serializer_class = EmpresaParceiraSerializer
    permission_classes = [AllowAny]

    @action(
        detail=False,
        methods=["get"],
        url_path=r"por_EmpresaParceira/(?P<nome_fantasia>[^/.]+)",
    )
    def por_EmpresaParceira(self, request, nome_fantasia=None):
        empresas = EmpresaParceira.objects.filter(nome_fantasia=nome_fantasia)
        serializer = EmpresaParceiraSerializer(empresas, many=True)
        return Response(serializer.data)


@method_decorator(csrf_exempt, name="dispatch")
class ProfessorCreateView(generics.CreateAPIView):
    serializer_class = ProfessorSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)


@method_decorator(csrf_exempt, name="dispatch")
class EmpresaCreateView(generics.CreateAPIView):
    serializer_class = EmpresaSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)


class VantagemCreateView(generics.CreateAPIView):
    serializer_class = VantagemSerializer
    permission_classes = [permissions.AllowAny]  # mantém AllowAny

    def perform_create(self, serializer):
        # pega o ID do usuário (empresa) que veio no corpo da requisição
        user_id = self.request.data.get("empresa")

        if not user_id:
            raise ValidationError({"empresa": "ID do usuário não enviado."})

        try:
            empresa = EmpresaParceira.objects.get(perfil__user__id=user_id)
        except EmpresaParceira.DoesNotExist:
            raise ValidationError(
                {"empresa": f"Usuário {user_id} não é uma empresa válida."}
            )

        serializer.save(empresa=empresa)


class VantagemViewSet(ModelViewSet):
    queryset = Vantagem.objects.all().order_by("-id")
    serializer_class = VantagemSerializer
    permission_classes = [AllowAny]

    @action(detail=True, methods=["post"], url_path="comprar")
    def comprar(self, request, pk=None):
        """
        Realiza a compra de uma vantagem por um aluno.
        """
        try:
            user_id = request.data.get("user_id")
            vantagem = self.get_object()

            if not user_id:
                return Response(
                    {"erro": "user_id é obrigatório."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Tenta achar o aluno vinculado ao user_id
            aluno = Aluno.objects.filter(perfil__user__id=user_id).first()
            if not aluno:
                return Response(
                    {"erro": "Aluno não encontrado."},
                    status=status.HTTP_404_NOT_FOUND,
                )

            custo = Decimal(vantagem.custo_moedas)

            # Verifica se tem saldo suficiente
            if aluno.saldo < custo:
                return Response(
                    {"erro": "Saldo insuficiente."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Desconta saldo do aluno
            aluno.saldo -= custo
            aluno.save()

            # Marca vantagem como comprada (controle global simples)
            vantagem.comprado = True
            vantagem.save()

            # Cria transação de compra
            Transacao.objects.create(
                tipo=Transacao.TipoTransacao.COMPRA,
                valor=custo,
                aluno=aluno,
                vantagem=vantagem,
                mensagem=(
                    f"Compra da vantagem '{vantagem.nome}' "
                    f"por {custo} moedas"
                ),
            )

            return Response(
                {
                    "mensagem": "Compra realizada com sucesso!",
                    "novo_saldo": aluno.saldo,
                },
                status=status.HTTP_200_OK,
            )

        except Exception as e:
            return Response({"erro": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["get"], url_path="minhas")
    def minhas(self, request):
        """
        Lista vantagens compradas pelo aluno (baseado nas transações de COMPRA).
        """
        user_id = request.query_params.get("user_id")
        if not user_id:
            return Response(
                {"erro": "user_id é obrigatório."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        aluno = Aluno.objects.filter(perfil__user__id=user_id).first()
        if not aluno:
            return Response(
                {"erro": "Aluno não encontrado."},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Busca transações de COMPRA do aluno e extrai as vantagens associadas
        transacoes_compra = (
            Transacao.objects.filter(
                aluno=aluno,
                tipo=Transacao.TipoTransacao.COMPRA,
            )
            .select_related("vantagem")
            .order_by("-data")
        )

        vantagens = [
            t.vantagem for t in transacoes_compra if t.vantagem is not None
        ]

        serializer = self.get_serializer(vantagens, many=True)
        return Response(serializer.data)


class UsuarioByIdView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {"erro": "Usuário não encontrado"},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = UsuarioCompletoSerializer(user)
        return Response(serializer.data)
