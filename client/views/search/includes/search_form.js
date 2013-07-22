Template.searchForm.rendered = function(){
    console.log('rendering searchForm');
    var age = $('#age');
    age.slider().on('slide', function(e){
        $('span#age_min').html(e.value[0]);
        $('span#age_max').html(e.value[1]);
    });
};

Template.searchForm.helpers({
    minAge: function(){
        var user = Meteor.users.findOne(Meteor.userId(), {reactive: false});
        if(!user || !user.profile){
            return 18;
        }
        var dob = user.profile.dob;
        if(!dob){
            return 18;
        }
        var age = getAgeDob(dob);
        return (age - 5) > 18 ? age - 5 : 18;
    },
    maxAge: function(){
        var user = Meteor.users.findOne(Meteor.userId(), {reactive: false});
        if(!user || !user.profile){
            return 99;
        }

        var dob = user.profile.dob;
        if(!dob){
            return 99;
        }
        var age = getAgeDob(dob);
        return age + 5;
    }
});

Template.searchForm.events({
    'submit form': function(e){
        e.preventDefault();
        // build query
        var query = {};
        var age = $('#age').val().split(',');
        var age_min = parseInt(age[0]), age_max = parseInt(age[1])+1;
        var gender = $('#gender').val();
        var name = $('#name').val();


        var dob_min = moment().subtract(age_max, 'years').unix(), dob_max= moment().subtract(age_min, 'years').unix();
        query['profile.dobtime'] = { $gt: dob_min, $lt : dob_max};
        if(gender){
            query['profile.gender'] = gender;
        }

        // Should trigger publication refresh.
        Session.set('searchQuery', query);
        console.log('updating query');
        $('#searchresults').css('opacity', 0.5);
    }
});