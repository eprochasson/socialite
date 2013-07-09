Meteor.subscribe('questions');
Meteor.subscribe('myData');
Meteor.subscribe('myPictures');

//Deps.autorun(function () {
//    userProfileHandle = Meteor.subscribe("userProfile", Session.get("currentUserProfile"));
//});
Deps.autorun(function () {
    userProfileHandle = Meteor.subscribe("oneUserProfile", Session.get("currentUserProfile"));
    userPictureHandle = Meteor.subscribe("oneUserPictures", Session.get("currentUserProfile"));
});
