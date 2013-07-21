var getUser = function(){
    if(Session.get('currentUserProfile')){
        return Meteor.users.findOne(Session.get('currentUserProfile'));
    } else{
        return Meteor.user();
    }
};

Template.profile.helpers({
    currentUser: function(){
        return getUser();
    },
    question: function(question){
        var user = getUser();
        if(user && user.profile && user.profile[question]){
            return user.profile[question];
        } else {
            return '';
        }
    },
    pictures: function(){
        return Photos.find({}, {sort: { sortorder: -1 }});
    },
    selfUser: function(){
        return(!Session.get('currentUserProfile') || Session.get('currentUserProfile') === Meteor.userId());
    }
});