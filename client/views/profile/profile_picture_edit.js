Template.profile_picture_edit.events({
    'change input': function(e){
        e.preventDefault();
        _.each(e.srcElement.files, function(file){
            Meteor.uploadPicture(file, file.name, function(err, res){
                if(err){
                    console.log(err);
                } else {
                    console.log('weeeeeeeeee', res);
                }
            });
        })
    }
});