Meteor.Router.add({
    '/': function(){
        if(Meteor.userId()){
            return 'home'
        } else{
            return 'front'
        }
    },
    '/profile': 'profile',
    '/profile/edit': 'editProfile',
    '/profile/:_id': {
        to: 'profile',
        and: function(id){ Session.set('currentUserProfile', id);}
    },
    '/settings': 'settings'
});

Meteor.Router.filters({
    'requireLogin': function(page) {
        if (Meteor.user())
            return page;
        else
            return false;
    }
});
Meteor.Router.filter('requireLogin', {except: 'front'});