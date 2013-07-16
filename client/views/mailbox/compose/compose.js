Template.compose.helpers({
    friendsList: function(){
        if(Meteor.user()){
            return Meteor.users.find({ _id: {$ne : Meteor.userId()}}, {reactive: false});
        } else {
            return {};
        }
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
                if(err){
                    Errors.modal(err);
                } else {
                    Errors.notification({text: __('message.message_sent')});
                }
            })
        }
    }
});