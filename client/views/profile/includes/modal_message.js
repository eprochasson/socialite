Template.modal_message.events({
    'click .send': function(e){

        e.preventDefault();
        var message = {};
        message.body = $('[name=message]').val();
        if(message.body.length == 0){
            Errors.notification("Message empty");
        } else {
            message.to = this._id;

            Meteor.call('sendMessage', message, function(err, res){
                if(err){
                    Errors.modal(err);
                } else {
                    $('#modalMessage textarea').val('');
                    $('#modalMessage').modal('hide');
                    Errors.notification('Message sent!')
                }
            });
        }
    }
});