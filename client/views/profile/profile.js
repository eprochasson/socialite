Template.profile.helpers({
    currentUser: function(){
        if(Session.get('currentUserProfile')){
            return Meteor.users.findOne(Session.get('currentUserProfile'));
        } else {
            return Meteor.user();
        }
    }
});
