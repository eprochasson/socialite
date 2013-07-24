Friends = new Meteor.Collection('friends');

Friends.deny({
    update: function(){return true},
    remove: function(){return true},
    insert: function(){return true}
});

if(Meteor.isServer){
    Friends._ensureIndex({me:1,target:1}, {unique: true});
}
