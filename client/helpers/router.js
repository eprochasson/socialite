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
    '/profile': 'profile',
    '/profile/edit': 'editProfile',
    '/profile/:_id': {
        as: 'profile',
        to: 'profile',
        and: function(id){ Session.set('currentUserProfile', id);}
    },
    '/settings': 'settings'
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