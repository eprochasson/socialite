Template.profile_picture_edit.events({
    'change input': function(e){
        e.preventDefault();
        var files = e.target.files;
        _.each(files, function(file){
            var res = Pictures.storeFile(file, {});
            if(res){
                return res
            } else {
                throw new Meteor.Error(500, 'Something went wrong');
            }
        });
    }
});