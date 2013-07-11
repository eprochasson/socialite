Meteor.publish('questions', function(){
    return Questions.find();
});

Meteor.publish("myData", function () {
    return Meteor.users.find(
        {_id: this.userId},
        {fields:
            {
                'profile': 1,
                friends: 1,
                settings: 1
            }
        }
    );
});

//Meteor.publish("myConversations", function() {
//    Meteor.publishWithRelations({
//        handle: this,
//        collection: Conversations,
//        filter: {owner: this.userId},
//        mappings: [{
//            key: 'with',
//            collection: Meteor.users
//        }]
//    });
//});
//
//Meteor.publish("myConversations", function(limit, skip){
//    // We need basic information about the people we're talking to.
//    var self = this, conversationsHandle = null, profileHandle = [];
//
//    function publishProfile(conversation){
////        console.log('conversation', conversation);
//        var profile = Meteor.users.find(conversation.with);
//        profileHandle[conversation._id] = profile.observe({
//            added: function(profile){
//                self.added(profile);
//            }
//        });
//    }
//    conversationsHandle = Conversations.find({}, {limit: limit, skip: skip}).observe({
////    conversationsHandle = Conversations.find({owner: this.userId}, {limit: limit, skip: skip}).observe({
//        added: function(conversation){
////            publishProfile(conversation);
//            self.added(conversation);
//        }
//
//    });
//
//    self.ready();
//
//    self.onStop(function(){
//        conversationsHandle.stop();
//        _.each(profileHandle, function(p){ p.stop()});
//    });
//});

Meteor.publish("myConversations", function(limit, skip){
    return Conversations.find({owner: this.userId}, {limit: limit, skip: skip});
});

Meteor.publish("myMessages", function(limit, skip){
    return Messages.find({ $or: { to: this.userId, from: this.userId}}, {limit: limit, skip: skip});
});

Meteor.publish("myFriends", function(limit, skip){
    var me = Meteor.users.findOne(this.userId);
    return Meteor.users.find({_id : {$in : me.friends}}, {fields: { profile: 1 } });
});

// Also maintains user online/offline status
Meteor.publish("myOnlineFriends", function(){
    var friends = Meteor.users.findOne(this.userId).friends || [];
    return Meteor.users.find({ 'profile.online': 1, 'settings.invisible': false, _id: {$in: friends}}, {sort: {lastConnected : -1}});
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
        fields = {
            'profile.name': 1,
            'profile.gender': 1
        };
    } else if(target.friends && _.contains(target.friends, source._id)){ // You're friends
        // show all profile.
        if(target.friends && _.contains(target.friends, source._id)){
            fields = {
                'profile': 1
            }
        }
    } else {
        fields = {
            'profile.name': 1,
            'profile.gender': 1
        };
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