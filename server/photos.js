Meteor.methods({
    uploadPhoto: function(options){
        var user = this.userId;
        if(!user){
            throw new Meteor.Error(300, 'Forbidden');
        }

        // Store the image.
        var photoId = Photos.insert({
            url: options.url,
            s3: options.key, // S3 url.
            timestamp: new Date().getTime(),
            filename: options.filename,
            size: options.size,
            type: options.mimetype,
            owner: user
        });

        Activities.insertActivity({
            from: Meteor.userId(),
            to: null,
            on: {
                objtype: 'picture',
                ref: photoId
            },
            type: 'picture'
        });

        return photoId;
    }
});