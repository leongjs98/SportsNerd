# Distinctiveness and Complexity

* SportsNerd is distinct from other projects in this course because Sportsnerd is not a social media like `Network`; is not a auction site like `Commerce`; is not a emails site like `Email`; is not a encyclopedia site like `Wiki`; is not a front-end for Google Searches like `Search`. It is also not like the previous Capstone Project, a Pizza ordering site named `Pizza`. SportsNerd allow users to search for details of past, current and upcoming MMA events and different fighters from different organization. It also allow user to add manage different fighters in their favorite list and compare the stats of different fighters. The events and fighters data are acquired from [sportsdata.io API](#https://sportsdata.io/mma-ufc-api).

* SportsNerd uses 4 Django models. They are used to save user's account data, user's favorite fighters, fighter names and their corresponding IDs, also the leagues (MMA organization) names and IDs. The IDs are saved for calling the API. More details of these models are in ['models.py'](#modelspy). It also uses JavaScript to let user favorite a fighter and compare stats of different fighters without reloading the page.

* SportsNerd is also mobile responsive. The contents are adjusted accordingly using Bootstrap4 to make them look nicer in different screen sizes.


## How to run SportsNerd
1. Register for a free API trial account with [sportsdata.io](#https://sportsdata.io/mma-ufc-api).
2. Save API key as "SPORTS_DATA" as an environment variable in your operating system. If you are running the code in Visual Studio Code on Windows, make sure you are running it as an administrator.
3. Make sure `Django` is installed on your os. If you need help, click [here](#https://docs.djangoproject.com/en/4.0/topics/install/).
4. Use the following command in your terminal to create a database:
```
python .\manage.py makemigrations sportsnerd
python .\manage.py migrate
```
5. Create a superuser/admin account, use `python .\manage.py runserver` and login as an admin.
6. On the upper right corner of the navigation bar, click "Update", then "Fighter Database", after that, "League Database". This is to acquire all the current fighters name and league names into the database. This page is meant to be accessed by the admin only if there is any addition of leagues or fighters with the API. See more in the section [`update_fighters.html and update_leagues.html`](#update_fightershtml-and-update_leagueshtml)

Without step 3, the following functions would not work. 
- The random 10 fighters featured in the "index" page
- The name list in the "fighters" page
- The autocomplete search suggestions in the "compare_fighter" page


# Inside the capstone directory
This directory contain the following files: [`__init__.py`](#/capstone/__init__.py), [`asgi.py`](#/capstone/asgi.py), [`settings.py`](#/capstone/settings.py), [`urls.py`](#/capstone/urls.py), [`wsgi.py`](#/capstone/wsgi.py). These files are created using `django-admin startproject sportsnerd`. The only changes made are adding the sportsnerd url inside the `url_patterns` [`urls.py`](#/capstone/urls.py) and adding sportsnerd as an installed apps inside [`settings.py`](#/capstone/settings.py) to make sure the SportsNerd App run.


# Inside the sportsnerd directory
## [__init__.py](/sportsnerd/__init__.py), [apps.py](/sportsnerd/apps.py) and [tests.py](/sportsnerd/tests.py)
These 3 files are created using the command `python manage.py startapp sportsnerd` and nothing more is added to the files.


## [models.py](/sportsnerd/models.py)
This file contains different database models used. These models and their uses are as follow:
1. `User` - Uses the `AbstractUser` provided by Django to record the different username, emails, password etc of different users (including admins).
2. `FighterNameId` - To record the different fighter `name` and their respective `fighter_id`. With this model, the user can search fighters by their `name` while the program handles API calling with `fighter_id`. The model is set up such that, there will not be repeated fighter and ID in the same column.
3. `FavoriteFighter` - To record fighters that are favorited by different users. This model use `FighterNameId` and `User` as foreign keys. The model is set up such that no user can favorite the same fighter more than once.
4. `League` - To record the `name`, `key` (shorthand) and `league_id` of different fighting organization. The leagues recorded here is that used in the dropdown list in [`schedule.html`](#schedulehtml). Similar to `FighterNameId`, with this model, the user can search for schedules of different organizations by names while, the program handles the API calling with the `league_id`.


## [admin.py](/sportsnerd/admin.py)
This file register the different models from [`models.py`](#modelspy) and allow admin to view, edit and delete data in the database with (/admin)


## [urls.py](/sportsnerd/urls.py)
This file is created to associate the different views in the `views.py`. Majority of the views direct the user to a specific url page, 2 of the links are API for responsive page changes.

Here are the links to urls in this file:
1.  [index](#indexhtml)
2.  [login](#registerhtml-loginhtml-logouthtml)
3.  [logout](#registerhtml-loginhtml-logouthtml)
4.  [register](#registerhtml-loginhtml-logouthtml)
5.  [schedule](#schedulehtml)
6.  [event](#eventhtml)
7.  [fighter](#fighterhtml)
8.  [fighter_search](#fighter_searchhtml)
9.  [favorites](#favoriteshtml)
10. [compare_fighter](#compare_fighterhtml)
11. [compare_fighter_data](See more in [`views.py`](#viewspy))
11. [favorite_fighter](See more in [`views.py`](#viewspy))
11. [update_fighters](#update_fightershtml-and-update_leagueshtml)
11. [update_leagues](#update_fightershtml-and-update_leagueshtml)


## [views.py](/sportsnerd/views.py)
All functions in this file direct users to the desired urls except for the functions `compare_fighter_data` and `favorite_fighter`. The `compare_fighter_data` function is an API to be called for responsive page changes in ['compare_fighter.html'](#compare_fighterhtml). See more in [`compare_fighter.js`](#compare_fighterjs).

The `favorite_fighter` function is for user to add/remove a fighter to/from their favorite list in and make corresponding changes to the database without reloading the whole ['fighter.html'](#fighterhtml) page. See more in [`fighter.js`](#fighterjs).

The rest of the functions are explained further below. You can use the links in ['urls.py'](#urlspy) to direct to the respective header.


## [layout.html](/sportsnerd/templates/sportsnerd/layout.html)
This html file contains the navigation bar (used by other html files). Inside, the SportsNerd logo direct the user to the homepage. The "Schedule" directs the user to a page where they can search up events in different seasons (years). *There is only 1 league (at the time of creation) and only the 2021 and 2022 events are accessible with the free API trial.* The "Fighters" allow user to view every single fighter the API can find. The "Favorite" shows a list of fighters who are favorited by the user. The search bar allow users to search any fighters that is available with the API calls. On the right end, if the user is not logged in, they are presented with a "Log In" and "Register" page. If they are logged in, a "Log Out" is presented instead.


## [index.html](/sportsnerd/templates/sportsnerd/index.html)
In the index page or the homepage, the user is greeted with a welcoming message and a list of 10 random MMA fighters. The list changes every time the page refreshes. To select 10 random fighters, the `random.sample` function is used. Since the function can only be used on a list, all the fighters names and ID's are loaded from the database and converted into a list first. Clicking on any of the names will lead to the profile page about the fighter.


## [register.html](/sportsnerd/templates/sportsnerd/register.html), [login.html](/sportsnerd/templates/sportsnerd/login.html), [logout.html](/sportsnerd/templates/sportsnerd/logout.html)
These function and html file lets user to register, login and logout of the site.


## [schedule.html](/sportsnerd/templates/sportsnerd/schedule.html)
This directs the user to a page where they can search up events in different seasons (years). In here, the user can select different leagues. The season/year of the schedule is a dropdown list from 1993 (the year of the first official MMA fight) to the current year. *However, at the time of creation, there is only 1 league and only the 2021 and 2022 events are accessible with the free API trial.* Clicking on any of the event leads to more details of the event. See [`event.html`](#eventhtml).
 
### [format_date.py](/sportsnerd/templatetags/format_date.py)
Inside [`schedule.html`](#schedulehtml), there is a custom filter created using Django, namely `format_date`. When there are valid inputs, a list of events in that year will be displayed. The date received from API call is in the this format, `yyyy-mm-ddT00:00:00`. The date is formated in [`schedule.html`](#schedulehtml), from `yyyy-mm-ddT00:00:00` to `yyyy-mm-dd` with the filter.


##  [event.html](/sportsnerd/templates/sportsnerd/event.html)
After clicking on the event in the `schedule` page, the user is directed to the requested event. Here, details of different fights are called from the API and displayed. The event is separated into 2 parts, main card and the prelims. Clicking on any of the fighter's name will direct to the fighter's page. The winner of any fight is indicated with a green "Winner" cell.


## [fighter.html](/sportsnerd/templates/sportsnerd/fighter.html)
Here, the fighter info is displayed in details by calling the API in `views.py` and passing the data acquired into `fighter.html`. User can add the fighter to their favorite list without reloading the page and view the favorited fighters in the navigation bar. User can also compare the current fighter with other fighters by clicking the compare button.


## [fighter.js](/sportsnerd/static/sportsnerd/fighter.js)
This script is used by [`fighter.html`](#fighterhtml). By clicking on the "Add to favorite" button, the script detects the action and changes the user's favorite list in the database with `fetch`, then turn the button to "Unfavorite". The action is similar with clicking the "Unfavorite" button. The age (which is not provided in the API call) is calculated and so do the metric equivalent (kg and cm) of height, weight and reach.


## [favorites.html](/sportsnerd/templates/sportsnerd/favorites.html)
This page displayed all the favorited fighters by the current user. The list is called from the django models database. Clicking on any of the fighter direct the user to the respective fighter page.


## [compare_fighter.html](/sportsnerd/templates/sportsnerd/compare_fighter.html)
This page allow user to compare the selected fighter with others. User can search for another fighter using the search bar. There will be autocomplete suggestion for fighter using the updated database (more on [`update_fighters.html and update_leagues.html`](#update_fightershtml-and-update_leagueshtml)). The fighter searched will have their info displayed without refreshing the page. 


## [compare_fighter.js](/sportsnerd/static/sportsnerd/compare_fighter.js)
This script calculate the metric equivalent of age, height, weight and reach in [`compare_fighter.html`](#compare_fighterhtml). It uses `fetch` to get fighter data. If the `fetch` was successful, the innerHTML of the elements are changed. This makes the comparison of different fighters possible without reloading the page.


## [fighter_search.html](/sportsnerd/templates/sportsnerd/fighter_search.html)
The user can use the search bar in the navigation bar to look for any fighter's profile page. After entering a name, the user will be directed to this html file. Here, a list of names that matches with the user's input is displayed.


## [fighters.html](/sportsnerd/templates/sportsnerd/fighters.html)
A user can visit this page by clicking on the Fighters part of the navigation bar. This will list all of the fighters called from the API.

The information displayed in this page is acquired via an API call from the sportsdata.io MMA free trial.


## [update_fighters.html](/sportsnerd/templates/sportsnerd/update_fighters.html) and [update_leagues.html](/sportsnerd/templates/sportsnerd/update_leagues.html)
These two are only accessible by the admin to save fighters name and their IDs and the leagues name and their IDs into the django database. This is because calling the API and acquiring information of a fighter or an event uses their IDs and not their names. With the names and IDs saved, the user can search using leagues names or fighter names and the back-end Django handles the IDs for the API calls. For more details, please visit https://sportsdata.io/developers/api-documentation/mma

Newly added fighters and leagues will be shown on the page.


## [styles.css](/sportsnerd/static/sportsnerd/css/styles.css)
Simple styling to make the application looks nicer.


## YouTube Demo
[Here](https://youtu.be/iIZUdVlZN5I) is a listed YouTube Demo video.


### Finally
Thank you to everyone Bryan and everyone behind CS50W, everyone who made this project possible and also every member in the Discord Server that has helped me and others along the way.
