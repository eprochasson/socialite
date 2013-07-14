// pick default question value, or user input if available.
var getInputValue = function(self){
    // trick to avoid blinking when updating the user profile. (instead of calling Meteor.user())
    var user = Meteor.users.findOne(Meteor.userId, {reactive: false});
    if(user.profile && user.profile[self.name]){
        return user.profile[self.name]
    } else {
        return self.value;
    }
};
Template.form_field_datepicker.rendered = function() {
    $('#'+this.data.domid).datepicker();
};
Template.form_field_dropdown.rendered = function(){
    $('#'+this.data.domid).val(getInputValue(this.data));
};
Template.form_field_datepicker.helpers({
    'value' : function(){ return getInputValue(this); }
});
Template.form_field_text.helpers({
    'value' : function(){ return getInputValue(this); }
});
Template.form_field_dropdown.helpers({
    'value' : function(){ return getInputValue(this); },
    'options': function(){
        var result = [];
        _.each(this.options, function(text, key){
            result.push({value: key, text: text});
        });
        return result;
    }
});