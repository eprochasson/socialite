

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
                        if(typeof Meteor.FormsValidation[method] == 'function'){
                            if(!(Meteor.FormsValidation[method])(validation, val)){
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
        });
        if(!valid){
            throw new Meteor.Error(300, 'errors.not_saved');
        } else {
            // Account only visible if at least those two information are made available.
            var visible = 0;
            if(cleaned.name && cleaned.gender){
                visible = 1;
            }

            console.log('Updating profile', cleaned);
            Meteor.users.update(Meteor.userId(), {
                $set: {
                    profile : cleaned,
                    visible: visible
                }
            });

            Activities.insertActivity({
                type: 'update_profile',
                from: Meteor.userId(),
                to: null
            })
        }
    },
    denormalizeProfilePicture: function(picture){

        var pix = Photos.findOne(picture);
        if(!pix || !pix.owner === Meteor.userId()){
            throw new Error(300, "Forbidden");
        }

        if(pix.url){
            Activities.insertActivity({
                type: 'update_profile_picture',
                from: Meteor.userId(),
                to: null,
                on: {
                    objtype: 'picture',
                    ref: pix._id
                }
            });

            Meteor.users.update(Meteor.userId(), {$set: {'profile.picture': pix.url}});

            return true;
        } else {
            throw new Meteor.Error(500, 'Internal Error');
        }
    }
});

