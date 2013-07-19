Template.profile_popover.rendered = function(){
    var tpl = Template.short_profile(this.data);
    $(this.find(".profile_popover")).popover({content: tpl});
};
