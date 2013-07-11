Template.mailbox.helpers({
    conversations: function(){
        return Conversations.find({owner: Meteor.userId()});
    },
    userInfo: function(){
        return this.with;
    }
});