Meteor.publish('questions', function(){
    return Questions.find();
});

Meteor.publish("myData", function () {
    return Meteor.users.find({_id: this.userId},
        {fields: {'profile': 1}});
});

Meteor.publish("userProfile", function(userId){
    // Check that this user can see each others.
    var source = Meteor.users.findOne(this.userId);
    var target = Meteor.users.findOne({_id: userId, 'visible': 1});
    if(!target){
        return false;
    }
    var fields = {};

    if(target && target.blacklist && _.contains(target.blacklist ,source._id)){ // You're blocked
        fields = {
            'profile.name': 1,
            'profile.gender': 1
        };
    } else if(target.friends && _.contains(target.friends, source._id)){ // You're friends
        // show all profile.
        if(target.friends && _.contains(target.friends, source._id)){
            fields = {
                'profile': 1
            }
        }
    } else {
        fields = {
            'profile.name': 1,
            'profile.gender': 1
        };
    }
    return Meteor.users.find({_id: userId}, {fields: fields});
});