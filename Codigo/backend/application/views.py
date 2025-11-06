from rest_framework.viewsets import *
from rest_framework import generics, permissions,status
from .models import *
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated ,AllowAny
from .serializers import *
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.decorators import action
from rest_framework.response import Response
from decimal import Decimal
# from rest_framework.permissions import IsAuthenticated


class SaldoView(APIView):
    """
    Retorna o saldo do aluno ou professor a partir do ID do usuário.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        user_id = request.query_params.get("id")  # pega o id da URL: /api/saldo/?id=3

        if not user_id:
            return Response({"erro": "Parâmetro 'id' é obrigatório."}, status=status.HTTP_400_BAD_REQUEST)

        # tenta achar aluno com esse user_id
        aluno = Aluno.objects.filter(perfil__user__id=user_id).first()
        if aluno:
            return Response({
                "tipo": "aluno",
                "id": aluno.id,
                "saldo": aluno.saldo,
                "nome": aluno.perfil.user.username,
            }, status=status.HTTP_200_OK)

        # tenta achar professor
        professor = Professor.objects.filter(perfil__user__id=user_id).first()
        if professor:
            return Response({
                "tipo": "professor",
                "id": professor.id,
                "saldo": professor.saldo,
                "nome": professor.perfil.user.username,
            }, status=status.HTTP_200_OK)

        return Response({"erro": "Usuário não encontrado."}, status=status.HTTP_404_NOT_FOUND)

class InstituicaoListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    queryset = InstituicaoEnsino.objects.all()
    serializer_class = InstituicaoSerializer


class CursoListView(generics.ListAPIView):
    permission_classes = [AllowAny]
    
    serializer_class = CursoSerializer

    def get_queryset(self):
        instituicao_id = self.kwargs.get('instituicao_id')
        return Curso.objects.filter(instituicao_id=instituicao_id)

class TransferirMoedasView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            print("mensagem aqui2")
            remetente_id = request.data.get("remetente_id")
            destinatario_id = request.data.get("destinatario_id")
            valor = Decimal(request.data.get("valor"))

            if not remetente_id or not destinatario_id:
                return Response({"erro": "IDs inválidos."}, status=status.HTTP_400_BAD_REQUEST)

            remetente_professor = Professor.objects.get(perfil__user__id=remetente_id)
            destinatario_aluno = Aluno.objects.get(id=destinatario_id)

            # Verifica saldo suficiente
            if remetente_professor.saldo < valor:
                return Response({"erro": "Saldo insuficiente."}, status=status.HTTP_400_BAD_REQUEST)

            # Realiza a transferência
            remetente_professor.saldo -= valor
            destinatario_aluno.saldo += valor
            remetente_professor.save()
            destinatario_aluno.save()

            Transacao.objects.create(
                tipo="ENVIO",
                valor=valor,
                professor=remetente_professor,
                aluno=destinatario_aluno,
                mensagem=f"Transferência de {valor} moedas de {remetente_professor.perfil.user.username} para {destinatario_aluno.perfil.user.username}"
            )

            Transacao.objects.create(
                tipo="RECEBIDO",
                valor=valor,
                professor=remetente_professor,
                aluno=destinatario_aluno,
                mensagem=f"Recebeu {valor} moedas de {remetente_professor.perfil.user.username} para {destinatario_aluno.perfil.user.username}"
            )

            return Response({
                "mensagem": "Transferência realizada com sucesso!",
                "remetente": ProfessorSerializer(remetente_professor).data,
                "destinatario": AlunoSerializer(destinatario_aluno).data
            }, status=status.HTTP_200_OK)

        except Aluno.DoesNotExist:
            return Response({"erro": "Aluno não encontrado."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"erro": str(e)}, status=status.HTTP_400_BAD_REQUEST)
@method_decorator(csrf_exempt, name='dispatch')
class AlunoCreateView(generics.CreateAPIView):
    serializer_class = AlunoSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)
    
    
class UserViewSet(ModelViewSet):
    """
    Endpoint da API que permite que os usuários sejam vistos ou editados.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    # permission_classes = [IsAuthenticated]

class AlunoViewSet(ModelViewSet):
    queryset = Aluno.objects.all()
    serializer_class = AlunoSerializer
    permission_classes = [permissions.AllowAny]

    @action(detail=False, methods=['get'])
    def recentes(self, request):
        """Retorna os 3 últimos alunos cadastrados."""
        alunos_recentes = Aluno.objects.all().order_by('-id')[:3]
        serializer = self.get_serializer(alunos_recentes, many=True)
        return Response(serializer.data)

class TransacaoViewSet(ModelViewSet):
    queryset = Transacao.objects.all()
    serializer_class = TransacaoSerializer
    permission_classes = [permissions.AllowAny]

    @action(detail=False, methods=['get'])
    def recentes(self, request):
        """Retorna os 3 últimas transações cadastrados."""
        transacao_recentes = Transacao.objects.all().order_by('-id')[:3]
        serializer = self.get_serializer(transacao_recentes, many=True)
        return Response(serializer.data)

class EmpresasParceirasSet(ModelViewSet):

    queryset = EmpresaParceira.objects.all().order_by('nome_fantasia')
    serializer_class = EmpresaParceiraSerializer

    @action(detail=False, methods=["get"], url_path="por_EmpresaParceira/(?P<nome_fantasia>[^/.]+)")
    def por_EmpresaParceira(self, request, nome_fantasia=None):
        produtos = EmpresaParceira.objects.filter(nome_fantasia=nome_fantasia)
        serializer = EmpresaParceiraSerializer(produtos, many=True)
        return Response(serializer.data)

@method_decorator(csrf_exempt, name='dispatch')
class ProfessorCreateView(generics.CreateAPIView):
    serializer_class = ProfessorSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)
    
@method_decorator(csrf_exempt, name='dispatch')
class EmpresaCreateView(generics.CreateAPIView):
    serializer_class = EmpresaSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)
    
class VantagemCreateView(generics.CreateAPIView):
    serializer_class = VantagemSerializer
    permission_classes = [permissions.AllowAny]  # ou ajuste conforme sua auth
    
class VantagemViewSet(ModelViewSet):
    queryset = Vantagem.objects.all().order_by('-id')
    serializer_class = VantagemSerializer
    permission_classes = [AllowAny]

    @action(detail=True, methods=['post'], url_path='comprar')
    def comprar(self, request, pk=None):
        try:
            user_id = request.data.get("user_id")
            vantagem = self.get_object()
            # Tenta achar o aluno logado
            aluno = Aluno.objects.filter(perfil__user__id=user_id).first()
            if not aluno:
                return Response({"erro": "Aluno não encontrado."}, status=status.HTTP_404_NOT_FOUND)
            custo = Decimal(vantagem.custo_moedas)
            # Verifica se tem saldo suficiente
            if aluno.saldo < custo:
                return Response({"erro": "Saldo insuficiente."}, status=status.HTTP_400_BAD_REQUEST)

            # Desconta
            aluno.saldo -= custo
            aluno.save()
            
            vantagem_id = vantagem.id
            
            print(vantagem.id)
            
            # Cria transação
            Transacao.objects.create(
                tipo="COMPRA",
                valor=custo,
                aluno=aluno,
                vantagem_id=vantagem_id,
                mensagem=f"Compra da vantagem '{vantagem.nome}' por {custo} moedas"
            )

            #vantagem.delete()
            return Response({
                "mensagem": "Compra realizada com sucesso!",
                "novo_saldo": aluno.saldo
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"erro": str(e)}, status=status.HTTP_400_BAD_REQUEST)    