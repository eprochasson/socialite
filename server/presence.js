// Really inspired by https://github.com/tmeasday/meteor-presence/

//Check user presence
Meteor.methods({
    setUserPresence: function(invisible){
        // We record user presence regardless of their online status.
        return Meteor.users.update(Meteor.userId(), {$set: {lastseen: new Date().getTime(), 'profile.online': 0+!invisible, 'settings.invisible': invisible}});
    }
});

Meteor.startup(function(){
// Update user not connected.
    Meteor.setInterval(function(){
        Meteor.users.update({lastseen: {$lt:(new Date().getTime() - Presence.TimeOut)}}, {$set: {'profile.online': 0}});
    }, Presence.checkInterval || 1000);
});
