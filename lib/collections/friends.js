Friends = new Meteor.Collection('friends');

Friends.deny({
    update: function(){return true},
    remove: function(){return true},
    insert: function(){return true}
});