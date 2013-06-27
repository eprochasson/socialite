Meteor.i18nMessages.default = {
    welcome: {
        en:  'Welcome to socialite', // Use {{}} to mark placeholders.
        fr: 'Bienvenue sur Socialite'
    },
    title_profile: {
        en: 'Profile of {{email}}',
        fr: 'Profile de {{email}}'
    },
    email: 'email',
    password: 'password',
    signin: 'signin',
    register: 'Register',
    password_confirmation: 'Confirm Password',
    login: 'login',
    account_create: 'Create an account',
    cancel: 'Cancel'
};

Meteor.i18nMessages.errors = {
    invalid_email: 'Invalid email',
    invalid_password: 'Invalid password',
    password_confirmation_mismatch: 'Password do not match',
    account_already_exists: 'This account already exists',
    'Email already exists.': 'This email is already in use'
};

// Helper to call lexicon from anywhere.
Handlebars.registerHelper('Lex', function(k, options){
    return __(k, options.hash);
});