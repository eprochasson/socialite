validationProcedures = {
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
        console.log('Validating dropdown', validation, selection);
        return _.contains(validation, selection);
    }
};

Meteor.methods({
    'validate_input': function(value, docid, validations){
        // No way to find the question in the db: return.
        if(!docid){
            return true;
        }

        if(!this.isSimulation){
            // Get the question and its validations from the database, don't trust the client
            var field = Questions.findOne(docid);
            if(!field){
                throw new Meteor.Error(404, 'Question can not be found');
            }

            if(field.required && !value){
                throw new Meteor.Error(0, 'errors.field_required');
            }

            if(field.validation){
                validations = field.validation;
            }
        }

        _.each(validations, function(validation, method){
            if(typeof validationProcedures[method] == 'function'){
                if(!(validationProcedures[method])(validation, value)){
                    if(validation.error){
                        throw new Meteor.Error(0, validation.error);
                    } else {
                        throw new Meteor.Error(0, 'errors.undefined');
                    }
                }
            } else {
                throw new Meteor.Error(500, 'Invalid validation function');
            }
        });

        return true;
    }
});