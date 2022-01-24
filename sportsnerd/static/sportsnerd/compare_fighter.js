document.addEventListener('DOMContentLoaded', () => {
    
    let elemBirthDate = document.querySelector('.fighter-1#birth-date');
    let fighterBirthDate = elemBirthDate.dataset.value;
    elemBirthDate.innerHTML = formatDate(fighterBirthDate);

    let elemAge = document.querySelector('.fighter-1#age');
    elemAge.innerHTML = getAge(fighterBirthDate);

    let elemHeight = document.querySelector('.fighter-1#height');
    let fighterHeight = elemHeight.dataset.value;
    elemHeight.innerHTML = `${inch2Feet(fighterHeight)}<br/>(${inch2Cm(fighterHeight)} cm)`;

    let elemWeight = document.querySelector('.fighter-1#weight');
    let fighterWeight = elemWeight.dataset.value;
    elemWeight.innerHTML = `${fighterWeight} lbs<br/>(${lbs2Kg(fighterWeight)} kg)`;

    let elemReach = document.querySelector('.fighter-1#reach');
    let fighterReach = elemReach.dataset.value;
    elemReach.innerHTML = `${fighterReach}"<br/>(${inch2Cm(fighterReach)} cm)`;

    let elemCompareFighterForm = document.querySelector('#compare-fighter-form');
    let elemCompareFighterInput = document.querySelector('#compare-fighter-search');
    elemCompareFighterForm.onsubmit = (e) => {
        e.preventDefault();
        fighterName = elemCompareFighterInput.value;
        getFighterData(2, fighterName);
    };

})

