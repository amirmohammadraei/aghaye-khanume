// name must contains english chars and space with maximum length of 255 chars
function name_validation(name) {
    var sample_regex = /^[A-Za-z ]{1,255}$/;
    return sample_regex.test(name);
}

// sumbit button to manage input form and predict it's a male or female name
document.getElementById('submit-btn').onclick = function (e) {
    e.preventDefault();

    var input_form = document.getElementById('input-data');
    var gender_status = document.querySelector('#predicted-gender');
    var gender_percentage = document.querySelector('#predicted-percentage');
    var saved_gender = document.querySelector('#saved-gender');
    var read_data = new FormData(input_form);
    var input_data = {};

    for (const [key, value] of read_data) {
        input_data[key] = value;
    }


    saved_gender.innerText = 'load from storage: ' + localStorage.getItem(input_data['name']);


    if (name_validation(input_data['name'])) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                var respData = JSON.parse(xmlHttp.responseText) || {};
                if (respData['gender'] == null){
                    gender_status.innerText = '----';
                    gender_percentage.innerText = '----';
                    show_error_message('api is not able to predict gender');
                } else {
                    gender_status.innerText = respData['gender'];
                    gender_percentage.innerText = respData['probability'];
                }
            } 
        };

        xmlHttp.open('GET', 'https://api.genderize.io/?name=' + input_data['name'], true);
        xmlHttp.send();
    } 
    else {
        if (input_data['name'].length == 0) {
            show_error_message('Enter name!');
        }
        else {
            show_error_message('please enter valid name!');
        }   
    }
};

// this function will save predicted answer for input name
document.getElementById('save-btn').onclick = function (e) {
    e.preventDefault();
    
    var input_form = document.getElementById('input-data');
    var predicted_gender = document.querySelector('#predicted-gender');
    var read_data = new FormData(input_form);
    var input_data = {};

    for (const [key, value] of read_data) {
        input_data[key] = value;
    }

    if (name_validation(input_data['name'])) {
        var saved_gender = document.querySelector('#saved-gender'); 
        if (input_data['gender']) {
            localStorage.setItem(input_data['name'], input_data['gender']);
            saved_gender.innerText = 'new gender: ' + input_data['gender'];
        } 
        else {
            var to_save_gender = predicted_gender.innerText;
            saved_gender.innerText = to_save_gender;
            if (to_save_gender == '----') {

                saved_gender.innerText = 'data was in storage:' + localStorage.getItem(input_data['name']);
                show_error_message('Enter gender or use prediction');

            } else {
                localStorage.setItem(input_data['name'], predicted_gender.innerText);
            }
        }
    } 
    else {
        if (input_data['name'].length == 0) {
            show_error_message('Enter name!');
        }
        else {
            show_error_message('please enter valid name!');
        }   
    }
};

// here we manage how to remove predicted gender for specific name from local storage
document.getElementById('remove-btn').onclick = function (e) {
    e.preventDefault();
    var user_input_name = document.getElementById('name').value;
    var gender = localStorage.getItem(user_input_name);
    if(gender){
        localStorage.removeItem(user_input_name)
        var saved_gender = document.querySelector('#saved-gender');
        saved_gender.innerText = 'saved answer deleted!'
    } 
    else{
        show_error_message("There is nothing to remove")
    }
};

// this function is to handle errors in project
function show_error_message(message) {
    var error = document.querySelector('#show-error-message');
    error.innerText = message;
}