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
        } else {
            console.log('simulation');
        }
        _.each(validations, function(validation, method){
            if(typeof Meteor.Forms[method] == 'function'){
                if(!(Meteor.Forms[method])(validation, value)){
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