function getFighterData(fighter, fighterName) {
    const CSRF_TOKEN = getCookie('csrftoken');

    // Remove the spaces between the name to send it through the API
    fighterName = fighterName.replace(/\s/g,'_');
    fetch(`compare_fighter_data/${fighterName}`, {
        method: 'POST',
        headers: {'X-CSRFToken': CSRF_TOKEN},
        mode: 'same-origin' // Do not send CSRF token to another domain.
    })
    .then(response => response.json())
    .then(data => {
        if ( data["FirstName"] ) {
            
            let fighterName = `${data["FirstName"]} ${data["LastName"]}`
            let elemFighterName = document.querySelector(`.fighter-${fighter}#fighter-name`);
            elemFighterName.innerHTML = fighterName;

            let elemFighterNickname = document.querySelector(`.fighter-${fighter}#fighter-nickname`);
            elemFighterNickname.innerHTML = `${data["Nickname"]}`

            let elemWeightClass = document.querySelector(`.fighter-${fighter}#weight-class`);
            elemWeightClass.innerHTML = `${data["WeightClass"]}`;
            
            let elemBirthDate = document.querySelector(`.fighter-${fighter}#birth-date`);
            elemBirthDate.innerHTML = `${data["BirthDate"].replace(/T00:00:00/, '')}`;

            let elemAge = document.querySelector(`.fighter-${fighter}#age`);
            elemAge.innerHTML = `${getAge(data["BirthDate"])}`;

            let elemHeight = document.querySelector(`.fighter-${fighter}#height`);
            elemHeight.innerHTML = `${inch2Feet(data["Height"])}<br/>(${inch2Cm(data["Height"])} cm)`;

            let elemWeight = document.querySelector(`.fighter-${fighter}#weight`);
            elemWeight.innerHTML = `${data["Weight"]} lbs<br/>(${lbs2Kg(data["Weight"])} kg)`;

            let elemReach = document.querySelector(`.fighter-${fighter}#reach`);
            elemReach.innerHTML = `${data["Reach"]}"<br/>(${inch2Cm(data["Reach"])} cm)`;
            
            let elemWins = document.querySelector(`.fighter-${fighter}#wins`);
            elemWins.innerHTML = `${data["Wins"]}`;
            
            let elemLosses = document.querySelector(`.fighter-${fighter}#losses`);
            elemLosses.innerHTML = `${data["Losses"]}`;

            let elemDraws = document.querySelector(`.fighter-${fighter}#draws`);
            elemDraws.innerHTML = `${data["Draws"]}`;
            
            let elemNoContests = document.querySelector(`.fighter-${fighter}#no-contests`);
            elemNoContests.innerHTML = `${data["NoContests"]}`;
            
            let elemTko = document.querySelector(`.fighter-${fighter}#tko`);
            elemTko.innerHTML = `${data["TechnicalKnockouts"]}`;
            
            let elemTkoLosses = document.querySelector(`.fighter-${fighter}#tko-losses`);
            elemTkoLosses.innerHTML = `${data["TechnicalKnockoutLosses"]}`;
            
            let elemSub = document.querySelector(`.fighter-${fighter}#sub`);
            elemSub.innerHTML = `${data["Submissions"]}`;
            
            let elemSubLosses = document.querySelector(`.fighter-${fighter}#sub-losses`);
            elemSubLosses.innerHTML = `${data["SubmissionLosses"]}`;
            
            let elemTitleWins = document.querySelector(`.fighter-${fighter}#title-wins`);
            elemTitleWins.innerHTML = `${data["TitleWins"]}`;
            
            let elemTitleLosses = document.querySelector(`.fighter-${fighter}#title-losses`);
            elemTitleLosses.innerHTML = `${data["TitleLosses"]}`;

            let elemTitleDraws = document.querySelector(`.fighter-${fighter}#title-draws`);
            elemTitleDraws.innerHTML = `${data["TitleDraws"]}`;

            let elemSigStrikeAcc = document.querySelector(`.fighter-${fighter}#sig-strike-acc`);
            elemSigStrikeAcc.innerHTML = `${data["CareerStats"]["SigStrikeAccuracy"]}%`;
            
            let elemSigStrikePerMin = document.querySelector(`.fighter-${fighter}#sig-strike-per-min`);
            elemSigStrikePerMin.innerHTML = `${data["CareerStats"]["SigStrikesLandedPerMinute"]}`;

            let elemSubAvg = document.querySelector(`.fighter-${fighter}#sub-avg`);
            elemSubAvg.innerHTML = `${data["CareerStats"]["SubmissionAverage"]}`;

            let elemTdAvg = document.querySelector(`.fighter-${fighter}#td-avg`);
            elemTdAvg.innerHTML = `${data["CareerStats"]["TakedownAverage"]}`;

            let elemDecisionPercent = document.querySelector(`.fighter-${fighter}#decision-percent`);
            elemDecisionPercent.innerHTML = `${data["CareerStats"]["DecisionPercentage"]}%`;
            
            let elemKOPercent = document.querySelector(`.fighter-${fighter}#ko-percent`);
            elemKOPercent.innerHTML = `${data["CareerStats"]["KnockoutPercentage"]}%`;
            
            let elemTKOPercent = document.querySelector(`.fighter-${fighter}#tko-percent`);
            elemTKOPercent.innerHTML = `${data["CareerStats"]["TechnicalKnockoutPercentage"]}%`;
        }
        else {
            fighterName = fighterName.replace(/_/g, ' ');
            alert(`Fighter ${fighterName} does not exist.`);
        }
    })
    .catch(error => console.log(error));

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

function getAge(formatBirthDate) {
    // format the age from 'yyyy-mm-ddT00:00:00' in 'mm/dd/yyyy'
    let temp = formatBirthDate.replace(/T00:00:00/, '');
    temp = temp.replace(/-/g, ' ');
    let formatedBirthDate = temp.replace(/(\d+)\s(\d+)\s(\d+)/, "$2/$3/$1");

    // calculate the age
    // Credit to TNi and Flimm on StackOverflow
    // https://stackoverflow.com/questions/3224834/get-difference-between-2-dates-in-javascript
    let BirthDate = new Date(formatedBirthDate);
    let currentDate = new Date();
    let diffTime = Math.abs(currentDate - BirthDate);
    let age = Math.floor(diffTime / (365 * 1000 * 60 * 60 * 24)); 
    
    return age;
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