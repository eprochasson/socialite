// Comments on Pictures.
Comments = new Meteor.Collection('comments');

Comments.allow({
    insert: function(){return false;},
    update: function(){return false;},
    remove: function(){return false}
});