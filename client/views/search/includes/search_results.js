Template.searchResults.helpers({
    searchResults: function(){

        if(!Session.get('searchQueryDone')){
            return [];
        }

        $("#searchresults").css('opacity', 1);
        var query = Session.get('searchQueryDone');
        console.log('gettin search results', query);
        var friends = Friends.find({},{reactive: false}).fetch();
        var excludes = [];
        // Remove my friends
        _.each(friends, function(f){
            excludes.push(f._id);
        });
        // Remove myself...
        excludes.push(Meteor.userId());
        query._id = { $nin: excludes };
        return Meteor.users.find(query, {reactive: false});
    },
    count: function(){
        if(!Session.get('searchQuery')){
            return [];
        }
        var query = Session.get('searchQuery');

        var friends = Friends.find({},{reactive: false}).fetch();
        var excludes = [];
        // Remove my friends
        _.each(friends, function(f){
            excludes.push(f._id);
        });
        // Remove myself...
        excludes.push(Meteor.userId());
        query._id = { $nin: excludes };
        return Meteor.users.find(query).count();
    }
});