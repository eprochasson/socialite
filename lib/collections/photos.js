// An alternative for the picture collection using filepicker.
Photos = new Meteor.Collection('photos');

Photos.allow({
    insert: function(userId, fields){
        return false;
    },

    update: function(userId, file, fields, modifier) {
        var valid = true, authorized = Photos.authorizedFields || [];
        // Fields are authorized for modification
        if(authorized){
            valid = valid && _.every(fields, function(f){ return _.contains(authorized, f)});
        }
        // Check that user owns the image...
        valid = valid && file.owner === userId;

        return  valid;
    },
    remove: function(){ return false; }
});
