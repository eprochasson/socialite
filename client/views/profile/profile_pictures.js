Template.profile_pictures.helpers({
    pictures: function(){
        var user = Session.get('currentUserProfile') || Meteor.userId();
        return Photos.find({owner: user}, {sort: {main: -1, sortorder: -1}});
    }
});

Template.profile_pictures.events({
    'click .setAsProfilePicture': function(e){
        e.preventDefault();
        // Remove that property on other pictures.
        var pictures = Photos.find({owner: Meteor.userId()});
        pictures.forEach(function(pic){
            Photos.update(pic._id, {$set: {main: 0}});
        });

        var photo;
        if(!(photo = Photos.findOne(this._id))){
            // something wrong.
            return false;
        }

        // Set it on the chosen one
        Photos.update(this._id, {$set: {main:1}});

        Meteor.call('denormalizeProfilePicture', photo.url, function(err, res){
            if(err){
                throw err;
            }
        })
    }
});

Template.profile_pictures.events({
    'click .showImage': function(e){
        e.preventDefault();
        $('#previewImage').attr('src', this.url+'/convert?w=640&h=480&fit=max');
    }
});