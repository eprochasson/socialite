Notifications = new Meteor.Collection('notifications');

Notifications.allow({
    update: function(userId, notification, fields){
        return userId === notification.owner && _.every(fields, function(f){ return _.contains(['viewed'], f)});
    },
    remove: function(){return true},
    insert: function(){return false}
});