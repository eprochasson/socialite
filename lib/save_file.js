/**
 * @blob (https://developer.mozilla.org/en-US/docs/DOM/Blob)
 * @name the file's name
 * @type the file's type: binary, text (https://developer.mozilla.org/en-US/docs/DOM/FileReader#Methods)
 *
 * TODO Support other encodings: https://developer.mozilla.org/en-US/docs/DOM/FileReader#Methods
 * ArrayBuffer / DataURL (base64)
 */
Meteor.uploadPicture = function(blob, name, callback) {
    var fileReader = new FileReader(),
        method = 'readAsBinaryString', encoding = 'binary';

    fileReader.onload = function(file) {
        Meteor.call('uploadPicture', file.srcElement.result, name, '', encoding, callback);
    };
    fileReader[method](blob);
};