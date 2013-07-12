Presences = new Meteor.Collection('presences');


// Can't touch me
Presences.deny({
    insert: function(){ return true; },
    update: function(){ return true; },
    remove: function(){ return true; }
});