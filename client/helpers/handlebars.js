Handlebars.registerHelper('callPartial', function(partial, options, def){
    var p = Template[partial] ? partial : def;
    return Template[p](options);
});

Handlebars.registerHelper('docid', function(){
    return this._id ;
});

Handlebars.registerHelper('validation', function(){
    return this.validation && JSON.stringify(this.validation);
});

// Helper to call lexicon from anywhere.
Handlebars.registerHelper('Lex', function(k, options){
    return __(k, options.hash);
});