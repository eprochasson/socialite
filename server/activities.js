
Activities.insertActivity = function(activity){
    var query = _.clone(activity);
    query.timestamp = {$gt: new Date().getTime()-Activities.delayForIgnore};

    var act;
    // If we have a very similar activity in the past XX ms, just update it
    if(act = Activities.findOne(query)){
        return Activities.update(act._id, {$set: {timestamp : new Date().getTime()}});
    } else {
        // otherwise, trigger a new activity.
        activity.timestamp = new Date().getTime();
        return Activities.insert(activity);
    }
};

