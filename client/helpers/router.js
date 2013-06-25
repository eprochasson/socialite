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
    }
});