Meteor.Router.add({
    '/': {
        as: 'home',
        to: function(){
            if(Meteor.userId()){
                return 'home'
            } else{
                return 'front'
            }
        }
    },
    '/profile': {
        as: 'profile',
        to: 'profile',
        and: function(){ Session.set('currentUserProfile', null)}
    },
    '/profile/edit': 'editProfile',
    '/profile/:_id': {
        as: 'profile',
        to: 'profile',
        and: function(id){ Session.set('currentUserProfile', id);}
    },
    '/settings': 'settings',
    '/images/:_id': function(id){
        console.log(id);


        Pictures.retrieveBlob(id, function(fileItem) {
            console.log('file', fileItem);
            if (fileItem.blob) {
                return fileItem.blob;
//                saveAs(fileItem.blob, fileItem.filename);
            } else {
                return fileItem.file;
//                saveAs(fileItem.file, fileItem.filename);
            }
        });
    },
    '*': 'p404'
});

Meteor.Router.filters({
    'requireLogin': function(page) {
        if (Meteor.loggingIn()) {
            return 'loading';
        } else if (Meteor.user()) {
            return page;
        } else {
            return 'front';
        }
    }
});

Meteor.Router.filter('requireLogin', {except: 'front'});