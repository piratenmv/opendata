#!/usr/bin/php
<?php

#############################################################################
# Purpose:
#   Calls an executable and caches its output for subsequent calls.
#
# Usage:
#   cache.php CALL ARGUMENTS...
#
#   CALL - The script to be called.
#   ARGUMENTS - An arbitrary number of arguments.
#
# Files:
#   Writes cache files into the relative '../cache' directory.
#
# Author:
#   Niels Lohmann <niels.lohmann@piraten-mv.de>
#############################################################################

date_default_timezone_set('Europe/Berlin');


// remove the call to "cache.php" from command line parameters
array_shift($argv);

// convert argv into a string
$request = implode(" ", $argv) . "\n";

// cache file uses MD5 hash of request
$cachefile = dirname( __FILE__ ) . '/../cache/' . md5($request) . '.json';

// we cache for 15 minutes
$cachetime = 15 * 60;

// Serve from the cache if it is younger than $cachetime
if (file_exists($cachefile) && time() - $cachetime < filemtime($cachefile)) {
    print fread(fopen ($cachefile, "r"), filesize($cachefile));  
    exit;
}

// make system call
$res = array();
exec($request, $res);
$s = implode("\n", $res);

// Start the output buffer
ob_start(); 
print($s);

// Cache the output to a file
$fp = fopen($cachefile, 'w');
fwrite($fp, ob_get_contents());
fclose($fp);

// Send the output to the browser
ob_end_flush();

?>