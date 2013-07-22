if(Questions.find().count() == 0){
    Questions.insert({
        name: 'name',
        label: 'question.name',
        type: 'text',
        sortorder: 1,
        group: 'basic',
        domid: 'name',
        placeholder: 'question.name_placeholder',
        help: 'question.name_help',
        validation: { length: {min:3, error: 'errors.name_between_3_and_30'}},
        required: true
    });
    Questions.insert({
        name: 'dob',
        label: 'question.dob',
        tpl: 'form_field_datepicker',
        validation: {'date': {format: 'DD-MM-YYYY', agemin: '18', agemax: '130', error: 'errors.date_of_birth'}},
        help: 'question.dob_help',
        value: '08-11-1982',
        group: 'basic',
        sortorder: 2,
        domid: 'dob',
        required: true
    });
    Questions.insert({
        name: 'gender',
        domid: 'gender',
        label: 'question.gender',
        tpl: 'form_field_dropdown',
        validation: {'dropdown': {values: ['M','F'], error: 'errors.field_required'}},
        help: 'question.gender_help',
        value: 'null',
        options: {'null': '', M : 'question.male', F: 'question.female'},
        sortorder: 3,
        required: true
    });
    Questions.insert({
        "domid": "geocoding",
        "label": "question.geocoding",
        "help": "question.geocoding_help",
        "name": "geocoding",
        "required": false,
        "sortorder": 3,
        "tpl": "form_geocoding",
        "validation": {length: {min:3, error: 'errors.invalid_location'}},
        "value": ""
    });
    Questions.insert({
        "domid": "location",
        "help": "question.location_help",
        "label": "question.location",
        "name": "location",
        "required": true,
        "sortorder": 3,
        "tpl": "form_location",
        "validation": {coordinates: true},
        "value": ""
    });
    Questions.insert({
        "domid": "profile_picture",
        "help": "question.profile_picture_help",
        "label": "question.profile_picture",
        "name": "picture",
        "required": false,
        "sortorder": 3,
        "tpl": "form_profile_picture",
        "validation": {},
        "value": ""
    });
}


if(Meteor.users.find({}).count() <= 2){
    var gender = "F";
    for(var i = 1 ; i < 30 ; i++){
        gender = (i % 2) ? "F" : "M";
        var dob = 1977 + Math.floor(Math.random()*10);
        dobtime = moment('08-11-'+dob, 'DD-MM-YYYY').unix();
        Meteor.users.insert({
            "createdAt": 1372216131137,
            "emails": [
                {
                    "address": "user"+i+"@test.com",
                    "verified": false
                }
            ],
            "lastseen": 1473524657763,
            "online": 1,
            "profile": {
                "dob": "08-11-"+dob,
                "gender": gender,
                "name": "Fake User"+i,
                "dobtime": dobtime
            },
            "services": {
            },
            "settings": {
                "invisible": false
            },
            "visible": 1,
            "profile_complete": 1,
            "loc": [22.2861678+(Math.random()*2),114.1425153+(Math.random()*2)]
        });
    }
}
