Meteor.methods({
    sendMessage: function(doc){
        // Check that the emitter exists
        var target ;
        if(!(target = Meteor.users.findOne(doc.to))){
            throw new Meteor.Error(404, 'User Not Found');
        }
        // Check that the emitter is not blacklisted by the receiver.
        if(_.contains(target.blacklist, Meteor.userId())){
            throw new Meteor.Error(403, 'Permission Denied');
        }

        // Sender
        var user = Meteor.users.findOne(Meteor.userId());

        // Check user message sending velocity.
        var velocity = target.profile.online ? Cooldown.onlineMaxVelocity : Cooldown.offlineMaxVelocity,
            penalty;

        if(penalty = Cooldown.checkCooldown(Meteor.userId(), velocity)){
            throw new Meteor.Error(403, 'Posting Too Fast', moment.duration(penalty).humanize());
        }

        // All good, let's send that message
        // Reset potential user penalty
        Cooldown.resetCooldown(Meteor.userId());

        doc.sent = new Date().getTime();
        doc.viewed = 0;
        doc.from = Meteor.userId();

        var message = _.pick(doc, ['body','sent','from','to', 'viewed']);

        var id = Messages.insert(message);
        // Create the conversations between those two uses if it does not exist already.
        // apparently upsert is fucked up with Meteor, so that's the best I could do.
        if(Conversations.findOne({
            owner: Meteor.userId(),
            with: target._id
        })){
            Conversations.update(
                {
                    owner: Meteor.userId(),
                    with: target._id
                },{ $set: {
                    timestamp: new Date().getTime(),
                    lastMessageId: id,
                    lastMessage: doc.body,
                    lastMessageFrom: Meteor.userId(),
                    viewed: 1
                }
            });
        } else {
            Conversations.insert({
                timestamp: new Date().getTime(),
                owner: Meteor.userId(),
                with: target._id,
                lastMessageId: id,
                lastMessage: doc.body,
                lastMessageFrom: Meteor.userId(),
                viewed: 1
            });
        }
        if(Conversations.findOne({
            with: Meteor.userId(),
            owner: target._id
        })){
            Conversations.update(
                {
                    with: Meteor.userId(),
                    owner: target._id
                },{ $set: {
                    timestamp: new Date().getTime(),
                    lastMessageId: id,
                    lastMessage: doc.body,
                    lastMessageFrom: Meteor.userId(),
                    viewed: 0
                }
                });
        } else {
            Conversations.insert({
                timestamp: new Date().getTime(),
                with: Meteor.userId(),
                owner: target._id,
                lastMessageId: id,
                lastMessage: doc.body,
                lastMessageFrom: Meteor.userId(),
                viewed: 0
            });
        }

        // record activity
        Activities.insertActivity({
            from: Meteor.userId(),
            to: target._id,
            ref: id,
            on: {},
            type: 'message'
        });

        return true;
    }
});