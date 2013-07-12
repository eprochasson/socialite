Template.online_friends.helpers({
    friends: function(){
        var friends = Presences.find({});
        var ids = [];
        friends.forEach(function(f){
            ids.push(f.user);
        });

        return Meteor.users.find({_id: {$in: ids}}, {sort:{'profile.name': 1}});
    },
    count: function(){
        // Presence subscription only show online users...
        return Presences.find({}).count() + 1;
    }
});