Conversations = new Meteor.Collection('conversations');

// Record who's talking with who, and the last message.
// All managed server side with message posting.
Conversations.allow({
    insert: function(userId, doc){
        return false;
    },
    update: function(userId, doc){
        return false;
    },
    remove: function(){
        return false;
    }
});