// All my data
Meteor.subscribe('myData', function(){
    Session.set('settings', Meteor.user().settings||{});
});
// My own picture.
Meteor.subscribe('myPictures');

// Online friends widget.
Meteor.subscribe('myOnlineFriends');

// The list of my friends.
Meteor.subscribe('myFriends');

// My conversations
Meteor.subscribe('myConversations');


// When visiting someone's profile
Deps.autorun(function () {
    userProfileHandle = Meteor.subscribe("oneUserProfile", Session.get("currentUserProfile"));
    userPictureHandle = Meteor.subscribe("oneUserPictures", Session.get("currentUserProfile"));
});

// Questions for the profile form.
Meteor.subscribe('questions');
