#!/usr/bin/php
<?php 
#############################################################################
# Purpose:
#   Returns the account balance.
#
# Usage:
#   balance.php
#
# Files:
#   Expects the file 'simple_html_dom.php' containing the PHP Simple HTML
#   DOM Parser (http://sourceforge.net/projects/simplehtmldom/) to be 
#   present in the 'includes' directory.
#
# Author:
#   Niels Lohmann <niels.lohmann@piraten-mv.de>
#############################################################################

date_default_timezone_set('Europe/Berlin');

include_once('includes/simple_html_dom.php');

# connect to pad server and get a list of all pads
$ch = curl_init(); 
curl_setopt($ch, CURLOPT_URL, "http://piratenpartei-mv.de/spenden"); 
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
$res = curl_exec($ch); 
curl_close($ch); 

# process HTML from result
$html = str_get_html($res);

// get bold text
$boldtext = $html->find('div[class=content clear-block] p strong text');

// collect data
$datum = $boldtext[0];
$kontostand = (float)str_replace(",", ".", str_replace(".", "", $boldtext[1]));
$tagesgeld = (float)str_replace(",", ".", str_replace(".", "", $boldtext[2]));

// output JSON
echo <<<EOT
{
    "kontostand": $kontostand,
    "tagesgeld": $tagesgeld,
    "datum": "$datum"
}

EOT;

?>
