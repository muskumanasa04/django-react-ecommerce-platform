from django.urls import path
from .views import *
from . import views  # <-- Import the views module

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('products/', ProductList.as_view()),
    path('categories/', CategoryList.as_view()),
    path('cart/', get_cart),
    path('cart/add/', add_to_cart),
    path('cart/update/<int:id>/', update_cart),
    path('cart/delete/<int:id>/', delete_cart),
    path('all-carts/', all_users_cart, name='all_users_cart'),
    path('payment/', process_payment),
    path('order/place/', create_order),
    path('invoice/<int:order_id>/', generate_invoice),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path("track-order/<int:order_id>/", track_order, name="track-order"),

]