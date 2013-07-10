

Meteor.methods({
    'update_profile': function(values){
        var valid = true;
        var cleaned = {}; // store name -> value
        _.each(values, function(val, docid){
            if(docid){
                // Validate the response
                var question = Questions.findOne(docid);
                if(!question){
                    valid = false;
                } else {
                    var validations = question.validation;
                    _.each(validations, function(validation, method){
                        if(typeof validationProcedures[method] == 'function'){
                            if(!(validationProcedures[method])(validation, val)){
                                valid = false;
                            } else {
                                // All good, let's input
                                cleaned[question.name] = val;
                            }
                        } else {
                            valid = false;
                        }
                    });
                }
            } else {
                valid = false;
            }
            if(!valid){
                throw new Meteor.Error(300, 'errors.not_saved');
            } else {

                // Account only visible if at least those two information are made available.
                var visible = 0;
                if(cleaned.name && cleaned.gender){
                    visible = 1;
                }

                return Meteor.users.update(Meteor.userId(), {
                    $set: {
                        profile : cleaned,
                        visible: visible
                    }
                });
            }
        })
    },
    denormalizeProfilePicture: function(pixHandler){
        if(pixHandler){
            Meteor.users.update(Meteor.userId(), {$set: {'profile.picture': pixHandler}});
            return true;
        } else {
            throw new Meteor.Error(500, 'Internal Error');
        }

    }
});

