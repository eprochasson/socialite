Template.conversation.helpers({
    messages: function(){
        var conversation = Conversations.findOne(Session.get('currentConversation'));
        if(!conversation){
            return [];
        }

        return Messages.find(
            {
                $or: [
                    {from: Meteor.userId(), to: conversation.with},
                    {to: Meteor.userId(), from: conversation.with}
                ]
            },
            {sort: {sent: -1}}
        );
    },
    messagesReady: function(){
        return !oneConversationHandle.loading();
    },
    allMessagesLoaded: function(){
        var conversation = Conversations.findOne(Session.get('currentConversation'));
        if(!conversation){
            return [];
        }
        return !oneConversationHandle.loading() &&
            Messages.find({
            $or: [
                {from: Meteor.userId(), to: conversation.with},
                {to: Meteor.userId(), from: conversation.with}
            ]
        }).count() < oneConversationHandle.loaded();
    },
    conversation: function(){
        return Conversations.findOne(Session.get('currentConversation'));
    }
});

Template.conversation.events({
    'click .read-more': function(e){
        e.preventDefault();
        oneConversationHandle.loadNextPage();
    }
})
Template.message.helpers({
    timestamp: function(){
        return moment(this.sent).fromNow();
    },
    sender: function(){
        return this.from == Meteor.userId()? __('messages.you') : Meteor.users.findOne(this.from)['profile'].name;
    },
    receiver: function(){
        return this.to == Meteor.userId()? __('messages.you') : Meteor.users.findOne(this.to)['profile'].name;
    }
});