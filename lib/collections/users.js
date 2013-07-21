//User collection defined by default

Meteor.users.allow({
    update: function(){ return false ;},
    remove: function(){ return false ;},
    insert: function(){ return false ;}
});

if(Meteor.isServer){
    Meteor.users._ensureIndex({'loc':"2d"});
}
