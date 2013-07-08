

Meteor.methods({
    'update_profile': function(values){
        var valid = true;
        var cleaned = {}; // store name -> value
        _.each(values, function(val, docid){
            if(docid){
                // Validate the response
                var question = Questions.findOne(docid);
                if(!question){
                    valid = false;
                } else {
                    var validations = question.validation;
                    _.each(validations, function(validation, method){
                        if(typeof validationProcedures[method] == 'function'){
                            if(!(validationProcedures[method])(validation, val)){
                                valid = false;
                            } else {
                                // All good, let's input
                                cleaned[question.name] = val;
                            }
                        } else {
                            valid = false;
                        }
                    });
                }
            } else {
                valid = false;
            }
            if(!valid){
                throw new Meteor.Error(300, 'errors.not_saved');
            } else {

                // Account only visible if at least those two information are made available.
                var visible = 0;
                if(cleaned.name && cleaned.gender){
                    visible = 1;
                }

                return Meteor.users.update(Meteor.userId(), {
                    $set: {
                        profile : cleaned,
                        visible: visible
                    }
                });
            }
        })
    },
    uploadPicture: function(blob, name, path, encoding) {

        function cleanPath(str) {
            if (str) {
                return str.replace(/\.\./g,'').replace(/\/+/g,'').
                    replace(/^\/+/,'').replace(/\/+$/,'');
            } else {
                return '';
            }
        }
        function cleanName(str) {
            return str.replace(/\.\./g,'').replace(/\//g,'');
        }
        var path = cleanPath(path), fs = Npm.require('fs'),
            name = cleanName(name || 'file'), encoding = encoding || 'binary',
            chroot = Meteor.chroot || 'images';

        var name = Meteor.FileUpload.getName(blob,name);

        path = chroot + (path ? '/' + path + '/' : '/');

        // TODO Add file existance checks, etc...
        try{
            fs.writeFileSync(path + name, blob, encoding);
        } catch (e){
            throw (new Meteor.Error(500, 'Failed to save file.', e));
        }

        return path+name;
    }
});

