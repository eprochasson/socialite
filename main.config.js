if(Meteor.isClient){
    Accounts.ui.config({
        passwordSignupFields: 'EMAIL_ONLY'
    });

    // Default language for the application
    Meteor.setLocale('en_GB');

    //FilePicker API Key
    filePickerKey = "Av2HCAqJSM2aHdX5yKTZtz";
}


/*
    Users configuration
 */
// What fields are public for everyone
Meteor.users.publicProfileInformation = {
    // show selected information
    'profile.name' : 1,
    'profile.dob': 1,
    'profile.gender': 1,
    'profile.online': 1,
    'profile.picture': 1
};
// What fields are reserved for friends only
Meteor.users.privateProfileInformation = {
    'profile': 1 // show all profile
};

// What field I can see about myself
Meteor.users.myProfileInformation = {
    'profile': 1,
    'friends': 1,
    'settings': 1
};

/*
    Messages configuration
*/
// Duration to measure velocity (default 2 minutes).
Messages.velocityCaliber = 30*1000;
// If target user is online, how many messages per velocityCaliber millisecond can the emitter send
Messages.onlineMaxVelocity = 15;
// If target is offline
Messages.offlineMaxVelocity = 5;
// Cooldown penalty (def: 1 minute)
Messages.cooldownPenalty = 10*1000;
// How many messages to display per page.
Messages.messagePerPage = 2;

/*
    User posted Pictures configuration
*/
// Fields people can change
Pictures.authorizedFields = ['main'];
// Max file size allowed for upload
Pictures.maxFileSize = 1024*1024;
// Max number of file per user (-1 = infinite)
Pictures.maxFilePerUser = -1;

/*
    Check user presence configuration
*/
// How often do we update presence (ms)
Presences.checkInterval = 2000;
// How long before a user is considered out (ms).
Presences.TimeOut = 10000;