// Really inspired by https://github.com/tmeasday/meteor-presence/

//Check user presence
Meteor.methods({
    setUserPresence: function(){
        var presence;
        // User connected for the first time, he's not registered.
        if(!(presence = Presences.findOne({user: Meteor.userId()}))){
            // Mark it online for his friends.
            Friends.update({ target: Meteor.userId(), live: 1 }, {$set: {online: 1}},{multi: 1});

            // Record it's presence
            return Presences.insert({
                user: Meteor.userId(),
                lastseen: new Date().getTime(),
                online: 1,
                timespent: 0
            });
        } else {

            // If the user is not invisible, tell all his friends he is connected.
            if(!presence.invisible){
                Friends.update({ target: Meteor.userId(), live: 1 }, {$set: {online: 1}},{multi: 1});
            }
            return Presences.update(
                {user: Meteor.userId()},
                {$set: {lastseen: new Date().getTime(), online: 1}, $inc : {timespent: Presences.checkInterval}}
            );
        }
    },
    setInvisible: function(invisible){
        Friends.update({ target: Meteor.userId(), live: 1 }, {$set: {online: !Boolean(invisible)}},{multi: 1});
        Presences.update({user: this.userId}, {$set: {invisible: Boolean(invisible)}});
        Meteor.users.findOne(this.userId, {$set: {'settings.invisible': Boolean(invisible)}});
    }
});

Meteor.startup(function(){
    // Update user not connected.
    Meteor.setInterval(function(){
        var presences = Presences.find({lastseen: {$lt:(new Date().getTime() - Presences.TimeOut)}, online: 1});
        presences.forEach(function(p){
            // Tell all his friends he got offline
            Friends.update({target:p.user},{ $set: {online: 0}},{multi: 1});
            Presences.update({user:p.user}, {$set: {online: 0}});
        });
    }, Presences.checkInterval || 1000);
});
