// Really inspired by https://github.com/tmeasday/meteor-presence/
var presenceTick;

Meteor.startup(function(){
    // update presences every interval
    presenceTick = Meteor.setInterval(function() {
        Meteor.Presence.update();
    }, Presence.checkInterval || 1000);
});



//Session.set('invisible', Meteor.user().invisible);

Meteor.Presence = {
    update: function(){
        Session.set('last-presence-at', new Date());
    }
};

// Update last seen date.
Meteor.autorun(function(){
    Session.get('last-presence-at'); // Just to hit the context.

    var settings = Session.get('settings')||{};
    var invisible = settings.invisible;
    if(invisible == undefined){
        // Default to true, to avoid "blinking" on other clients
        // (otherwise, invisible users get set online for a short time, before being updated to invisible)
        invisible = true;
    }
    Meteor.call('setUserPresence', invisible, function(err,res){
        if(err){
            console.log('setUserPresence: huho');
        }
    })
});
