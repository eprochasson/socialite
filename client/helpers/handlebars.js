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
    if(!url){
        url = "https://www.filepicker.io/api/file/A3WeRoNIR8aAg93xbyFe/"
    }
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

Handlebars.registerHelper('age', function(date, hash){
    if(typeof date === 'function'){
        return 0;
    }

    return getAge(date);
});

Handlebars.registerHelper('profileComplete', function(){
    var res = Session.get('profileComplete');
    if(!(res === undefined)){
        return res;
    }
});

Handlebars.registerHelper('makeQuestion', function(name){
    if(!typeof name === 'string'){
        return '';
    }

    var question = Questions.findOne({name: name});
    if(!question){
        return '';
    }

    var tpl = question.tpl || 'form_field_text';
    if(!Template[tpl]){
        return '';
    }
    return Template[tpl](question);
});

Handlebars.registerHelper('gender', function(gender){
    if(gender === 'F'){
        return __('question.female');
    }
    if(gender === 'M'){
        return __('question.male');
    }
    return __('question.unknow');
});

Handlebars.registerHelper('ellipsis', function(text, len, hash){
    if(typeof text === 'function'){
        return '';
    }
    if(typeof len ===' function'){
        len = 20;
    } else{
        len = len || 20;
    }
    if(text.length < len){
        return text;
    } else {
        return text.slice(0, len)+'...';
    }

});