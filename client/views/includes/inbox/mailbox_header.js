Template.mailbox_header.helpers({
    messages: function(){
        return Conversations.find({owner: Meteor.userId()},{limit: 5, sort: {viewed: 1, timestamp: -1}});
    },
    messagesCount: function(){
        var count = Conversations.find({owner: Meteor.userId(), viewed: 0}).count();
        if(count >= 10){
            count = '10+';
        }
        return count;
    }
});

Template.message_li.helpers({
    participant: function(){
        return Meteor.users.findOne(this.with);
    },
    sent: function(){
        return moment(this.timestamp).fromNow();
    }
});