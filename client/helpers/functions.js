getAgeDob = function(date){

    var age = moment(date, 'DD-MM-YYYY');
    var now = moment();
    return now.diff(age, 'years');
};
getAge = function(date){
    var age = moment.unix(date);
    var now = moment();
    return now.diff(age, 'years');
};
