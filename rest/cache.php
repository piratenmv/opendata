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


// function defination to convert array to xml
function array_to_xml($student_info, &$xml_student_info) {
    foreach($student_info as $key => $value) {
        if(is_array($value)) {
            if(!is_numeric($key)){
                $subnode = $xml_student_info->addChild("$key");
                array_to_xml($value, $subnode);
            }
            else{
                array_to_xml($value, $xml_student_info);
            }
        }
        else {
            $xml_student_info->addChild("$key","$value");
        }
    }
}

// get the target file format - it is always the first argument
$format = $argv[1];

// remove the call to "cache.php" from command line parameters
array_shift($argv);
// remove format from command line parameters
array_shift($argv);

// convert argv into a string
$request = implode(" ", $argv) . "\n";

// cache file uses MD5 hash of request
$cachefile = dirname( __FILE__ ) . '/../cache/' . md5($request) . '.' . $format;

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

switch ($format) {
    case "json":
        print($s);
        break;
    
    case "xml":
        $test_array = json_decode($s);
        $xml = new SimpleXMLElement('<root/>');
        array_to_xml($test_array, $xml);
        print $xml->asXML();
        break;
    
    default:
        die("Error: Format '${format}' is not implemented!\n");
}

// Cache the output to a file
$fp = fopen($cachefile, 'w');
fwrite($fp, ob_get_contents());
fclose($fp);

// Send the output to the browser
ob_end_flush();

?>