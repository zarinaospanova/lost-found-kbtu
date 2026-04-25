from django.contrib import admin
from .models import Category, ItemPost, Comment
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['id', 'name']
    search_fields = ['name']

@admin.register(ItemPost)
class PostAdmin(admin.ModelAdmin):
    list_display = ['id', 'title', 'status', 'user', 'category', 'created_at']
    list_filter = ['status', 'category']
    search_fields = ['title', 'description']
    readonly_fields = ['created_at', 'updated_at']

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ['id', 'post', 'user', 'created_at']
    search_fields = ['text']