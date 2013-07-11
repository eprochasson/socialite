Meteor.methods({
    sendMessage: function(doc){

        // Check that the emitter exists
        var target ;
        if(!(target = Meteor.users.findOne(doc.to))){
            throw new Meteor.Error(404, 'User not found');
        }
        // Check that the emitter is not blacklisted by the receiver.
        if(_.contains(target.blacklist, Meteor.userId())){
            throw new Meteor.Error(300, 'Permission Denied');
        }

        // Sender
        var user = Meteor.users.findOne(Meteor.userId());

        // Check if the user is under a cooldown penalty.
        var cooldown = user.cooldown;

        if(cooldown && cooldown > new Date().getTime()){
            //Add an extra cooldown.
            Meteor.users.update(Meteor.userId(), { $inc : {cooldown: Messages.cooldownPenalty} });
            throw new Meteor.Error(300, 'Posting too fast, wait ' + moment.duration(cooldown+Messages.cooldownPenalty-new Date().getTime()).humanize());
        }

        // Check user message sending velocity.
        var velocity = target.profile.online ? Messages.onlineMaxVelocity : Messages.offlineMaxVelocity;

        var messages = Messages.find({from: Meteor.userId(), sent: {$gt: new Date().getTime() - Messages.velocityCaliber}});

        if(messages.count() > velocity){ // Posting too fast
            // Give a cooldown penalty
            Meteor.users.update(Meteor.userId(), {$set : { cooldown: new Date().getTime()+Messages.cooldownPenalty }});
            throw new Meteor.Error(300, 'Posting too fast, wait ' + moment.duration(Messages.cooldownPenalty).humanize());
        }

        // All good, let's send that message
        // Reset potential user penalty
        Meteor.users.update(Meteor.userId(), {$set: {cooldown: 0}});

        doc.sent = new Date().getTime();
        doc.viewed = 0;
        doc.from = Meteor.userId();

        var message = _.pick(doc, ['body','sent','from','to', 'viewed']);

        var id = Messages.insert(message);
        // Create the conversations between those two uses if it does not exist already.
        // apparently upsert is fucked up with Meteor, so that's the best I could find.
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
                    lastMessageFrom: Meteor.userId()
                }
            });
        } else {
            Conversations.insert({
                timestamp: new Date().getTime(),
                owner: Meteor.userId(),
                with: target._id,
                lastMessageId: id,
                lastMessage: doc.body,
                lastMessageFrom: Meteor.userId()
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
                    lastMessageFrom: Meteor.userId()
                }
                });
        } else {
            Conversations.insert({
                timestamp: new Date().getTime(),
                with: Meteor.userId(),
                owner: target._id,
                lastMessageId: id,
                lastMessage: doc.body,
                lastMessageFrom: Meteor.userId()
            });
        }

        return true;
    }
});