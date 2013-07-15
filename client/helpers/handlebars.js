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

Handlebars.registerHelper('thumbnail', function(url, w,h,fit){
    if(!url){ return ''; }
    var str = url+'/convert?';
    var options = {
        w: w || null,
        h: h || null,
        fit: _.isString(fit) ? fit :  'max'
    };

    var res = [];
    _.each(options, function(o,k){
        res.push(k+'='+o);
    });
    res = res.join('&');

    return str+res;
});