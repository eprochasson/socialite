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
    age : function(){
        var user = getUser();
        if(user && user.profile && user.profile.dob){
            var age = moment(user.profile.dob, 'DD-MM-YYYY');
            var now = moment();
            return now.diff(age, 'years');
        } else {
            return 0;
        }
    },
    pictures: function(){
        return Photos.find({}, {sort: { sortorder: -1 }});
    }
});