from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login, logout
from django.contrib.admin.views.decorators import staff_member_required
from django.http import JsonResponse
from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.urls import reverse


import requests
import json
import os
import random
import datetime


from .models import User, FavoriteFighter, FighterNameId, League


API_KEY = os.environ['SPORTS_DATA']
HEADERS = {'Ocp-Apim-Subscription-Key': '{key}'.format(key=API_KEY)}


# Create your views here.
def index(request):
    random_fighters = []
    fighters = list(FighterNameId.objects.all())

    if fighters:
        random_fighters = random.sample(fighters, 10)
    
    return render(request, "sportsnerd/index.html", {
        "random_fighters": random_fighters
    })


def fighter(request, fighter_id):
    
    user = request.user
    fighter = FighterNameId.objects.get(fighter_id=fighter_id)

    user_favorite_fighter = False
    if user.is_authenticated:
        try:
            FavoriteFighter.objects.get(user=user, fighter=fighter)
            user_favorite_fighter = True
        except FavoriteFighter.DoesNotExist:
            user_favorite_fighter = False

    response = requests.get(url=f"https://api.sportsdata.io/v3/mma/scores/json/Fighter/{fighter_id}", headers=HEADERS)
    data = json.loads(response.text)

    return render(request, "sportsnerd/fighter.html", {
        "fighter_id": fighter_id,
        "fighter": data,
        "user_favorite_fighter": user_favorite_fighter
    })


@login_required
def compare_fighter_data(request, fighter_name):
    # POST is required so not everyone can access this API
    if request.method != "POST":
        return JsonResponse({"error": "POST method required"}, status=400)
    else:
        # Change the underscores into space before searching through the database
        fighter_name = fighter_name.replace("_", " ")
        try:
            fighter_searched = FighterNameId.objects.get(name__iexact=fighter_name)
            response = requests.get(url=f"https://api.sportsdata.io/v3/mma/scores/json/Fighter/{fighter_searched.fighter_id}", headers=HEADERS)
            data = json.loads(response.text)
            return JsonResponse(data)
        except FighterNameId.DoesNotExist:
            return JsonResponse({"error": "Invalid fighter."})


def schedule(request):
    data = []
    message = ""
    year_list = []
    current_date_time = datetime.datetime.now()
    date = current_date_time.date()
    current_year = int(date.strftime("%Y"))

    league_list = League.objects.all()
    # The list starts at 1993 when the first official MMA competition took place
    for i in range(1993, current_year + 1):
        year_list.append(i)

    if request.method == "GET":
        return render(request, "sportsnerd/schedule.html", {
            "events": data,
            "message": message,
            "year_list": year_list,
            "league_list": league_list
        })

    elif request.method == "POST":
        league = request.POST.get("league")
        season = request.POST.get("season") 

        response = requests.get(url=f"https://api.sportsdata.io/v3/mma/scores/json/Schedule/{league}/{season}", headers=HEADERS)
        data = json.loads(response.text)
        
        # If the season/year is not successful, the API returns a dictionary instead of a list
        if isinstance(data, dict):
            message = data['Description']
            data = []

        return render(request, "sportsnerd/schedule.html", {
            "events": data,
            "message": message,
            "year_list": year_list,
            "league_list": league_list
        })


def event(request, event_id):

    response = requests.get(url=f"https://api.sportsdata.io/v3/mma/scores/json/Event/{event_id}", headers=HEADERS)
    data = json.loads(response.text)
    
    # Categorise fights into different segments
    main_card = []
    prelims = []

    for fight in data["Fights"]:
        if fight["CardSegment"] == "Main Card":
            main_card.append(fight)
        elif fight["CardSegment"] == "Prelims":
            prelims.append(fight)

    return render(request, "sportsnerd/event.html", {
        "main_card": main_card,
        "prelims": prelims,
    })


def fighters(request):
    response = requests.get(url=f"https://api.sportsdata.io/v3/mma/scores/json/Fighters", headers=HEADERS)
    data = json.loads(response.text)

    return render(request, "sportsnerd/fighters.html", {
        "fighters": data
    })


