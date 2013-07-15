Template.profile_picture_edit.events({
    'change #filepicker': function(e){
        e.preventDefault();
        Meteor.call('uploadPhoto', e.fpfile, function(err, res){
            console.log(err, res);
        })
    }
});

Template.profile_picture_edit.helpers({
    'filepickerApiKey': function(){ return Meteor.filePickerKey;}
});
