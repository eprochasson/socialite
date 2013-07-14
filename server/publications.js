Meteor.publish("myData", function () {
    return Meteor.users.find(
        {_id: this.userId},
        { fields: Meteor.user.myProfileInformation }
    );
});

Meteor.publish('questions', function(){
    return Questions.find();
});

Meteor.publish("myConversations", function(limit) {
    Meteor.publishWithRelations({
        handle: this,
        collection: Conversations,
        filter: {owner: this.userId},
        options: {limit: limit, sort: {timestamp: -1}},
        mappings: [{  // Publish people sending message as well, as they might not be in your friendlist.
            key: 'with',
            collection: Meteor.users,
            options: {fields: Meteor.user.publicProfileInformation}
        }]
    });
});

Meteor.publish("oneConversation", function(conversation, limit){
    if(conversation){
        var conv = Conversations.findOne(conversation);
        if(conv.owner == this.userId){
            var query = {
                $or: [{from: this.userId, to: conv.with},{from: conv.with, to: this.userId}]
            };

            Meteor.publishWithRelations({
                handle: this,
                collection: Messages,
                filter: query,
                options: {limit: limit, sort: {sent: -1}},
                mappings: [{  // Publish people sending message as well, as they might not be in your friendlist.
                    key: 'from',
                    collection: Meteor.users,
                    options: {fields: Meteor.user.publicProfileInformation}
                }]
            })
        }
    }
 });


Meteor.publish("myFriendList", function(limit){
    // load a very light version of the friendlist
    // Not very reactive.

    if(this.userId){
        Meteor.publishWithRelations({
           handle: this,
            collection: Friends,
            filter: {me: this.userId, live: 1},
            options: {limit: limit},
            mappings: [{
                key: 'target',
                collection: Meteor.users, // publish user profile along the list of friends.
                options: {fields: Meteor.users.publicProfileInformation}
            }]
        })
    }
});

Meteor.publish("userProfile", function(targetId){
    if(!this.userId||!targetId){
        return null;
    }

    var friendship = Friends.findOne({target: this.userId, me: targetId, live: 1});
    var fields;
    if(friendship){
        fields = Meteor.users.privateProfileInformation;
    } else {
        fields = Meteor.users.publicProfileInformation;
    }
    return Meteor.users.find({_id: targetId}, {fields: fields});
});

Meteor.publish('oneUserPictures', function(targetId){
    if(!this.userId || !targetId){
        return null;
    }
    var friendship = Friends.findOne({target: this.userId, me: targetId, live: 1});
    if(friendship){
        return Pictures.find({ owner: userId});
    } else {
        return [];
    }
});

Meteor.publish('myPictures', function(){
    return Pictures.find({owner: this.userId});
});

/******************************
    Admin !
 ******************************/

// Remove!
Meteor.publish("adminShowEveryone", function(){
    var user = Meteor.users.findOne(this.userId);
    if(user){
        if(user.isAdmin){
            return Meteor.users.find({});
        } else {
            return [];
        }
    }
});

