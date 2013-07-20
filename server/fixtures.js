
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
//if(Meteor.users.find({}).count() <= 4){
////    Meteor.users.insert({
////        "createdAt": 1372216131137,
////        "emails": [
////            {
////                "address": "whatever",
////                "verified": false
////            }
////        ],
////        "friends": [
////            "L7SLCm9mJyetnb3oD"
////        ],
////        "invisible": false,
////        "lastseen": 1373524657763,
////        "online": 1,
////        "profile": {
////            "dob": "08-11-1982",
////            "gender": "Female",
////            "name": "Fake User 1",
////            "online": 0
////        },
////        "services": {
////        },
////        "settings": {
////            "invisible": false
////        },
////        "visible": 1
////    });
////    Meteor.users.insert({
////        "createdAt": 1372216131137,
////        "emails": [
////            {
////                "address": "whatever2",
////                "verified": false
////            }
////        ],
////        "friends": [
////            "L7SLCm9mJyetnb3oD"
////        ],
////        "invisible": false,
////        "lastseen": 1373524657763,
////        "online": 1,
////        "profile": {
////            "dob": "08-11-1992",
////            "gender": "Male",
////            "name": "Fake User 2",
////            "online": 0
////        },
////        "services": {        },
////        "settings": {
////            "invisible": false
////        },
////        "visible": 1
////    });
//    Meteor.users.insert({
//        "createdAt": 1372216131137,
//        "emails": [
//            {
//                "address": "3",
//                "verified": false
//            }
//        ],
//        "friends": [
//            "L7SLCm9mJyetnb3oD"
//        ],
//        "invisible": false,
//        "lastseen": 1373524657763,
//        "online": 1,
//        "profile": {
//            "dob": "08-11-1992",
//            "gender": "Male",
//            "name": "Fake User 3",
//            "online": 0
//        },
//        "services": {        },
//        "settings": {
//            "invisible": false
//        },
//        "visible": 1
//    });
//    Meteor.users.insert({
//        "createdAt": 1372216131137,
//        "emails": [
//            {
//                "address": "4",
//                "verified": false
//            }
//        ],
//        "friends": [
//            "L7SLCm9mJyetnb3oD"
//        ],
//        "invisible": false,
//        "lastseen": 1373524657763,
//        "online": 1,
//        "profile": {
//            "dob": "08-11-1992",
//            "gender": "Female",
//            "name": "Fake User 4",
//            "online": 0
//        },
//        "services": {        },
//        "settings": {
//            "invisible": false
//        },
//        "visible": 1
//    });
//    Meteor.users.insert({
//        "createdAt": 1372216131137,
//        "emails": [
//            {
//                "address": "5",
//                "verified": false
//            }
//        ],
//        "friends": [
//            "L7SLCm9mJyetnb3oD"
//        ],
//        "invisible": false,
//        "lastseen": 1373524657763,
//        "online": 1,
//        "profile": {
//            "dob": "08-11-1992",
//            "gender": "Female",
//            "name": "Fake User 5",
//            "online": 0
//        },
//        "services": {        },
//        "settings": {
//            "invisible": false
//        },
//        "visible": 1
//    });
//    Meteor.users.insert({
//        "createdAt": 1372216131137,
//        "emails": [
//            {
//                "address": "6",
//                "verified": false
//            }
//        ],
//        "friends": [
//            "L7SLCm9mJyetnb3oD"
//        ],
//        "invisible": false,
//        "lastseen": 1373524657763,
//        "online": 1,
//        "profile": {
//            "dob": "08-11-1992",
//            "gender": "Male",
//            "name": "Fake User 6",
//            "online": 0
//        },
//        "services": {        },
//        "settings": {
//            "invisible": false
//        },
//        "visible": 1
//    });
//    Meteor.users.insert({
//        "createdAt": 1372216131137,
//        "emails": [
//            {
//                "address": "7",
//                "verified": false
//            }
//        ],
//        "friends": [
//            "L7SLCm9mJyetnb3oD"
//        ],
//        "invisible": false,
//        "lastseen": 1373524657763,
//        "online": 1,
//        "profile": {
//            "dob": "08-11-1992",
//            "gender": "Female",
//            "name": "Fake User 7",
//            "online": 0
//        },
//        "services": {        },
//        "settings": {
//            "invisible": false
//        },
//        "visible": 1
//    });
//    Meteor.users.insert({
//        "createdAt": 1372216131137,
//        "emails": [
//            {
//                "address": "8",
//                "verified": false
//            }
//        ],
//        "friends": [
//            "L7SLCm9mJyetnb3oD"
//        ],
//        "invisible": false,
//        "lastseen": 1373524657763,
//        "online": 1,
//        "profile": {
//            "dob": "08-11-1992",
//            "gender": "Male",
//            "name": "Fake User 8",
//            "online": 0
//        },
//        "services": {        },
//        "settings": {
//            "invisible": false
//        },
//        "visible": 1
//    });
//    Meteor.users.insert({
//        "createdAt": 1372216131137,
//        "emails": [
//            {
//                "address": "9",
//                "verified": false
//            }
//        ],
//        "friends": [
//            "L7SLCm9mJyetnb3oD"
//        ],
//        "invisible": false,
//        "lastseen": 1373524657763,
//        "online": 1,
//        "profile": {
//            "dob": "08-11-1992",
//            "gender": "Female",
//            "name": "Fake User 9",
//            "online": 0
//        },
//        "services": {        },
//        "settings": {
//            "invisible": false
//        },
//        "visible": 1
//    });
//}
