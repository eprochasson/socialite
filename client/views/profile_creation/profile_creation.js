var validateControlGroup = function(input){
    _.each($(input).find('input, select'), function(self){
        Meteor.call('validate_input', $(self).val(), $(self).data('id'), $(self).data('validate'), function(err, res){
            if(err){
                $(input).addClass('error');
                $(input).removeClass('success');
                if($(input).find('.help-inline')){
                    $(input).find('.help-inline').html(__(err.reason));
                }
                ok = false;
            } else {
                $(input).removeClass('error');
                $(input).addClass('success');
                if($(input).find('.help-inline')){
                    $(input).find('.help-inline').html('Ok!');
                }
            }
        });
    });
};


Template.profile_creation.events = {
    'submit form': function(e){
        e.preventDefault();
        var res = {};

        // validate all input
        _.each($('form .control-group'),function(input){
            validateControlGroup(input);
        });

        var values = {};
        var docid;
        _.each($('form input, form select'), function(input){
            docid = $(input).data('id');
            if(docid){
                values[docid] = $(input).val();
            }
        });

        Meteor.call('update_profile', values, function(err, res){
            if(err){

                Errors.modal(err);
            } else {
                var currentStep = Session.get('profileCreationCurrentStep');
                if(currentStep == Meteor.profileCreation.numberOfStep){
                    console.log('Moving one!');

                    Meteor.call('profile_completed', function(err, res){
                        if(err){
                            console.log(err);
                        } else {

                            // Profile completed!
                            Session.set('profileComplete', 1);
                            Meteor.Router.to('profile_done');
                        }
                    })
                } else {
                    Session.set('profileCreationCurrentStep', currentStep+1);
                }

            }
        });
    },
    'blur form input': function(e){
        e.preventDefault();
        var element = e.target;
        var parent = $(element).parents(".control-group");

        _.each($(parent), function(input){
            validateControlGroup(input);
        })
    },
    'change form select': function(e){
        e.preventDefault();
        var element = e.target;
        var parent = $(element).parents(".control-group");

        _.each($(parent), function(input){
            validateControlGroup(input);
        })
    }
};

Template.profile_creation.helpers({
    profileCreationCurrentStep: function(){
        var step = Session.get('profileCreationCurrentStep');
        if(step === undefined){
            Session.set('profileCreationCurrentStep', 1);
            return ; //function will be called again with update step.
        }

        if(Template['profile_creation_step'+step]){
            return Template['profile_creation_step'+step]();
        }
    }
});