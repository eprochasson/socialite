Template.conversation.helpers({
    messages: function(){
        console.log('message');

        return Messages.find({}, {sort: {timestamp: -1}});
    }
});