Errors = {
    //Popup a modal window.
    modal: function(err){
        $('#modalWindow').html(Template.error_modal(this.getErrorMessage(err)));
        $('#error_modal').modal().on('hidden', function(){
            this.remove();
        });
    },
    //Show a small popup on the side.
    notification: function(err, position){
        position = position || 'top-right';
        var html, text;

        if(typeof err === 'string'){
            text = err;
        } else {
            html = err.html || false;
            text = err.text || false;
        }
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
    },
    getErrorMessage: function(err){
        var error;
        switch(err.reason){
            case 'User Not Found':
                error = {
                    title: __('error.user_not_found_title'),
                    body: __('error.user_not_found')
                };
                break;
            case 'Permission Denied':
                error = {
                    title: __('error.permission_denied_title'),
                    body: __('error.permission_denied')
                };
                break;
            case 'Posting Too Fast':
                error = {
                    title: __('error.posting_too_fast_title'),
                    body: __('error.posting_too_fast', {penalty: error.details})
                };
                break;
            case 'Internal Error':
                error = {
                    title: __('error.internal_error_title'),
                    body: __('error.internal_error')
                };
                break;
            case 'Invalid Data':
                error = {
                    title: __('error.invalid_data_title'),
                    body: __('error.invalid_data')
                };
                break;
            default:
                break;
        }

        return error;
    }
};