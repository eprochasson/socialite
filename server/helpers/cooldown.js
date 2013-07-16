Cooldown = {
    // Check cooldown penalty. Update if necessary. Return the penalty if any, 0 otherwise.
    checkCooldown: function(userId, velocity){
        // Sender
        var user = Meteor.users.findOne(userId);
        if(!user){
            return Infinity;
        }

        // Check if the user is under a cooldown penalty.
        var cooldown = user.cooldown,
            penalty = 0;


        if(cooldown && cooldown > new Date().getTime()){
            //Add an extra cooldown.
            Meteor.users.update(Meteor.userId(), { $inc : {cooldown: Cooldown.cooldownPenalty} });
            penalty = cooldown+Cooldown.cooldownPenalty-new Date().getTime();

            // Record cooldown penalty.
            Activities.insertActivity({from: Meteor.userId(), to: null, type: 'cooldown_penalty'});

            return penalty;
        }

        // Check posted messages+comments.
        var messages = Messages.find({from: Meteor.userId(), sent: {$gt: new Date().getTime() - Cooldown.velocityCaliber}});
        var comments = Comments.find({from: Meteor.userId(), sent: {$gt: new Date().getTime() - Cooldown.velocityCaliber}});

        if(messages.count()+comments.count() > velocity){ // Posting too fast
            // Give a cooldown penalty
            Meteor.users.update(Meteor.userId(), {$set : { cooldown: new Date().getTime()+Cooldown.cooldownPenalty}});

            Activities.insertActivity({from: Meteor.userId(), to: null, type: 'cooldown_penalty'});
            return Cooldown.cooldownPenalty;
        }

        return 0;
    },
    // Reset a cooldown penalty
    resetCooldown: function(userId){
        return Meteor.users.update(userId, {$set: {cooldown: 0}});
    }
};

