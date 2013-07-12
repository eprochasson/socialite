Template.mailbox.helpers({
    conversations: function(){
        return Conversations.find({owner: Meteor.userId()},{limit: conversationsHandle.limit()});
    },
    conversationReady: function(){
        return ! conversationsHandle.loading();
    },
    allConversationsLoaded: function(){
        return !conversationsHandle.loading() &&
            Conversations.find({owner: Meteor.userId()}).count() < conversationsHandle.loaded()
    },
    userInfo: function(){
        return Meteor.users.findOne(this.with);
    },
    isMyFriend: function(){
        return _.contains(Meteor.user().friends, this.with);
    }
});

Template.mailbox.events({
    'click .load-more': function(e){
        e.preventDefault();
        conversationsHandle.loadNextPage();
    }
});