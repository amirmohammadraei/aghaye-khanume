//this function is for bouns part of project to handle error as a paragraph in webpage
function err(message) {
    var alert_text = document.querySelector('#Error');
    alert_text.innerText = message;
}
//this function is for check input to dont have number,#-_*&%()@$ and ... 
function check(name) {
    var regex = /^[a-z A-Z]+$/;
    return regex.test(name);
}

//this function is for remove btn functionality and remove name from local storage if it exist
document.getElementById('remove_button').onclick = function (e) {
    var name = document.getElementById('name').value;
    var gender_saved = document.querySelector('#gender-saved');
    if (name.length > 1) {
        var gender = localStorage.getItem(name);
        if(gender){
            localStorage.removeItem(name)
            gender_saved.innerText = 'Nothing in storage'

        } else{
            err("This name didn't save in the local storage!")
        }
    } else{
        err("you have not enter any name!")
    }
    e.preventDefault();
};

//this function is for submit button functionality and request and get response from api (js object was made)
document.getElementById('submit').onclick = function (e) {
    var form = document.getElementById('main-form');
    var gender_status = document.querySelector('#gender-status');
    
    var gender_percentage = document.querySelector('#gender-percentage');
    var gender_saved = document.querySelector('#gender-saved');

    var data = new FormData(form);
    var items = {};
    for (const entry of data) {
        items[entry[0]] = entry[1];
    }
    gender_saved.innerText = localStorage.getItem(items['name']);
    if (check(items['name'])) {
        var xmlHttp;
        xmlHttp = new XMLHttpRequest();


        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                var respData = JSON.parse(xmlHttp.responseText) || {};

                gender_status.innerText = respData['gender'];
                gender_percentage.innerText = respData['probability'];
            }
        };

        xmlHttp.open(
            'GET',
            'https://api.genderize.io/?name=' +
                items['name'].split(' ').join('%20'),
            true
        );

        xmlHttp.send(null);
    } else {
        err(items['name'] + ' the api doesn\'t have this name!!!');
    }

    e.preventDefault();
};
//this function is for save button functionality and save result in local storage
document.getElementById('save').onclick = function (e) {
    var form = document.getElementById('main-form');

    var gender_status = document.querySelector('#gender-status');
    var gender_saved = document.querySelector('#gender-saved');
    var data = new FormData(form);
    var items = {};
    for (const entry of data) {
        items[entry[0]] = entry[1];
    }
    if (check(items['name'])) {
        if (items['gender']) {
            localStorage.setItem(items['name'], items['gender']);
            gender_saved.innerText = items['gender'];
        } else {
            var gender_requested = gender_status.innerText;
            gender_saved.innerText = gender_requested;
            localStorage.setItem(items['name'] , gender_requested)
            if (gender_requested.length == 0) {
                err(
                    'You did not choose a gender and you did not search any name either!!!'
                );
            }
        }
    } else {
        err(items['name'] + ' is not a valid name (Name should only include alphabet and space)!!!');
    }

    e.preventDefault();
};