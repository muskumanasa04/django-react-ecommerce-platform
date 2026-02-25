from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from django.utils import timezone
from django.contrib.auth.models import User

from .models import Product, Category, Cart, Order, OrderItem
from .serializers import (
    ProductSerializer,
    CategorySerializer,
    CartSerializer,
    OrderSerializer,

)

# ================= PRODUCTS =================

class ProductList(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class CategoryList(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


# ================= HELPER FUNCTION =================

def get_default_user():
    """
    Since we removed authentication,
    we assign all cart/order data to the first user.
    """
    return User.objects.first()


# ================= CART =================

@api_view(['GET'])
def get_cart(request):
    user = get_default_user()
    cart = Cart.objects.filter(user=user)
    serializer = CartSerializer(cart, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def add_to_cart(request):
    product_id = request.data.get('product_id')

    if not product_id:
        return Response({"error": "Product ID required"}, status=400)

    product = get_object_or_404(Product, id=product_id)
    user = get_default_user()

    cart_item, created = Cart.objects.get_or_create(
        user=user,
        product=product
    )

    if not created:
        cart_item.quantity += 1
        cart_item.save()

    return Response({"message": "Added to cart ✅"})


@api_view(['PUT'])
def update_cart(request, id):
    user = get_default_user()
    cart_item = get_object_or_404(Cart, id=id, user=user)

    quantity = request.data.get('quantity')

    if quantity is None:
        return Response({"error": "Quantity required"}, status=400)

    if quantity <= 0:
        cart_item.delete()
        return Response({"message": "Item removed"})

    cart_item.quantity = quantity
    cart_item.save()

    return Response({"message": "Quantity updated ✅"})


@api_view(['DELETE'])
def delete_cart(request, id):
    user = get_default_user()
    cart_item = get_object_or_404(Cart, id=id, user=user)
    cart_item.delete()
    return Response({"message": "Deleted from cart 🗑️"})


# ================= PAYMENT =================

@api_view(['POST'])
def process_payment(request):
    return Response({
        "message": "Payment Successful ✅"
    }, status=status.HTTP_200_OK)


# ================= CREATE ORDER =================

@api_view(["POST"])
def create_order(request):
    user = get_default_user()
    cart_items = Cart.objects.filter(user=user)

    if not cart_items.exists():
        return Response(
            {"error": "Cart is empty"},
            status=status.HTTP_400_BAD_REQUEST
        )

    total_price = sum(
        item.product.price * item.quantity
        for item in cart_items
    )

    order = Order.objects.create(
        user=user,
        total_price=total_price,
        status="Paid",
        created_at=timezone.now()
    )

    order_items_data = []

    for item in cart_items:
        order_item = OrderItem.objects.create(
            order=order,
            product_name=item.product.name,
            quantity=item.quantity,
            price=item.product.price
        )

        order_items_data.append({
            "id": order_item.id,
            "product_name": item.product.name,
            "quantity": item.quantity,
            "price": item.product.price,
            "subtotal": item.product.price * item.quantity
        })

    # Clear cart after order
    cart_items.delete()

    return Response({
        "id": order.id,
        "total_price": order.total_price,
        "created_at": order.created_at,
        "status": order.status,
        "items": order_items_data
    }, status=status.HTTP_201_CREATED)


# ================= INVOICE =================

@api_view(['GET'])
def generate_invoice(request, order_id):
    user = get_default_user()
    order = get_object_or_404(Order, id=order_id, user=user)
    items = OrderItem.objects.filter(order=order)

    invoice_data = {
        "id": order.id,
        "date": order.created_at,
        "status": order.status,
        "total_price": order.total_price,
        "items": [
            {
                "product_name": item.product_name,
                "quantity": item.quantity,
                "price": item.price,
                "subtotal": item.price * item.quantity
            }
            for item in items
        ]
    }

    return Response(invoice_data, status=status.HTTP_200_OK)


from .models import Cart

@api_view(['GET'])
@permission_classes([IsAdminUser])  # 🔐 Only admin can access
def all_users_cart(request):
    carts = Cart.objects.select_related('user', 'product').all()

    data = []
    for item in carts:
        data.append({
            "id": item.id,
            "user": item.user.username,
            "product": item.product.name,
            "quantity": item.quantity,
            "price": item.product.price,
            "image": item.product.image.url if item.product.image else None,
            "subtotal": item.product.price * item.quantity
        })

    return Response(data)


@api_view(['GET'])
def track_order(request, order_id):
    try:
        order = Order.objects.get(id=order_id)
    except Order.DoesNotExist:
        return Response({"error": "Order not found"}, status=404)

    items = []
    latitudes = []
    longitudes = []

    for item in OrderItem.objects.filter(order=order):
        items.append({
            "product_name": item.product_name,
            "quantity": item.quantity,
            "price": float(item.price),
            "latitude": item.latitude,
            "longitude": item.longitude
        })
        if item.latitude:
            latitudes.append(item.latitude)
        if item.longitude:
            longitudes.append(item.longitude)

    # Use average coordinates if available, else fallback
    latitude = sum(latitudes)/len(latitudes) if latitudes else 28.6139
    longitude = sum(longitudes)/len(longitudes) if longitudes else 77.2090

    data = {
        "id": order.id,
        "status": order.status,
        "total_price": float(order.total_price),
        "created_at": order.created_at,
        "items": items,
        "latitude": latitude,
        "longitude": longitude
    }

    return Response(data)


