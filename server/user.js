Accounts.config({
    sendVerificationEmail: false
});

Accounts.validateNewUser(function(user){
    return true;
});