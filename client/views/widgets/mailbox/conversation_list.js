Template.conversation_list.helpers({
    conversations: function(){
        return Conversations.find({owner: Meteor.userId()},{limit: conversationsHandle.limit()});
    },
    conversationReady: function(){
        return ! conversationsHandle.loading();
    },
    allConversationsLoaded: function(){
        return !conversationsHandle.loading() &&
            Conversations.find({owner: Meteor.userId()}).count() < conversationsHandle.loaded()
    }
});

Template.conversation_list.events({
    'click .load-more': function(e){
        e.preventDefault();
        conversationsHandle.loadNextPage();
    }
});

Template.one_conversation.helpers({
    userInfo: function(){
        return Meteor.users.findOne(this.with);
    },
    isMyFriend: function(){
        return _.contains(Meteor.user().friends, this.with);
    },
    when: function(){
        return moment(this.timestamp).fromNow();
    },
    active: function(){
        if(Session.get('currentConversation') && this._id === Session.get('currentConversation')){
            return 'active';
        } else {
            return '';
        }
    }
});