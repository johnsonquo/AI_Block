from django.urls import path, include
from django.contrib import admin
from rest_framework.routers import DefaultRouter
from one_stock_block import views
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.contrib import staticfiles
from django.views.decorators.csrf import csrf_exempt

router = DefaultRouter()
router.register('block', views.BlockViewSet)
router.register('stock', views.StockViewSet)
router.register('user', views.UserViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/evaluate/', views.StockViewSet.as_view({"post": "evaluate", "get":"Get_Evaluate"})),
    path('api/stockList/', views.StockViewSet.as_view({"get": "Get_stockList"})),
    path('api/checkUser/', views.UserViewSet.as_view({"post": "checkUser"})),
    path('lego/', views.CreateAiLegoPage),
    path('lego/detail/', views.CreateSelectPage),
    path('machineResult/', views.CreateResultPage),
    path('', views.CreateIndexPage)
]

#urlpatterns += staticfiles_urlpatterns()
