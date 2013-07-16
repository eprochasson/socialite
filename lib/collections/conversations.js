Conversations = new Meteor.Collection('conversations');

// Record who's talking with who, and the last message.
// All managed server side with message posting.
Conversations.allow({
    insert: function(userId, doc){
        return false;
    },
    update: function(userId, doc, fields){
        // only allow to update the "viewed" status of a conversation
        return userId === doc.owner && _.every(fields, function(f){ return _.contains(['viewed'], f)});
    },
    remove: function(){
        return false;
    }
});