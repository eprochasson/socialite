

Meteor.methods({
    'update_profile': function(values){
        var valid = true;
        var cleaned = Meteor.user().profile; // store name -> value
        if(!cleaned) cleaned = {}; // Empty profile
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
                            }
                        } else {
                            valid = false;
                        }
                    });
                    if(valid){
                        // All good, let's input
                        cleaned[question.name] = val;
                    }
                }
            } else {
                valid = false;
            }
        });
        if(!valid){
            throw new Meteor.Error(400, 'Invalid Data');
        } else {
            // Account only visible if at least those two information are made available.
            var visible = 0;
            if(cleaned.name && cleaned.gender){
                visible = 1;
            }

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
            throw new Meteor.Error(403, "Forbidden");
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
    },
    profile_completed: function(){
        // Check that we had enough information, then make user profile completed and public.
        var profile = Meteor.user().profile;
        if(!profile){
            throw new Meteor.Error(404, 'User Not Found');
        }

        if(Meteor.profileCreation && Meteor.profileCreation.requiredFieldForCompletion){
            if(_.every(Meteor.profileCreation.requiredFieldForCompletion, function(f){ return !_.isUndefined(profile[f])})){
                Meteor.users.update(this.userId, {$set: {profile_complete: 1, visible: 1}});
                return true;
            } else {
                console.log('Something wrong, seems like we allowed a user to go public with invalid profile', profile);
                throw new Meteor.Error(500, 'Internal Error');
            }
        } else {
            return true;
        }
    }
});

