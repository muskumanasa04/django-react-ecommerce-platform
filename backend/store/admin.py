from django.contrib import admin
from .models import Category, Product, Cart, Order, OrderItem

admin.site.register(Category)
admin.site.register(Product)
admin.site.register(Order)
admin.site.register(OrderItem)

# Custom admin for Cart
class CartAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'product', 'quantity')
    search_fields = ('user__username', 'user__email', 'product__name')
    list_filter = ('user', 'product')  # optional, for filtering

admin.site.register(Cart, CartAdmin)