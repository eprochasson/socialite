Template.online_friends.helpers({
    onlinefriends: function(){
        return Friends.find({online: 1});
    },
    friends: function(){
        var friendlist = [];
        //this: onlinefriends Friends collection.
        this.forEach(function(f){
            friendlist.push(f.target);
        });
        return Meteor.users.find({_id: {$in: friendlist}}, {sort: {'profile.name': 1}});
    },
    count: function(){
        // Presence subscription only show online users...
        return Friends.find({online: 1}).count();
    }
});