Meteor.FormsValidation = {
    'date': function(validation, date){
        var valid = true;
        var format = validation.format || 'DD-MM-YYYY';

        var thisdate = moment(date, format);
        if(!thisdate.isValid()){
            valid = false;
        }
        if(validation.agemin){
            if(moment().subtract('years',validation.agemin).isBefore(thisdate)){
                valid = false;
            }
        }
        if(validation.agemax){
            if(moment().subtract('years',validation.agemax).isAfter(thisdate)){
                valid = false;
            }
        }
        return valid;
    },
    'length': function(validation, str){
        var valid = true;
        if(validation.min){
            valid = valid && str.length >= validation.min;
        }
        if(validation.max){
            valid = valid && str.length <= validation.max;
        }
        return valid;
    },
    'dropdown': function(validation, selection){
        return _.contains(validation.values, selection);
    },
    coordinates: function(validation, str){
        if(validation){
            var values = str.split(',');
            if((values[0] == undefined) || (values[1] == undefined)){
                return false;
            }
            var lat = values[0]+0;
            var lng = values[0]+0;
            return lat < 90 && lat > -90 && lng < 180 && lng > -180;
        } else {
            return true;
        }
    }
};
