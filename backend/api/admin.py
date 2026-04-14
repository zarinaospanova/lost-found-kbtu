from django.contrib import admin
from .models import Category, Location, ItemPost, Comment

admin.site.register(Category)
admin.site.register(Location)
admin.site.register(ItemPost)
admin.site.register(Comment)