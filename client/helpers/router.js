Meteor.Router.add({
    '/': function(){
        if(Meteor.userId()){
            return 'home'
        } else{
            return 'front'
        }
    }
});