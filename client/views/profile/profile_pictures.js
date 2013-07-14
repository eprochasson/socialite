Template.profile_pictures.helpers({
    pictures: function(){
        var user = Session.get('currentUserProfile') || Meteor.userId();
        return Pictures.find({owner: user}, {sort: {main: -1, sortorder: -1}});
    },
    original: function(){
        if(this.fileHandler && this.fileHandler.save){
            return this.fileHandler.save.url;
        } else {
            return null;
        }
    },
    thumbnail50x50: function(){
        if(this.fileHandler && this.fileHandler.thumbnail50x50){
            return this.fileHandler.thumbnail50x50.url;
        } else {
            return null;
        }
    },thumbnail150x150: function(){
        if(this.fileHandler && this.fileHandler.thumbnail150x150){
            return this.fileHandler.thumbnail150x150.url;
        } else {
            return null;
        }
    }
});

Template.profile_pictures.events({
    'click .setAsProfilePicture': function(e){
        e.preventDefault();
        // Remove that property on other pictures.
        var pictures = Pictures.find({owner: Meteor.userId()});
        pictures.forEach(function(pic){
            Pictures.update(pic._id, {$set: {main: 0}});
        });

        // Set it on the chosen one
        Pictures.update(this._id, {$set: {main:1}});

        var urls = {};
        var files = Pictures.findOne(this._id).fileHandler;
        _.each(files, function(f,n){
            urls[n] = f.url;
        });

        Meteor.call('denormalizeProfilePicture', urls, function(err, res){
            if(err){
                throw err;
            }
        })

    }
});

Template.profile_pictures.events({
    'click .showImage': function(e){
        e.preventDefault();
        $('#previewImage').attr('src', this.fileHandler.save.url);
    }
});