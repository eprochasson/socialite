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
        name: 'qcm',
        domid: 'qcm',
        label: 'Multiple choice',
        tpl: 'form_field_dropdown',
        validation: {'dropdown': ['a','b']},
        help: 'dropdown_help',
        value: 'a',
        options: {a : 'A', b: 'B'}
    });
    Questions.insert({
        name: 'gender',
        domid: 'gender',
        label: 'question.gender',
        tpl: 'form_field_dropdown',
        validation: {'dropdown': ['M','F']},
        help: 'dropdown_help',
        value: 'null',
        options: {'null': '', M : 'Male', F: 'Female'},
        sortorder: 3,
        required: true
    });
}
if(Meteor.users.find({}).count() <= 2){
    Meteor.users.insert({
        "createdAt": 1372216131137,
        "emails": [
            {
                "address": "whatever",
                "verified": false
            }
        ],
        "friends": [
            "L7SLCm9mJyetnb3oD"
        ],
        "invisible": false,
        "lastseen": 1373524657763,
        "online": 1,
        "profile": {
            "dob": "08-11-1982",
            "gender": "Female",
            "name": "Fake User 1",
            "online": 0
        },
        "services": {
        },
        "settings": {
            "invisible": false
        },
        "visible": 1
    });
    Meteor.users.insert({
        "createdAt": 1372216131137,
        "emails": [
            {
                "address": "whatever2",
                "verified": false
            }
        ],
        "friends": [
            "L7SLCm9mJyetnb3oD"
        ],
        "invisible": false,
        "lastseen": 1373524657763,
        "online": 1,
        "profile": {
            "dob": "08-11-1992",
            "gender": "Male",
            "name": "Fake User 2",
            "online": 0
        },
        "services": {        },
        "settings": {
            "invisible": false
        },
        "visible": 1
    });
}
