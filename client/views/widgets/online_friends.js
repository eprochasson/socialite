Template.online_friends.helpers({
    friends: function(){
        var friends = Meteor.user().friends || [];
        return Meteor.users.find({'profile.online': 1, visible: 1, _id: {$in: friends}});
    },
    count: function(){
//        console.log(Meteor.user());
        var friends = Meteor.user().friends || [];
        return Meteor.users.find({'profile.online': 1, visible: 1, _id: {$in: friends}}).count();
    }
});