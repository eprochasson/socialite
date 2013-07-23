var getUser = function(){
    if(Session.get('currentUserProfile')){
        return Meteor.users.findOne(Session.get('currentUserProfile'));
    } else{
        return Meteor.user();
    }
};

var isMe = function(){
    return !Session.get('currentUserProfile') || Session.get('currentUserProfile') === Meteor.userId();
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
    },
    userOnline: function(){
        var user = getUser();
        var online = Presences.findOne({user: user._id});
        if(!online){
            return 0;
        }
        if(online.online){
            return 1;
        }
        return 0;
    },
    isFriend: function(){
        if(isMe()){
            return false;
        }
        return Friends.findOne({me : Meteor.userId(), target: Session.get('currentUserProfile'), reciprocal: 1});
    },
    isFriendPending: function(){
        if(isMe()){
            return false;
        }
        return Friends.findOne({me : Meteor.userId(), target: Session.get('currentUserProfile'), reciprocal: 0});
    },
    notMe: function(){
        return !isMe()
    }
});

Template.profile.events({
    'click .addAsFriend':function(e){
        e.preventDefault();
        var target = Session.get('currentUserProfile');
        if(!target){
            return false;
        }
        Meteor.call('addAsFriend', target, function(err, res){
            if(err){
                Errors.modal(err);
            } else {
                Errors.notification('Friend request sent', 'center');
            }
        });
    },
    'click .send_message': function(){

    }
});