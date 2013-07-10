Template.profile_pictures.helpers({
    pictures: function(){
        return Pictures.find({owner: Meteor.userId()}, {sort: {sortorder: -1}});
    },
    original: function(){
        if(this.fileHandler && this.fileHandler.save){
            return this.fileHandler.save.url;
        } else {
            return null;
        }
    },
    thumbnail50x50: function(){
        if(this.fileHandler && this.fileHandler.thumbnail50x50){
            return this.fileHandler.thumbnail50x50.url;
        } else {
            return null;
        }
    }
});