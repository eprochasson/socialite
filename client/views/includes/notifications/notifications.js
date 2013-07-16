Template.notifications.helpers({
    notifications: function() {
        return Notifications.find({}, {limit: 7, sort: {timestamp: -1}});
    },
    notificationCount: function(){
        var count = Notifications.find({viewed: 0}).count();
        if(count >= 10){
            return '10+';
        } else {
            return count;
        }
    }
});

Template.notifications.events({
    'click a.dropdown-toggle': function() {
        var notifications = Notifications.find({});
        notifications.forEach(function(a){
            Notifications.update(a._id, {$set: {viewed: 1}});
        });
    }
});