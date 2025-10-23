from rest_framework.viewsets import *
from rest_framework import generics, permissions
from .models import *
from .serializers import *
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.decorators import action
from rest_framework.response import Response
# from rest_framework.permissions import IsAuthenticated


class InstituicaoListView(generics.ListAPIView):
    queryset = InstituicaoEnsino.objects.all()
    serializer_class = InstituicaoSerializer


class CursoListView(generics.ListAPIView):
    serializer_class = CursoSerializer

    def get_queryset(self):
        instituicao_id = self.kwargs.get('instituicao_id')
        return Curso.objects.filter(instituicao_id=instituicao_id)



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

class EmpresasParceirasSet(ModelViewSet):

    queryset = EmpresaParceira.objects.all().order_by('nome_fantasia')
    serializer_class = EmpresaParceiraSerializer

    @action(detail=False, methods=["get"], url_path="por_EmpresaParceira/(?P<nome_fantasia>[^/.]+)")
    def por_EmpresaParceira(self, request, nome_fantasia=None):
        produtos = EmpresaParceira.objects.filter(nome_fantasia=nome_fantasia)
        serializer = EmpresaParceiraSerializer(produtos, many=True)
        return Response(serializer.data)