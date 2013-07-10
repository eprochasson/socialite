Pictures = new CollectionFS('pictures', {autopublish: false});

var isValidImage = function(type){
    return _.contains(['image/png','image/jpeg','image/gif'], type);
};

Pictures.allow({
    insert: function(userId, myFile) {
        return isValidImage(myFile.contentType) && myFile.length < 1024*1024 && Pictures.find({owner: userId}).count() < 8 && userId && myFile.owner === userId;
    },
    update: function(userId, file, fields, modifier) {
        return fields == 'main' && file.owner === userId; // Only allow user to change the 'main' field (which indicate the profile picture).
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