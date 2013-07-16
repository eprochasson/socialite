Meteor.methods({
    addAsFriend: function(target){
        target = Meteor.users.findOne(target);
        if(!target){
            throw new Meteor.Error(404, 'User Not Found');
        }
        if(_.contains(target.blacklist, this.userId)){
            throw new Meteor.Error(403, 'Permission Denied');
        }

        var id;
        if(id = Friends.findOne({me: this.userId, target: target._id})){
            // Already friend.
            return id;
        }

        var fields = {
            me: this.userId, // That's me
            target: target._id,  // That's the person I'm becoming friend with.
            live: 1, // Link is alive.
            reciprocal: 0, // Connection goes both way
            timestamp: new Date().getTime()
        };
        var activity = {
            from: this.userId,
            to: target._id,
            on: {
                objtype: 'friend'
            }
        };

        // Answering a friend request.
        if(Friends.findOne({me: target._id, target: this.userId, live: 1})){
            fields.reciprocal = 1;
            Friends.update({me: target._id, target: this.userId}, {$set: {reciprocal: 1}});
            Notifications.insertNotification({
                owner: target._id,
                type: 'accepted_friend_request',
                from: this.userId,
                body: '',
                viewed: 0
            });
            activity.type = 'accepted_friend_request';

        } else {
            Notifications.insertNotification({
                owner: target._id,
                type: 'friend_request',
                from: this.userId,
                body: '',
                viewed: 0
            });
            activity.type = 'friend_request';
        }

        id = Friends.insert(fields);

        activity.on.ref = id;

        Activities.insertActivity(activity);

        return id;
    },
    removeFriend: function(target){
        // Just kill the link, keep the connection.
        target = Meteor.users.findOne(target);
        if(!target){
            throw new Meteor.Error(404, 'User Not Found');
        }

        var friend = Friends.findOne({target: target._id, me: this.userId});
        if(!friend){
            throw new Meteor.Error(404, 'User Not Found');
        }
        Friends.update({target: target._id, me: this.userId}, {$set: {live: 0, reciprocal: 0}}, function(err){
            if(!err){
                Activities.insertActivity({
                    from: Meteor.userId(),
                    to: target._id,
                    type: 'remove_friendship',
                    on: {
                        objtype: 'friend',
                        ref: friend._id
                    }
                });
            }
        });

        friend = Friends.findOne({me: target._id, target: this.userId});
        if(!friend){
            throw new Meteor.Error(404, 'User Not found');
        }
        Friends.update({me: target._id, target: this.userId}, {$set: {live: 0, reciprocal: 0}}, function(err){
            if(!err){
                Activities.insertActivity({
                    to: Meteor.userId(),
                    from: target._id,
                    type: 'remove_friendship',
                    on: {
                        objtype: 'friend',
                        ref: friend.id
                    }
                });
            }
        });

        return true;
    }
});