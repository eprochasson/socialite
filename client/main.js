Meteor.subscribe('questions');
Meteor.subscribe('myData');

Deps.autorun(function () {
    userProfileHandle = Meteor.subscribe("userProfile", Session.get("currentUserProfile"));
});
