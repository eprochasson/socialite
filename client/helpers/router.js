// Is there a better way to do that?
var resetSession = function(){
    Session.set('currentConversation', null);
    Session.set('currentUserProfile', null);
    Session.set('currentQuery', null);
    Session.set('searchQueryDone', null);
};

Meteor.Router.add({
    '/': {
        as: 'home',
        to: function(){
            if(Meteor.userId()){
                return 'home'
            } else{
                return 'front'
            }
        },
        and: resetSession
    },
    '/mailbox': {
        as:'mailbox',
        to: function(){
            return 'mailbox';
        },
        and: resetSession
    },
    '/mailbox/:_id':{
        as: 'conversation',
        to: 'conversation',
        and: function(id){
            resetSession();
            Session.set('currentConversation', id);
        }
    },
    '/settings': {
        as:'settings',
        to: 'setting',
        and: resetSession
    },
    '/profile': {
        as: 'profile',
        to: 'profile',
        and: function(){
            resetSession();
            Session.set('currentUserProfile', null)
        }
    },
    '/profile/edit': 'editProfile',
    '/profile/:_id': {
        as: 'profile',
        to: 'profile',
        and: function(id){
            resetSession();
            Session.set('currentUserProfile', id);
        }
    },
    '/profile_done': {
        as: 'profile_done',
        to: 'profile_done',
        and: resetSession
    },
    '/search': {
        to: 'search',
        as: 'search',
        and: resetSession
    },
    '*': 'p404'
});

Meteor.Router.filters({
    'requireLogin': function(page) {
        if (Meteor.loggingIn()) {
            return 'loading';
        } else if (Meteor.userId()){
            if(!Session.get('profileComplete')){
                if(Session.get('profileComplete') === undefined){
                    return page;
                } else {
                    return 'profile_creation';
                }
            } else {
                return page;
            }
        } else {
            return 'front';
        }
    }
});


Meteor.Router.filter('requireLogin', {except: 'front'});

