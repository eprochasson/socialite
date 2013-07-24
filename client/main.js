Meteor.startup(function(){

    Deps.autorun(function(){
        // All my data. Provide only to logged-in users.
        if(!Meteor.loggingIn() && Meteor.userId()){
            Meteor.subscribe('myData', function(){
                Session.set('settings', Meteor.user().settings||{});
                Session.set('profileComplete', Meteor.user().profile_complete||0);
            });
            Meteor.subscribe('myPictures');
            Meteor.subscribe('myNotifications');

            Meteor.subscribe('myFriendList');
            myNewsFeedHandle = Meteor.subscribeWithPagination('myNewsfeed', Newsfeed.activitiesPerPage);

            // My conversations
            conversationsHandle = Meteor.subscribeWithPagination('myConversations', 3);

            // Questions for the profile form.
            Meteor.subscribe('questions');
        }
    });

    Deps.autorun(function(){
        if(Session.get('currentConversation')){
            oneConversationHandle = Meteor.subscribeWithPagination('oneConversation', function(){
                return Session.get('currentConversation') || null;
            }, Messages.messagePerPage);
        }
    });

    // When visiting someone's profile
    Deps.autorun(function () {
        if(Session.get('currentUserProfile')){
            userProfileHandle = Meteor.subscribe("userProfile", Session.get("currentUserProfile"));
            userPictureHandle = Meteor.subscribe("oneUserPictures", Session.get("currentUserProfile"));
            userActivitiesHandle = Meteor.subscribeWithPagination("oneUserActivities", Session.get("currentUserProfile"), function(){
                return Session.get("currentUserProfile") || null;
            }, Activities.activitiesPerPage);
        }
    });

    Deps.autorun(function(){
        if(Session.get("searchQuery")){
            searchHandle = Meteor.subscribe("searchResults", Session.get("searchQuery"), Meteor.users.searchResultsLimit, function(){
                Session.set('searchQueryDone', Session.get('searchQuery'));
                console.log('updating publication searchResults');
            });
        }
    });

//    Meteor.subscribe('adminShowEveryone');
});
