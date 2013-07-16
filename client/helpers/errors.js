Errors = {
    //Popup a modal window.
    modal: function(err){
        $('#modalWindow').html(Template.error_modal(err));
        $('#error_modal').modal().on('hidden', function(){
            this.remove();
        });
    },
    //Show a small popup on the side.
    notification: function(err, position){
        position = position || 'top-right';
        var html = err.html || false,
            text = err.text || false;
        if(!html && !text){
            return;
        }
        $('.'+position).notify({
            message: {
                html: html,
                text: text
            },
            type: 'bangTidy'
        }).show();
    }
};