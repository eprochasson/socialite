Meteor.methods({
    sendComment: function(doc){
        // Check that the commented object exists
        var target, collection ;
        switch(doc.objtype){
            case 'picture':
                collection = Photos;
                break;
            case 'status':
                break;
            default:
                throw new Meteor.Error(404, "Invalid Object reference");
        }

        if(!doc.ref || !(target = collection.findOne(doc.ref))){
            throw new Meteor.Error(404, 'Object not found');
        }

        // the owner of the object.
        var owner = Meteor.users.findOne(doc.owner);
        if(!owner){
            throw new Meteor.Error(404, 'Owner not found');
        }

        // Check that the emitter is not blacklisted by the receiver.
        if(_.contains(owner.blacklist, Meteor.userId())){
            throw new Meteor.Error(300, 'Permission Denied');
        }

        var velocity = Cooldown.offlineMaxVelocity,
            penalty;

        if(penalty = Cooldown.checkCooldown(Meteor.userId(), velocity)){
            throw new Meteor.Error(300, 'Posting too fast, wait ' + moment.duration(penalty).humanize());
        }

        // All good, let's post that comment
        // Reset potential user penalty
        Cooldown.resetCooldown(Meteor.userId());

        doc.sent = new Date().getTime();
        doc.from = Meteor.userId();

        var comment = _.pick(doc, ['body','sent','from','picture', 'viewed', 'ref', 'reftype']);

        var id = Comments.insert(comment);

        // Send a notification to the person who owns the picture.
        Notifications.insertNotification({
            type: 'comment',
            body: comment.body,
            viewed: 0,
            owner: owner.id,
            from: this.userId,
            ref: comment.ref,
            reftype: comment.reftype
        });

        // record activity
        Activities.insertActivity({
            from: Meteor.userId(),
            to: target._id,
            ref: id,
            on: {
                objtype: doc.objtype,
                ref: doc.ref
            },
            type: 'comment'
        });


        return id;
    }
});