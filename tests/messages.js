var assert = require('assert');

suite('Messages', function(){
    test('in the server', function(done, server){
        server.eval(function(){
            Messages.insert({to:"random", body: "Hello World!"});
            var message = Messages.find().fetch();
            emit('messages', message);
        })
    });
    server.once('messages', function(message){
        assert.equal(message.length, 1);
    })
});