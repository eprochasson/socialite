// Really inspired by https://github.com/tmeasday/meteor-presence/
var presenceTick;

Meteor.startup(function(){
    // update presences every interval
    presenceTick = Meteor.setInterval(function() {
        Meteor.Presence.update();
    }, Presences.checkInterval || 1000);
});

Meteor.Presence = {
    update: function(){
        Session.set('last-presence-at', new Date());
    }
};

// Update last seen date.
Meteor.autorun(function(){
    Session.get('last-presence-at'); // Just to hit the context.
    if(Meteor.userId()){
        Meteor.call('setUserPresence', function(err,res){
            if(err){
                console.log('setUserPresence: huho');
            }
        })
    }
});
