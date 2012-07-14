#!/usr/bin/php
<?php
#############################################################################
# Purpose:
#   Returns all pads of a pad group.
#
# Usage:
#   getPads.php PADGROUP
#
#   PADGROUP: A pad group at the http://www.piratenpad.de server.
#
# Note:
#   For PADGROUP=meck-pom the URL of the pads would be read from
#   https://meck-pom.piratenpad.de.
#
# Files:
#   Expects the file 'simple_html_dom.php' containing the PHP Simple HTML
#   DOM Parser (http://sourceforge.net/projects/simplehtmldom/) to be 
#   present in the 'includes' directory. The PHP Simple HTML DOM Parser is
#   licensed under the MIT license (http://opensource.org/licenses/MIT).
#   Further expects a file 'keys.json' to be present in the current
#   directory which holds login information for the pad server.
#
# Author:
#   Niels Lohmann <niels.lohmann@piraten-mv.de>
#############################################################################

date_default_timezone_set('Europe/Berlin');

include_once('includes/simple_html_dom.php');
include_once('includes/escapejson.php');

# process command line
if ($argc != 2) die("Exactly one parameter must be given!\n");
$PADGROUP = $argv[1];

# read keys
$keys = json_decode(file_get_contents(dirname(__FILE__) . "/keys.json"), true);
if (!array_key_exists($PADGROUP, $keys['keys'])) die ("No key given for that pad group!\n");
$postfields = "email=" . urlencode($keys['keys'][$PADGROUP]['username']) . "&password=" . $keys['keys'][$PADGROUP]['password']; 


# visit pad an get JSON file - here we get all the structured information for free
function getJSON($pad) {
    global $postfields;
    global $PADGROUP;

    $ch = curl_init(); 
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
    curl_setopt($ch, CURLOPT_COOKIEFILE, "/tmp/cookie"); 
    curl_setopt($ch, CURLOPT_COOKIEJAR, "/tmp/cookie"); 
    curl_setopt($ch, CURLOPT_URL, "https://" . $PADGROUP . ".piratenpad.de/ep/account/sign-in?cont=https%3a%2f%2f" . $PADGROUP . ".piratenpad.de%2f".$pad); 
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, "$postfields"); 
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

    $res = curl_exec($ch); 
    curl_close($ch); 

    // extract javascript part
    $html = str_get_html($res);
    $js = $html->find('script text');

    // strip the variable
    $clientVars = str_replace("// <![CDATA[ var clientVars = ", "", $js[0]);
    $clientVars = str_replace(";   // ]]>", "", $clientVars);

    // get rid of half-hearted escapings
    $clientVars = str_replace(array('\x3c', '\x3e', '\x26'), array("<", ">", "&"), $clientVars); 

    return json_decode($clientVars, true);
}

function getpads($pad_group) {
    global $postfields;

    # connect to pad server and get a list of all pads
    $ch = curl_init(); 
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
    curl_setopt($ch, CURLOPT_COOKIEFILE, "/tmp/cookie"); 
    curl_setopt($ch, CURLOPT_COOKIEJAR, "/tmp/cookie"); 
    curl_setopt($ch, CURLOPT_URL, "https://" . $pad_group . ".piratenpad.de/ep/account/sign-in?cont=https%3a%2f%2f" . $pad_group . ".piratenpad.de%2fep%2fpadlist%2fall-pads"); 
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, "$postfields"); 
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    $res = curl_exec($ch); 
    curl_close($ch); 

    # process HTML from result
    $html = str_get_html($res);

    # extract interesting HTML parts
    $table_locks =   $html->find('table[id=padtable] tr td[class=secure first]');
    $table_titles =  $html->find('table[id=padtable] tr td[class=title] a text');
    $table_urls =    $html->find('table[id=padtable] tr td[class=title] a');
    $table_dates =   $html->find('table[id=padtable] tr td[class=lastEditedDate] text');
    $table_editors = $html->find('table[id=padtable] tr td[class=editors] span');

    // actual JSON output
    echo "[";

    for ($i = 0; $i < count($table_titles); $i++) {
        // fix URLs
        $pad = str_replace("/", "", $table_urls[$i]->href);

        if ($i > 0) {
            echo ",\n";
        }

        echo "{ ";

        echo "\"id\" : \"" . str_replace("/", "", $table_urls[$i]->href) . "\", ";
        echo "\"title\" : \"" . escapeJsonString($table_titles[$i]) . "\", ";
        echo "\"url\" : \"http://" . $pad_group . ".piratenpad.de" . $table_urls[$i]->href . "\", ";
        echo "\"editors\" : " . json_encode(explode(", ", $table_editors[$i]->plaintext)) . ", ";
        echo "\"lastUpdate\" : \"" . date('Y-m-d', strtotime($table_dates[$i])) . "\", ";

        $public = empty($table_locks[$i]->children);

        if ($public) {
            echo "\"protected\" : false, ";
            $json = getJSON($pad);
            echo "\"words\" : " . str_word_count($json['collab_client_vars']['initialAttributedText']['text']) . ", ";
            echo "\"chatlines\" : " . count($json['chatHistory']['lines']);
        } else {
            echo "\"protected\" : true";
        }

        echo " }";
    }

    echo "]\n";
}

getpads($PADGROUP);

?>
