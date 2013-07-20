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
    '/mailbox/compose': 'compose',
    '/mailbox': 'mailbox',
    '/mailbox/:_id':{
        as: 'conversation',
        to: 'conversation',
        and: function(id){
            Session.set('currentConversation', id);
        }
    },
    '/settings': 'settings',
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
    'profile_done': 'profile_done',
    '/search': 'search',
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
                console.log('profile complete true');
                return page;
            }
        } else {
            return 'front';
        }
    }
});

Meteor.Router.filter('requireLogin', {except: 'front'});