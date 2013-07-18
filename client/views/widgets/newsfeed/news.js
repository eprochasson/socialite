Template.news.helpers({
    tpl: function(){
        switch(this.type){
            case 'accepted_friend_request':
                return 'news_now_friend';
                break;
            case 'update_profile':
                return 'news_update_profile';
                break;
            case 'update_profile_picture':
                return 'news_update_profile_picture';
                break;
            default:
                return '';
        }
    },
    options: function(){
        var from, to, sent, options;
        switch(this.type){
            case 'accepted_friend_request':
                from = Meteor.users.findOne(this.from);
                to = Meteor.users.findOne(this.to);
                if(!from || !to){
                    return {isValid: 0}; // Do not render that.
                }

                return {
                    from: from,
                    to: to,
                    when: moment(this.timestamp).fromNow(),
                    isValid: 1
                };

                break;
            case 'update_profile':
                from = Meteor.users.findOne(this.from);
                if(!from){
                    return { isValid: 0}
                }

                return {
                    from: from,
                    when: moment(this.timestamp).fromNow(),
                    isValid: 1
                };

                break;
            case 'update_profile_picture':
                from = Meteor.users.findOne(this.from);
                if(!from){
                    return { isValid: 0}
                }

                return {
                    from: from,
                    when: moment(this.timestamp).fromNow(),
                    isValid: 1
                };
                break;
            default:
                return '';
        }
    }
});