Pictures = new CollectionFS('pictures', {autopublish: false});

Pictures.allow({
    insert: function(userId, myFile) {
        return Pictures.find({owner: userId}).count() < 8 && userId && myFile.owner === userId;
    },
    update: function(userId, files, fields, modifier) {
        return _.all(files, function (myFile) {
            return (userId == myFile.owner);
        });  //EO iterate through files
    },
    remove: function(userId, files) { return false; }
});

var isImage = function(type){
    return type == 'image/jpeg';
};

Pictures.fileHandlers({
    save: function(options){
        console.log('Running fileHandler save');
        if (options.fileRecord.length > 5000000 || !isImage(options.fileRecord.contentType)){
            return null;
        }
        return { blob: options.blob, fileRecord: options.fileRecord };
    },
    thumbnail50x50: function(options){
        console.log('running thumbnail 50x50');
        if (isImage(options.fileRecord.contentType)){
            console.log('resizing');
            var res = Imagemagick.resize({
                srcData: options.blob,
                width: 50,
                height: 50,
                quality: 0.8,
                format: 'jpg'
            });

            return { blob: res, fileRecord: options.fileRecord };
        } else {
            return null;
        }
    }
});