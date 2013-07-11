Messages = new Meteor.Collection('messages');

Messages.allow({
    insert: function(userId, doc){
        // Check that the message is emitted by userId
        if(!(doc.from === userId)){
            return false;
        }

        // Check that the emitter exists
        var target ;
        if(!(target = Meteor.user.findOne(doc.to))){
            return false;
        }
        // Check that the emitter is not blacklisted to the receiver.
        if(_.contains(target.blacklist, userId)){
            return false;
        }

        // check that the message is not empty
        if(doc.body.length == 0){
            return false;
        }

        // All good. Let's go.
        return true;
    },
    update: function(userId, fields){
        return userId == fields.to; // Can only update message /received/
    }
});

Messages.deny({
    update: function(userId, fields){
        // only field that can be updated is the 'viewed' field.
        return (_.without(fields, 'viewed')).length > 0;
    }
});