
// pick default question value, or user input if available.
var getInputValue = function(self){
    if(Meteor.user().maintenance && Meteor.user().maintenance[self._id]){
        return Meteor.user().maintenance[self._id]
    } else {
        return self.value;
    }
};

Template.form_field_datepicker.rendered = function() {
    $('#'+this.data.domid).datepicker();
};
Template.form_field_dropdown.rendered = function(){
    //TODO
    console.log('rendering dropdown, ',this);
    $('#'+this.data.domid).val(getInputValue(this));
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
        console.log(this.options);
        var result = [];
        _.each(this.options, function(text, key){
            result.push({value: key, text: text});
        });
        return result;
    }
});