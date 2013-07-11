Meteor.subscribe('questions');
Meteor.subscribe('myData', function(){
    Session.set('settings', Meteor.user().settings||{});
});
Meteor.subscribe('myPictures');

Meteor.subscribe('myOnlineFriends');

Deps.autorun(function () {
    userProfileHandle = Meteor.subscribe("oneUserProfile", Session.get("currentUserProfile"));
    userPictureHandle = Meteor.subscribe("oneUserPictures", Session.get("currentUserProfile"));
});

