#!/usr/bin/env node

/////////////////////////////////////////////////////////////////////////////
// Purpose:
//   Starts a Web server that offers the data scripts in the '../modules'
//   folder as REST API.
//
// Usage:
//   rest.js
//
// Files:
//   Expects the file 'cache.php' in the same directory. Uses the 'express'
//   module of Node.js. Includes all '.js' files in the '../modules' folder.
//
// Author:
//   Niels Lohmann <niels.lohmann@piraten-mv.de>
/////////////////////////////////////////////////////////////////////////////

// port for the server to listen
var port = 3333;

// whether results should be cached
var cache = true;

// the create an absolute path to the modules folder
var module_dir = require('path').normalize(__dirname + '/../modules');


/////////////////////////////////////////////////////////////////////////////

// the web server running the Express framework
var app = require('express').createServer();

// make the server invincible - never stop even in case of exceptions
process.on('uncaughtException', function (err) {
    console.error('Server experienced uncaught exception: ' + err);
});


/////////////////////////////////////////////////////////////////////////////

// helper function to remove certain values (deleteValue) from an arrqay
Array.prototype.clean = function(deleteValue) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == deleteValue) {         
            this.splice(i, 1);
            i--;
        }
    }
    return this;
};


/////////////////////////////////////////////////////////////////////////////


// execute a tool
function care(tool, options, req, res, page) {
    if (page == null) {
        page = false;
    }
    
    // set JSON as default format
    if (typeof options[0] === "undefined") {
        format = "json";
    } else {
        format = options[0];
    }

    // the file format should not be used as option any more (yet)
    options.shift();

    // prefix with modules directory
    tool = module_dir + '/' + tool;

    console.log('+ Client ' + req['client']['remoteAddress'] + ' connected.');

    var spawn = require('child_process').spawn;

    // call the tool by spawing a child
    options.clean(undefined);

    // depending on the cache, call tool directly or via 'cache.php'
    if (cache) {
        // cached call

        // move tool name and format to the parameters
        options.unshift(tool);
        options.unshift(format);

        var child = spawn(__dirname + "/cache.php", options);
        console.log('  + Tool "' + options.join(" ") + '" spawned (PID ' + child.pid + ').');
    } else {
        // uncached call
        var child = spawn(tool, options);
        console.log('  + Tool "' + tool + ' ' + options.join(" ") + '" spawned (PID ' + child.pid + ').');
    }

    // write a header if we don't server pages
    if (!page) {
        switch(format) {
            case 'json': res.writeHead(200, {'Content-Type': 'application/json'}); break;
            case 'xml':  res.writeHead(200, {'Content-Type': 'text/xml'}); break;
        }
    } else {
        res.writeHead(200, {'Content-Type': 'text/html'});
    }

    // redirect stdout to output
    child.stdout.on('data', function(data) {
        res.write(data);
    });

    // redirect stderr to console
    child.stderr.on('data', function(data) {
        console.error("[stderr] " + data);
    });

    // close connection once the tool terminates
    child.on('exit', function(code) {
        console.log('  - Tool "' + tool + '" terminated with exit code ' + code + '.');
        console.log('- Client ' + req['client']['remoteAddress'] + ' disconnected.');
        res.end();
    });
}


/////////////////////////////////////////////////////////////////////////////

var fs = require('fs');
fs.readdir(module_dir, function(err, files) {
    for (var i=0; i<files.length; i++) {
        if (files[i].indexOf(".js") != -1) {
            console.log("Included module '" + files[i] + "'.")
            eval(fs.readFileSync(module_dir + '/' + files[i]).toString());
        }
    }

    // finally start the server
    app.listen(port);
    console.log('Server running at port ' + port + '.');
});
