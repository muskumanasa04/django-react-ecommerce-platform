from rest_framework import serializers
from .models import Category, Product, Cart, Order, OrderItem
from .models import Order, OrderItem


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'


class CartSerializer(serializers.ModelSerializer):

    name = serializers.CharField(source="product.name", read_only=True)
    price = serializers.DecimalField(
        source="product.price",
        max_digits=10,
        decimal_places=2,
        read_only=True
    )
    image = serializers.URLField(source="product.image", read_only=True)

    class Meta:
        model = Cart   
        fields = ["id", "product", "name", "price", "image", "quantity"]
     

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['product_name', 'quantity', 'price']

# Serializer for Order
class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ['order_ID', 'user', 'total_price', 'status', 'created_at', 'items']

