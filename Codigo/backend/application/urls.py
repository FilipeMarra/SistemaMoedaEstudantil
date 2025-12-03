from django.urls import path, include
from rest_framework.routers import DefaultRouter
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import *

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'empresasParceiras', EmpresasParceirasSet, basename='empresasParceiras')
router.register(r'alunos', AlunoViewSet, basename='aluno')
router.register(r'transacoes', TransacaoViewSet, basename='transacao')
router.register(r'vantagens', VantagemViewSet, basename='vantagem')

urlpatterns = [
    path('', include(router.urls)),
    path('instituicoes/', InstituicaoListView.as_view(), name='instituicoes-list'),
    path('cursos/<int:instituicao_id>/', CursoListView.as_view(), name='cursos-por-instituicao'),
    path('alunos/cadastrar/', csrf_exempt(AlunoCreateView.as_view()), name='aluno-cadastrar'),
    path('aln/cadastrar/', AlunoCreateView.as_view()),
    path('saldo/', SaldoView.as_view(), name='consultar-saldo'),
    path('me/', MeView.as_view(), name='me'),
    path('resetar-senha/', ResetarSenha.as_view()),
    path('usuarios/<int:user_id>/', UsuarioByIdView.as_view()),
    path('professor/cadastrar/', ProfessorCreateView.as_view()),
    path('vantagem/cadastrar/', VantagemCreateView.as_view(), name='cadastrar_vantagem'),
    path('empresa/cadastrar/', EmpresaCreateView.as_view()),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  # login
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # refresh token
    path('transferir/', TransferirMoedasView.as_view(), name='transferir-moedas'),
]

