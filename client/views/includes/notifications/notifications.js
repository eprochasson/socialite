var getUser = function(id){
    if(id){
        return Meteor.users.findOne(id, {reactive: false});
    } else {
        return {};
    }
};

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

Template.notification.helpers({
    tpl: function(){
        switch(this.type){
            case 'friend_request':
                return 'notification_friend_request';
                break;
            case 'accepted_friend_request':
                return 'notification_accepted_friend_request';
                break;
            default:
                return 'notification_default';
        }
    }
});


Template.notification_friend_request.helpers({
    user: function(){
        return getUser(this.from)
    }
});
Template.notification_accepted_friend_request.helpers({
    user: function(){
        return getUser(this.from)
    }
});

Template.notification_friend_request.events({
    'click button.accept': function(e){
        e.preventDefault();
        var self = this;

        Meteor.call('addAsFriend', this.from, function(err,res){
            if(err){
                Errors.modal(err);
            } else {
                // Remove the notification.
                Notifications.remove(self._id);
                Errors.notification('Friend request confirmed!');
            }
        });
    },
    'click button.ignore': function(e){
        e.preventDefault();
        Notifications.remove(this._id);
    }
});