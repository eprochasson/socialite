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
    Messages
 */
// Duration to measure velocity (default 2 minutes).
//Messages.velocityCaliber = 60*1000*2;
Messages.velocityCaliber = 30*1000;
// If target user is online, how many messages per velocityCaliber millisecond can the emitter send
Messages.onlineMaxVelocity = 5;
// If target is offline
Messages.offlineMaxVelocity = 5;
// Cooldown penalty (def: 1 minute)
Messages.cooldownPenalty = 10*1000;

/*
    User posted Pictures.
 */
// Fields people can change
Pictures.authorizedFields = ['main'];
// Max file size allowed for upload
Pictures.maxFileSize = 1024*1024;
// Max number of file per user (-1 = infinite)
Pictures.maxFilePerUser = -1;

/*
    Check user presence
 */
Presence = {};
// How often do we update presence (ms)
Presence.checkInterval = 2000;
// How long before a user is considered out (ms).
Presence.TimeOut = 10000;
