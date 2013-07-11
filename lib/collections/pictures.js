Pictures = new CollectionFS('pictures', {autopublish: false});

var isValidImage = function(type){
    return _.contains(['image/png','image/jpeg','image/gif'], type);
};

Pictures.allow({
    insert: function(userId, myFile) {
        var valid = true;
        // Is a valid image
        valid = valid && isValidImage(myFile.contentType);
        // Is not too big.
        valid = valid && myFile.length < (this.maxFileSize || 1024*1024);
        // User quota is ok.
        valid = valid && (!this.maxFilePerUser || (this.maxFilePerUser == -1) || Pictures.find({owner: userId}).count() < this.maxFilePerUser);
        // User owns the file -- don't know how it could not, but that's in the doc.
        valid = valid && userId && myFile.owner === userId;
        return valid;
    },
    update: function(userId, file, fields, modifier) {
        var valid = true, authorized = this.authorizedFields || [];
        // Fields are authorized for modification
        if(authorized){
            valid = valid && _.every(fields, function(f){_.contains(authorized, f)});
        }
        // Check that user owns the image...
        valid = valid && file.owner === userId;

        return  valid;
    },
    remove: function(userId, files) { return false; }
});

Pictures.fileHandlers({
    save: function(options){
        if (options.fileRecord.length > 5000000 || !isValidImage(options.fileRecord.contentType)){
            return null;
        }
        return { blob: options.blob, fileRecord: options.fileRecord };
    },
    thumbnail50x50: function(options){
        if (isValidImage(options.fileRecord.contentType)){
            var destination = options.destination();
            Imagemagick.resize({
                srcData: options.blob,
                dstPath: destination.serverFilename,
                width: 50,
                height: 50
            });
            return destination.fileData;
        } else {
            return null;
        }
    },
    thumbnail150x150: function(options){
    if (isValidImage(options.fileRecord.contentType)){
        var destination = options.destination();
        Imagemagick.resize({
            srcData: options.blob,
            dstPath: destination.serverFilename,
            width: 150,
            height: 150
        });
        return destination.fileData;
    } else {
        return null;
    }
}
});