document.addEventListener('DOMContentLoaded', () => {
    let elemBirthDate = document.querySelector('#birth-date');
    let fighterBirthDate = elemBirthDate.dataset.value;
    elemBirthDate.innerHTML = formatDate(fighterBirthDate);

    let elemAge = document.querySelector('#age');
    elemAge.innerHTML = getAge(fighterBirthDate);

    let elemHeight = document.querySelector('#height');
    let fighterHeight = elemHeight.dataset.value;
    elemHeight.innerHTML = `${inch2Feet(fighterHeight)}<br />(${inch2Cm(fighterHeight)} cm)`;

    let elemWeight = document.querySelector('#weight');
    let fighterWeight = elemWeight.dataset.value;
    elemWeight.innerHTML = `${fighterWeight} lbs<br />(${lbs2Kg(fighterWeight)} kg)`;

    let elemReach = document.querySelector('#reach');
    let fighterReach = elemReach.dataset.value;
    elemReach.innerHTML = `${fighterReach}"<br />(${inch2Cm(fighterReach)} cm)`;

    let elemFavorite = document.querySelector("#favorite-form");
    elemFavorite.onsubmit = (e) => {
        e.preventDefault();
        favoriteFighter();
    };
})

function favoriteFighter() {
    const CSRF_TOKEN = getCookie('csrftoken');

    let btnAction = document.querySelector("#action-btn");
    let action = btnAction.value;

    let fighterId = document.querySelector("#fighter-id").value;
    
    fetch(`favorite_fighter/${fighterId}`, {
        method: "PUT",
        headers: {'X-CSRFToken': CSRF_TOKEN},
        mode: 'same-origin', // Do not send CSRF token to another domain.
        body: JSON.stringify({
            action: action
        })
    })
    .then(response => {
        if (action == "Unfavorite") {
            btnAction.innerHTML = "Add to favorite";
            btnAction.value = "Favorite";
        }
        else if (action == "Favorite") {
            btnAction.innerHTML = "Unfavorite";
            btnAction.value = "Unfavorite";
        }
    })
    .catch(error => alert(error));
}

// https://docs.djangoproject.com/en/4.0/ref/csrf/
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function formatDate(unformatBirthDate) {
    return unformatBirthDate.replace(/T00:00:00/, '');
}

function getAge(BirthDate) {
    // format the age from 'yyyy-mm-ddT00:00:00' in 'mm/dd/yyyy'
    let temp = BirthDate.replace(/T00:00:00/, '');
    temp = temp.replace(/-/g, ' ');
    let formatedBirthDate = temp.replace(/(\d+)\s(\d+)\s(\d+)/, "$2/$3/$1");

    // calculate the age
    // Credit to TNi and Flimm on StackOverflow
    // https://stackoverflow.com/questions/3224834/get-difference-between-2-dates-in-javascript
    let fighterBirthDate = new Date(formatedBirthDate);
    let currentDate = new Date();
    let diffTime = Math.abs(currentDate - fighterBirthDate);
    let Age = Math.floor(diffTime / (365 * 1000 * 60 * 60 * 24)); 
    
    return Age;
}

function inch2Cm(inch) {
    return (inch * 2.54).toFixed(2);
}

function lbs2Kg(lbs) {
    return (lbs * 0.45359237).toFixed(1);;
}

function inch2Feet(inch) {
    let feet = Math.floor(inch/12);
    let mod_inch = inch % 12;
    return `${feet}'${mod_inch}"`;
}