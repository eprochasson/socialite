isValidPassword = function(password){
    return password.length > 6;
};

isValidEmail = function(email){
    return true;
};




Meteor.methods({
    'register_user': function(email, password, password_confirmation, callback){

        var errors = {}, valid = true;

        if(Meteor.users.findOne({'emails.address': email})){
            errors.general = __('errors.account_already_exists');
            valid = false;
        }

        if(!isValidEmail(email)){
            errors.email = __('errors.invalid_email');
            valid = false;
        }

        if(!isValidPassword(password)){
            errors.password = __('errors.invalid_password');
            valid = false;
        }

        if(!(password === password_confirmation)){
            errors.password = __('errors.password_confirmation_mismatch');
            valid = false;
        }

        if(valid){
            try{
                var user = Accounts.createUser({email: email, password: password});
            } catch(e){
                console.log(e);
            }
        }

        if(!valid){
            throw new Meteor.Error(errors);
        } else {
            return user;
        }
    },
    'user_exists': function(email){
        return Meteor.users.findOne({'emails.address': email});
    }
});

