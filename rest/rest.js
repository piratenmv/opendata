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
//   Uses the modules 'connect', 'connect-cache', 'data2xml' and 'express'.
//   Includes all '.js' files in the '../modules' folder.
//
// Author:
//   Niels Lohmann <niels.lohmann@piraten-mv.de>
/////////////////////////////////////////////////////////////////////////////

// port for the server to listen
var port = 3333;

// whether results should be cached
var cache = true;

// create an absolute path to the modules folder
var module_dir = require('path').normalize(__dirname + '/../modules');

// the cache
var simplecache = new (require("connect-cache/lib/storages/basic.js"));

// the web server running the Express framework
var app = require('express')();


/////////////////////////////////////////////////////////////////////////////
// TOOL EXECUTION
/////////////////////////////////////////////////////////////////////////////

function error(code, req, res) {
    res.writeHead(code);
    res.end();
    console.log('- Client ' + req['client']['remoteAddress'] + ' disconnected - code ' + code + '.');
}

// entry point for the modules
// TODO move parameters to object
// parameter outputInfo contains: page, listname, elemname, output
function care(tool, options, req, res, outputInfo) {
    console.log('+ Client ' + req['client']['remoteAddress'] + ' connected.');
    if(!outputInfo) {
        outputInfo = new Object();
    }

    // decide on output format
    // if no format is given, check if JSON or XML is accepted
    if (typeof options[0] === "undefined") {
        if (req.accepts("application/json")) {
            format = "json"
        } else if (req.accepts("application/xml")) {
            format = "xml";
        } else {
            // we could not agree on a format - send 406 Not acceptable
            error(406, req, res);
            return;
        }
    } else {
        format = options[0];
        if (format != "json" && format != "xml") {
            // the given format is not implemented - send 406 Not acceptable
            error(406, req, res);
            return;
        }
    }

    // the file format should not be used as option any more
    options.shift();
    options.clean(undefined);

    if (cache) {
        var key = getCacheKey(tool, options);
        simplecache.get(key, function(error, data) {
            if (error) {
                // something went wrong: send 500 Internal Server Error
                error(500, req, res);
            } else {
                handleCacheResult(tool, options, req, res, outputInfo, data, key);
            }
        });
    } else {
        callModule(tool, options, req, res, outputInfo, handleToolResult);
    }
}

function handleCacheResult(tool, options, req, res, outputInfo, data, key) {
    if (data) {
        console.log("cache hit for: " + key);
        buildResponse(req, res, outputInfo, data);
    } else {
        console.log("cache miss for: " + key);
        callModule(tool, options, req, res,outputInfo, handleToolResult);
    }
}

function handleToolResult(tool, options, req, res, outputInfo, responsedata) {
    if (cache) {
        cacheResponse(getCacheKey(tool, options), responsedata);
    }
    buildResponse(req, res, outputInfo, responsedata);
}

// actually call the tool
// parameter outputInfo contains: page, listname, elemname, output
function callModule(tool, options, req, res, outputInfo, cb) {
    var responsedata = "";

    // call module - prefix with modules directory
    var child = require('child_process').spawn(module_dir + '/' + tool, options);
    console.log('  + Tool "' + tool + ' ' + options.join(" ") + '" spawned (PID ' + child.pid + ').');

    // redirect stdout to output
    child.stdout.on('data', function(data) {
        responsedata += data;
    });

    // redirect stderr to console
    child.stderr.on('data', function(data) {
        //console.error("[stderr] " + data);
    });

    // close connection once the tool terminates
    child.on('exit', function(code) {
        console.log('  - Tool "' + tool + '" terminated with exit code ' + code + '.');
        switch(code) {
            case 0:
                cb(tool, options, req, res, outputInfo, responsedata);
                break;

            case 1:
                // tool reported an error - send 404 Not Found
                error(404, req, res);
                break;

            default:
                // other error - send 500 Internal Server Error
                error(500, req, res);
                break;
        }
    });
}

// return response to client
// parameter outputInfo contains: page, listname, elemname, output
function buildResponse(req, res, outputInfo, responsedata) {
    // build response
    if (outputInfo.output) {
        // enhance output if function exists
        responsedata = outputInfo.output(responsedata);
        if (!responsedata) {
            // which error in which case?
            error(404, req, res);
            return;
        }
    } else {
        responsedata = JSON.parse(responsedata);
        // TODO error handling
    }

    // write a header if we don't server pages
    if (outputInfo.page == null) {
        switch(format) {
        case 'json': 
            res.writeHead(200, {'Content-Type': 'application/json'});
            responsedata = tojson(responsedata);
            break;
        case 'xml':  
            res.writeHead(200, {'Content-Type': 'application/xml'});
            if (!outputInfo.elemname) {
                outputInfo.elemname = "root";
            }
            if (outputInfo.listname) {
                responsedata = listtoxml(outputInfo.listname, outputInfo.elemname, responsedata);
            } else {
                responsedata = toxml(outputInfo.elemname, responsedata);
            }
            break;
        }
    } else {
        res.writeHead(200, {'Content-Type': 'text/html'});
    }

    res.write(responsedata);
    res.end();
    console.log('- Client ' + req['client']['remoteAddress'] + ' disconnected.');
}


/////////////////////////////////////////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////////////////////////////////////////

function tojson(data) {
    return JSON.stringify(data);
}

function toxml(elemname, data) {
    // TODO nicer solution for links: use href as attribute
    return require('data2xml')(elemname, data);
}

function listtoxml(listname, elemname, data) {
    // TODO nicer solution for links: use href as attribute
    var object = new Object;
    object[elemname] = data;
    return require('data2xml')(listname, object);
}

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
// CACHING
/////////////////////////////////////////////////////////////////////////////

function cacheResponse(key, responsedata) {
    var timeout = 10000; // depending on URL?
    simplecache.set(key, responsedata, function() {
        console.log("added " + key + " to cache");
    });
    setTimeout(function() {
        simplecache.remove(key, function() {
            console.log("removed " + key + " from cache");
        })
    }, timeout);
}

function getCacheKey(tool, options) {
    // use tool name and options as key for the cache
    return require('connect').utils.md5(tool + " " + options)
}


/////////////////////////////////////////////////////////////////////////////
// SERVER RUNTIME
/////////////////////////////////////////////////////////////////////////////

// make the server invincible - never stop even in case of exceptions
process.on('uncaughtException', function (err) {
    console.error('Server experienced uncaught exception: ' + err);
});

// load all modules and start the server
function init() {
    var fs = require('fs');

    // load all modules in the module_dir and start the server
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
}

init();
