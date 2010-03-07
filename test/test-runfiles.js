var assert = require('assert'),
    sys = require('sys'),
    nodeunit = require('nodeunit');


process.chdir(__dirname);
require.paths.push(__dirname);
var mock_module1 = require('./fixtures/mock_module1');
var mock_module2 = require('./fixtures/mock_module2');
var mock_module3 = require('./fixtures/dir/mock_module3');
var mock_module4 = require('./fixtures/dir/mock_module4');



// copy runModule
var runModule_copy = nodeunit.runModule;

var call_order = [];
var runModule_calls = [];
var opts = {
    moduleStart: function(){
        call_order.push('moduleStart');
    },
    done: function(failures, total){
        call_order.push('done');
        assert.equal(failures, 0, 'failures');
        assert.equal(total, 4, 'total');
    }
};

nodeunit.runModule = function(mod, options){
    call_order.push('runModule');
    runModule_calls.push(mod);
    options.moduleDone(0,1);
};

nodeunit.runFiles(
    ['fixtures/mock_module1.js','fixtures/mock_module2.js','fixtures/dir'],
    opts
);


setTimeout(function(){

    assert.deepEqual(call_order, [
        'moduleStart', 'runModule', 'moduleStart', 'runModule', 'moduleStart',
        'runModule', 'moduleStart', 'runModule', 'done'
    ], 'call_order');

    var called_with = function(name){
        return runModule_calls.some(function(m){
            return m.name == name;
        });
    };
    assert.ok(called_with('mock_module1'), 'mock_module1 ran');
    assert.ok(called_with('mock_module2'), 'mock_module2 ran');
    assert.ok(called_with('mock_module3'), 'mock_module3 ran');
    assert.ok(called_with('mock_module4'), 'mock_module4 ran');
    assert.equal(runModule_calls.length, 4);

    // restore runModule function
    nodeunit.runModule = runModule_copy;

    sys.puts('test-runfiles OK');

}, 100);