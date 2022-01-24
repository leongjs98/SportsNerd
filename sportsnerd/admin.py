from django.contrib import admin
from .models import User, FavoriteFighter, FighterNameId, League

# Register your models here.
admin.site.register(User)
admin.site.register(FavoriteFighter)
admin.site.register(FighterNameId)
admin.site.register(League)