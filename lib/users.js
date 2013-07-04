

Meteor.methods({
    'update_profile': function(values){
        var valid = true;
        var cleaned = {}; // store name -> value
        var maintained = {}; // store question id -> value
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
                                maintained[docid] = val;
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
                return Meteor.users.update(Meteor.userId(), {
                    $set: {
                        profile : cleaned,
                        maintenance: maintained
                    }
                });
            }
        })
    }
});