# A page just to let the admins add new fighters name and ID into the database
@staff_member_required
def update_fighters(request):
    response = requests.get(url="https://api.sportsdata.io/v3/mma/scores/json/Fighters", headers=HEADERS)
    fighters = json.loads(response.text)

    fighters_added = []
    for fighter in fighters:
        fighter_name = f'{fighter["FirstName"]} {fighter["LastName"]}'
        fighter_id = fighter['FighterId']

        # Only add to the database if the row doesn't exist
        try:
            FighterNameId.objects.get(name=fighter_name, fighter_id=fighter_id)
        except FighterNameId.DoesNotExist:
            FighterNameId.objects.create(name=fighter_name, fighter_id=fighter_id)
            fighters_added.append(fighter)

    return render(request, 'sportsnerd/update_fighter.html', {
        "fighters_added": fighters_added
    })


@staff_member_required
def update_leagues(request):
    response = requests.get(url=" https://api.sportsdata.io/v3/mma/scores/json/Leagues", headers=HEADERS)
    leagues = json.loads(response.text)

    leagues_added = []
    for league in leagues:
        league_name = league['Name']
        league_key = league['Key']
        league_id = league['LeagueId']

        # Only add to the database if the row doesn't exist
        try:
            League.objects.get(name=league_name, key=league_key, league_id=league_id)
        except League.DoesNotExist:
            League.objects.create(name=league_name, key=league_key, league_id=league_id)
            leagues_added.append(f"{league_name} ({league_key})")
    
    print(leagues_added)

    return render(request, 'sportsnerd/update_leagues.html', {
        "leagues_added": leagues_added
    })


def fighter_search(request):
    message = "Here's what we found:"
    fighters_searched = []

    # Not as easily accessible as GET
    if request.method == "POST":
        name_searched = request.POST.get("name-searched")

        fighters_searched = FighterNameId.objects.filter(name__contains=name_searched)
        if not fighters_searched:
            message = "We couldn't find the fighter :("
    else:
        message = "Please use the search bar above."

    return render(request, 'sportsnerd/fighter_search.html', {
        "name_searched": name_searched,
        "message": message,
        "fighters_searched": fighters_searched
    })


@login_required
def favorites(request):
    message = ""
    favorites = []

    favorites = FavoriteFighter.objects.filter(user=request.user)

    if favorites:
        message = "Your favorite fighters:"
    else:
        message = "Go find a favorite fighter!"
    
    return render(request, 'sportsnerd/favorites.html', {
        "message": message,
        "favorites": favorites
    })


def compare_fighter(request, fighter_id):
    response = requests.get(url=f"https://api.sportsdata.io/v3/mma/scores/json/Fighter/{fighter_id}", headers=HEADERS)
    data = json.loads(response.text)
    
    fighters = FighterNameId.objects.all()

    return render(request, 'sportsnerd/compare_fighter.html', {
        "fighter": data,
        "fighters": fighters
    })


def favorite_fighter(request, fighter_id):
    if request.method == "PUT":
        user = request.user
        data = json.loads(request.body)
        action = data.get("action")

        # Attempt favorite or unfavorite action
        try:
            fighter = FighterNameId.objects.get(fighter_id=fighter_id)
            
            if action == "Favorite":
                # Create a favorite link
                FavoriteFighter.objects.create(user=user, fighter=fighter)
            elif action == "Unfavorite":
                # Delete the favorite link
                FavoriteFighter.objects.get(user=user, fighter=fighter).delete()
            else:
                return JsonResponse({"error": "Invalid action"})

            return HttpResponse(status=204)

        except FighterNameId.DoesNotExist:
            return JsonResponse({"error": "Fighter does not exist"})
            
    else:
        return JsonResponse({"error": "PUT method required"})

    
def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("sportsnerd:index"))
        else:
            return render(request, "sportsnerd/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "sportsnerd/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("sportsnerd:index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "sportsnerd/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "sportsnerd/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("sportsnerd:index"))
    else:
        return render(request, "sportsnerd/register.html")