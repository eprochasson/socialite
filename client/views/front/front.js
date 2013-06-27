Template.front.helpers({
    showregister: function(){
        return Session.get('showregister');
    }
});

Template.front.events({
    'click #create-account': function(){
        Session.set('showregister', true);
    }
});