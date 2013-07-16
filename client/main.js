Meteor.startup(function(){
    // All my data
    Meteor.subscribe('myData', function(){
        Session.set('settings', Meteor.user().settings||{});
    });
    Meteor.subscribe('myPictures');
    Meteor.subscribe('myNotifications');

        Meteor.subscribe('myFriendList');

    myNewsFeedHandle = Meteor.subscribeWithPagination('myNewsfeed', Newsfeed.activitiesPerPage);

    // My conversations
    conversationsHandle = Meteor.subscribeWithPagination('myConversations', 3);

    oneConversationHandle = Meteor.subscribeWithPagination('oneConversation', function(){
        return Session.get('currentConversation') || null;
    }, Messages.messagePerPage);

    // When visiting someone's profile
    Deps.autorun(function () {
        userProfileHandle = Meteor.subscribe("oneUserProfile", Session.get("currentUserProfile"));
        userPictureHandle = Meteor.subscribe("oneUserPictures", Session.get("currentUserProfile"));
        userActivitiesHandle = Meteor.subscribeWithPagination("oneUserActivities", function(){
            return Session.get("currentUserProfile") || null;
        }, Activities.activitiesPerPage);
    });

    // Questions for the profile form.
    Meteor.subscribe('questions');

//    Meteor.subscribe('adminShowEveryone');
});