from django.urls import path
from .views import (
    register_view,
    login_view,
    logout_view,
    categories_list,
    locations_list,
    ItemPostListCreateAPIView,
    ItemPostDetailAPIView,
    MyPostsAPIView,
    CommentListCreateAPIView,
)

urlpatterns = [
    path('auth/register/', register_view),
    path('auth/login/', login_view),
    path('auth/logout/', logout_view),

    path('categories/', categories_list),
    path('locations/', locations_list),

    path('posts/', ItemPostListCreateAPIView.as_view()),
    path('posts/my/', MyPostsAPIView.as_view()),
    path('posts/<int:pk>/', ItemPostDetailAPIView.as_view()),
    path('posts/<int:post_id>/comments/', CommentListCreateAPIView.as_view()),
]