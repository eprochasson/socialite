// Activities between users.

Activities = new Meteor.Collection('activities');

Activities.allow({
    update:function(){return false},
    insert:function(){return false},
    remove:function(){return false}
});
