Meteor.publish('questions', function(){
    return Questions.find();
});

Meteor.publish("myData", function () {
    return Meteor.users.find({_id: this.userId},
        {fields: {'profile': 1, 'maintenance': 1}});
});