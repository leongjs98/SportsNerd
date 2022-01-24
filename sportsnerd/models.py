from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.
class User(AbstractUser):
    pass



# For users to search fighters using names instead of fighter_id
class FighterNameId(models.Model):
    name = models.CharField((""), max_length=50)
    fighter_id = models.IntegerField()

    # Make sure no repeated fighter
    class Meta:
        unique_together= (('name', 'fighter_id'),)

    def __str__(self):
        return f'{self.fighter_id}: {self.name}'
    


class FavoriteFighter(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE)
    fighter = models.ForeignKey("FighterNameId", on_delete=models.CASCADE, related_name="fav")

    # Make sure no repeated favorites
    class Meta:
        unique_together= (('user', 'fighter'),)

    def __str__(self):
        return f'{self.user.username}: {self.fighter.name}'



class League(models.Model):
    name = models.CharField((""), max_length=50)
    key = models.CharField((""), max_length=10)
    league_id = models.IntegerField()

    def __str__(self):
        return f'{self.name} ({self.key})'
    