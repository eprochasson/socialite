// Really inspired by https://github.com/tmeasday/meteor-presence/

// When to flag a user as offline
PRESENCE_TIMEOUT_MS = 10000;
// How often to refresh online/offline users.
PRESENCE_INTERVAL = 5000;

//Check user presence
Meteor.methods({
    setUserPresence: function(){
        Meteor.users.update(Meteor.userId(), {$set: {lastseen: new Date().getTime(), 'profile.online': 1}});
    }
});

// Update user not connected.
Meteor.setInterval(function(){
    Meteor.users.update({lastseen: {$lt:(new Date().getTime() - PRESENCE_TIMEOUT_MS)}}, {$set: {'profile.online': 0}});
}, PRESENCE_INTERVAL);
