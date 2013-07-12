// Really inspired by https://github.com/tmeasday/meteor-presence/

//Check user presence
Meteor.methods({
    setUserPresence: function(){
        if(!Presences.findOne({user: Meteor.userId()})){
            return Presences.insert({
                user: Meteor.userId(),
                lastseen: new Date().getTime(),
                online: 1
            })
        } else {
            return Presences.update(
                {user: Meteor.userId()},
                {$set: {lastseen: new Date().getTime(), 'online': 1}}
            );
        }
    },
    setInvisible: function(invisible){
        return Presences.update({user: this.userId}, {$set: {invisible: Boolean(invisible)}}) &&
            Meteor.users.findOne(this.userId, {$set: {'settings.invisible': Boolean(invisible)}});
    }
});

Meteor.startup(function(){
    // Update user not connected.
    Meteor.setInterval(function(){
        Presences.update({lastseen: {$lt:(new Date().getTime() - Presences.TimeOut)}}, {$set: {'online': 0}});
    }, Presences.checkInterval || 1000);
});
