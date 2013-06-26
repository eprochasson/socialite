Template.profile.helpers({
    currentUser: function(){
        if(Session.get('currentUserProfile')){
            return Meteor.users.findOne(Session.get('currentUserProfile'));
        } else {
            return Meteor.user();
        }
    },
    lexicon: function(k, options){
        console.log(k, options);
        return __(k, options.hash);
    }
});
