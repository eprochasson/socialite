Template.friends.helpers({
    friends: function(){
        var id = Meteor.userId();
        if(Session.get('currentUserProfile')){
            id = Session.get('currentUserProfile');
        }
        if(!id){
            return [];
        }
        return Friends.find({me: id, reciprocal: 1});
    }
});

Template.one_friend.helpers({

    user: function(){
        return Meteor.users.findOne(this.target);
    }
});