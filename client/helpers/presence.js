
// Really inspired by https://github.com/tmeasday/meteor-presence/
Meteor.Presence = {
    update: function(){
        Session.set('last-presence-at', new Date());
    }
};

Meteor.autorun(function(){
    Session.get('last-presence-at');
    Meteor.call('setUserPresence',function(err,res){
        if(err){
            console.log('setUserPresence: huho');
        }
    })
});

PRESENCE_INTERVAL = 1000;

// update presences every interval
Meteor.setInterval(function() {
    Meteor.Presence.update();
}, PRESENCE_INTERVAL);