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
    if(!conversation){
        return [];
    }
    var conv = Conversations.findOne(conversation);
    if(!(conv.owner == this.userId)){
        return [];
    }

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
    });

    return Messages.find(query, {limit: limit, sort: {sent: -1}});
});

Meteor.publish("myFriendList", function(){
    // load a very light version of the friendlist
    var me = Meteor.users.findOne(this.userId);
    return Meteor.users.find(
        {_id : {$in : me.friends}, 'visible': 1},
        {
            sort: {'profile.name': 1},
            fields: {'profile.name': 1, _id: 1, 'profile.picture': 1}
        }
    );
});


// Also maintains user online/offline status
Meteor.publish("myOnlineFriends", function(){
    var friends = Meteor.users.findOne(this.userId).friends || [];
    Meteor.publishWithRelations({
        handle: this,
        collection: Presences,
        filter: {user: {$in : friends}, online: 1, invisible: false},
        options: {fields: {user: 1}, sort:{ lastseen: -1}},
        mappings: [{  // Publish people sending message as well, as they might not be in your friendlist.
            key: 'user',
            collection: Meteor.users,
            options: {fields: Meteor.user.publicProfileInformation}
        }]
    });
});


Meteor.publish("userProfile", function(userId){
    // Check that this user can see each others.
    var source = Meteor.users.findOne(this.userId);
    var target = Meteor.users.findOne({_id: userId, 'visible': 1});
    if(!target){
        return false;
    }
    var fields = {};

    if(target && target.blacklist && _.contains(target.blacklist ,source._id)){ // You're blocked
        fields = Meteor.users.publicProfileInformation;
    } else if(target.friends && _.contains(target.friends, source._id)){ // You're friends
        // show all profile.
        if(target.friends && _.contains(target.friends, source._id)){
            fields = Meteor.users.privateProfileInformation;
        }
    } else {
        fields = Meteor.users.publicProfileInformation;
    }
    return Meteor.users.find({_id: userId}, {fields: fields});
});

Meteor.publish('oneUserPictures', function(userId){
    if(userId){
        // Send over the picture attached to a user depending on permission.
        var source = Meteor.users.findOne(this.userId);
        var target = Meteor.users.findOne({_id: userId, 'visible': 1});

        var limit = {limit: 2, sort: {sortorder: -1}};
        if(target && target.friends && _.contains(target.friends, source._id)){
            limit = {limit: 0, sort: {sortorder: -1}};
        }

        return Pictures.find({ owner: userId});
    } else {
        return [];
    }
});

Meteor.publish('myPictures', function(){
    return Pictures.find({owner: this.userId});
});


/*
    Admin !
 */

// Remove!
Meteor.publish("adminShowEveryone", function(){
    var user = Meteor.users.findOne(this.userId);
    if(user.isAdmin){
        return Meteor.users.find({});
    } else {
        return [];
    }
});

