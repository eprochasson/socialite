Template.newsfeed.helpers({
    news: function(){
        return Activities.find({},{sort: {timestamp: -1}});
    },
    newsfeedready: function(){
        return !myNewsFeedHandle.loading();
    },
    allNewsLoaded: function(){
        return !myNewsFeedHandle.loading() &&
        Activities.find({}).count() < myNewsFeedHandle.loaded();
    }
});

