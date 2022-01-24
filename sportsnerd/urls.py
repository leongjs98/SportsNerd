from django.urls import path
from . import views


app_name = 'sportsnerd'


urlpatterns = [
    path('', views.index, name='index'),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path('schedule', views.schedule, name='schedule'),
    path('event/<int:event_id>', views.event, name='event'),
    path('fighter/<int:fighter_id>', views.fighter, name='fighter'),
    path('fighters', views.fighters, name='fighters'),
    path('fighter_search', views.fighter_search, name="fighter_search"),
    path('favorites', views.favorites, name="favorites"),
    path('compare_fighter/<int:fighter_id>', views.compare_fighter, name="compare_fighter"),
    
    # API
    path('compare_fighter/compare_fighter_data/<str:fighter_name>', views.compare_fighter_data, name="compare_fighter_data"),
    path('fighter/favorite_fighter/<int:fighter_id>', views.favorite_fighter, name="favorite_fighter"),

    # Admin only
    path('update_fighters', views.update_fighters, name='update_fighters'),
    path('update_leagues', views.update_leagues, name="update_leagues")
]
