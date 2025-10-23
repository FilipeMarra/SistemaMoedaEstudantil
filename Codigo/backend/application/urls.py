from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import *
router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'empresasParceiras', EmpresasParceirasSet, basename='empresasParceiras')
# router.register(r'alunos', AlunoViewSet, basename='aluno')

urlpatterns = [
    path('', include(router.urls)),
    path('instituicoes/', InstituicaoListView.as_view(), name='instituicoes-list'),
    path('cursos/<int:instituicao_id>/', CursoListView.as_view(), name='cursos-por-instituicao'),
<<<<<<< HEAD
     path('alunos/cadastrar/', csrf_exempt(AlunoCreateView.as_view()), name='aluno-cadastrar'),
    path('aln/cadastrar/', AlunoCreateView.as_view()),
=======
    path('alunos/cadastrar/', AlunoCreateView.as_view()),
>>>>>>> main
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  # login
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # refresh token
]
