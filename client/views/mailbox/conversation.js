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
    },
    conversationWith: function(){
        var conversation = Conversations.findOne(Session.get('currentConversation'));
        if(!conversation){
            return '';
        }
        var user = Meteor.users.findOne(conversation.with);
        return user.profile && user.profile.name;
    }
});

Template.conversation.events({
    'click .read-more': function(e){
        e.preventDefault();
        oneConversationHandle.loadNextPage();
    },
    'click .send': function(e){
        e.preventDefault();
        var conversation = Conversations.findOne(Session.get('currentConversation'));
        if(!conversation){
            Errors.modal('Internal Error');
        }
        var message = {};
        message.body = $('[name=message]').val();
        if(message.body.length == 0){
            Errors.notification('The message is empty');
        } else {
            message.to = conversation.with;
            Meteor.call('sendMessage', message, function(err,res){
                if(err){
                    Errors.modal(err);
                } else {
                    Errors.notification('Message sent');
                    $('.conversation textarea').val('');
                }
            })
        }
    },
    'change [name=message]': function(e){
        if($('[name=message]').val()){
            $('button.send').removeClass('disabled');
        }
    }
});
Template.message.helpers({
    timestamp: function(){
        return moment(this.sent).fromNow();
    },
    sender: function(){
        return this.from == Meteor.userId()? __('messages.me') : Meteor.users.findOne(this.from)['profile'].name;
    },
    receiver: function(){
        return this.to == Meteor.userId()? __('messages.me') : Meteor.users.findOne(this.to)['profile'].name;
    },
    class: function(){
        if(this.to == Meteor.userId()){
            return 'incoming';
        }
        return 'outgoing';
    }
});

Template.conversation.rendered = function(){
    // Mark conversation as read.
    Conversations.update(Session.get('currentConversation'), {$set: {viewed: 1}});
};

