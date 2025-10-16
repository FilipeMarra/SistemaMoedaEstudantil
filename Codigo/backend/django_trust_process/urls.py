from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    # chama as urls criadas no outro arquivo
    path('api/', include('application.urls')), 
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),  # login
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),  # refresh
]