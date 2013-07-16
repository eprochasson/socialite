Meteor.methods({
    addAsFriend: function(target){
        target = Meteor.users.findOne(target);
        if(!target){
            throw new Meteor.Error(404, 'Person not found');
        }
        if(_.contains(target.blacklist, this.userId)){
            throw new Meteor.Error(300, 'Blocked');
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

        } else {
            Notifications.insertNotification({
                owner: target._id,
                type: 'friend_request',
                from: this.userId,
                body: '',
                viewed: 0
            });
        }

        id = Friends.insert(fields);

        // Also send a notification to the target user if it's not a reply.
        return id;
    },
    removeFriend: function(target){
        // Just kill the link, keep the connection.
        target = Meteor.users.findOne(target);
        if(!target){
            throw new Meteor.Error(404, 'Person not found');
        }

        Friends.remove({target: target._id, me: this.userId});
        Friends.remove({me: target._id, target: this.userId});

        return true;
    }
});