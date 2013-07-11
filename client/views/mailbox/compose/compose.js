Template.compose.helpers({
    friendsList: function(){
        var me = Meteor.users.findOne(Meteor.userId());
        return Meteor.users.find({_id : {$in : me.friends}}, {reactive: false});
    }
});

Template.compose.events({
    'submit form': function(e){
        e.preventDefault();
        var values = {
            to: $('select[name="to"]').val(),
            body: $('textarea[name="body"]').val()
        };
        if(values.to && values.body){
            Meteor.call('sendMessage', values, function(err, res){
                console.log(err, res);
            })
        }
    }
});