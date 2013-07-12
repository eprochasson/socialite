Template.conversation.helpers({
    messages: function(){
//
        var conversation = Conversations.findOne(Session.get('currentConversation'));
        if(!conversation){
            return;
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
    }
});
Template.message.helpers({
    timestamp: function(){
        return moment(this.sent).fromNow();
    },
    sender: function(){
        console.log(this);
        return this.from == Meteor.userId()? __('messages.you') : Meteor.users.findOne(this.from)['profile'].name;
    },
    receiver: function(){
        return this.to == Meteor.userId()? __('messages.you') : Meteor.users.findOne(this.to)['profile'].name;
    }
});