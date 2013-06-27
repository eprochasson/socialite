Template.register.events({
    'click #cancel': function(e){
        e.preventDefault();
        Session.set('showregister', false);
        return false;
    },
    'submit #register-form' : function(e, t) {
        e.preventDefault();
        var email = t.find('#login-email').value,
            password = t.find('#login-password').value,
            confirm_password = t.find('#login-password-confirmation').value;
        // Trim and validate the input
        Session.set('register_errors', null);

        Meteor.call('register_user',email, password, confirm_password, function(err){
            if(err){
                Session.set('register_errors', err.error);
            } else {

            }
        });

        return false;
    }
});

Template.register.helpers({
    register_errors : function(){
        return Session.get('register_errors');
    }
});