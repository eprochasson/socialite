Meteor.publish("myData", function () {
    return Meteor.users.find(
        this.userId,
        { fields: Meteor.users.myProfileInformation }
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

Meteor.publish('myPictures', function(){
    return Photos.find({owner: this.userId});
});

// Return unread notifications
Meteor.publish('myNotifications', function(){
    Meteor.publishWithRelations({
        handle: this,
        collection: Notifications,
        filter: {owner: this.userId},
        options: {limit: 7, sort: {timestamp: -1}, fields: {from: 1, timestamp: 1, body: 1, type: 1, viewed: 1}},
        mappings: [{
            collection: Meteor.users,
            key: 'from',
            options: {fields: Meteor.users.publicProfileInformation}
        }]
    });
});

Meteor.publish('myNewsfeed', function(limit){

    // All my friends.
    var friends = Friends.find({me: this.userId, reciprocal: 1, live: 1});
    var friendlist = [];
    friends.forEach(function(f){
        friendlist.push(f.target);
    });

    Meteor.publishWithRelations({
        handle: this,
        collection: Activities,
        filter: {
            type: {$in: Activities.publicActivities}, // only some activities
            $or: [{from: {$in: friendlist}},{to: {$in: friendlist}}]  // happening to my friends
        },
        options: {limit: limit, sort: {timestamp: -1}, fields: {}},
        mappings: [{
            collection: Meteor.users,
            key: 'to',
            options: {fields: Meteor.users.publicProfileInformation}
        },{
            collection: Meteor.users,
            key: 'from',
            options: {fields: Meteor.users.publicProfileInformation}
        }]
    });
});

Meteor.publish("oneConversation", function(conversation, limit){
    if(!this.userId){
        return;
    }
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
    if(this.userId){
        Meteor.publishWithRelations({
           handle: this,
            collection: Friends,
            filter: {me: this.userId, live: 1},
            options: {limit: limit, fields: { reciprocal: 1, target: 1, me: 1, online: 1}},
            mappings: [{
                key: 'target',
                collection: Meteor.users, // publish user profile along the list of friends.
                options: {fields: Meteor.users.publicProfileInformation}
            }]
        })
    }
});

Meteor.publish("userProfile", function(targetId){
    if(this.userId && targetId){
        var friendship = Friends.findOne({target: this.userId, me: targetId, live: 1});
        var fields;
        if(friendship){
            fields = Meteor.users.privateProfileInformation;
        } else {
            fields = Meteor.users.publicProfileInformation;
        }

        Meteor.publishWithRelations({
            handle: this,
            collection: Meteor.users,
            filter: {_id: targetId},
            options: {fields: fields},
            mappings: [{ // indicate if the user's online as well.
                key: 'user',
                reverse: true,
                collection: Presences,
                filter: { invisible: {$ne : 1} },
                options: {fields: {'user':1, 'online':1}}
            }]
        });
    }
});

Meteor.publish('oneUserPictures', function(targetId){
    if(!this.userId || !targetId){
        return null;
    }
    var friendship = Friends.findOne({target: this.userId, me: targetId, live: 1});
    if(friendship){
        return Photos.find({ owner: targetId});
    } else {
        return [];
    }
});

Meteor.publish('oneUserActivities', function(userId, limit){
    if(!this.userId || !userId){
        return null;
    }
    var friendship = Friends.findOne({target: this.userId, me: userId, live: 1});
    if(friendship){
        return Activities.find(
            { $or: [{from: userId}, {to: userId}], type: {$in : Activities.publicActivities}},
            {limit: limit, sort: {timestamp: -1}}
        );
    } else {
        return [];
    }
});

Meteor.publish('searchResults', function(options,limit){
    if(!options||!this.userId){
        return false;
    }

    limit = limit || Meteor.users.searchResultsLimit || 10;

    var user = Meteor.users.findOne(this.userId);
    var userloc = user.loc;
    var friends = Friends.find({me: this.userId});
    var excludes = [];
    friends.forEach(function(f){
        excludes.push(f.target);
    });

    excludes.push(this.userId);

    if(userloc){
        options['loc'] = {
            $near: {
                coordinates: userloc
            }
        };
    }
    options._id = {$nin: excludes};
    options.visible = 1;

    Meteor.publishWithRelations({
        handle: this,
        collection: Meteor.users,
        filter: options,
        options: {sort: {lastseen: -1}, limit: limit, fields: Meteor.users.publicProfileInformation},
        mappings: [{ // indicate if the user's online as well.
            key: 'user',
            reverse: true,
            collection: Presences,
            filter: { invisible: {$ne : 1} },
            options: {fields: {'user':1, 'online':1}}
        }]
    });

    return [];

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
    } else {
        return [];
    }
});

