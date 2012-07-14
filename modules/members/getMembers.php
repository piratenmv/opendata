#!/usr/bin/php
<?php 
#############################################################################
# Purpose:
#   Lists the number of members of the Pirate Party Germany given a
#   subdivision.
#
# Usage:
#   getMembers.php DIVISION
#
#   DIVISION: A subdivision identifier such as 'bund' (Bundespartei) or
#             'mv' (Mecklenburg-Vorpommern)
#
# Files:
#   Expects the file 'simple_html_dom.php' containing the PHP Simple HTML
#   DOM Parser (http://sourceforge.net/projects/simplehtmldom/) to be 
#   present in the 'includes' directory. The PHP Simple HTML DOM Parser is
#   licensed under the MIT license (http://opensource.org/licenses/MIT).
#
# Author:
#   Niels Lohmann <niels.lohmann@piraten-mv.de>
#############################################################################

error_reporting (E_ALL ^ E_NOTICE);
date_default_timezone_set('Europe/Berlin');

# subvisions identifier to Wiki title mapping
$subdivision = array(
    "bb" => "Brandenburg",
    "be" => "Berlin",
    "bw" => "Baden-Württemberg",
    "by" => "Bayern",
    "hb" => "Bremen",
    "he" => "Hessen",
    "hh" => "Hamburg",
    "mv" => "Mecklenburg-Vorpommern",
    "ni" => "Niedersachsen",
    "nw" => "Nordrhein-Westfalen",
    "rp" => "Rheinland-Pfalz",
    "sh" => "Schleswig-Holstein",
    "sl" => "Saarland",
    "sn" => "Sachsen",
    "st" => "Sachsen-Anhalt",
    "th" => "Thüringen",
    "bund" => "Bund"
);

# process command line
if ($argc != 2) die("Exactly one parameter must be given!\n");
if (!array_key_exists($argv[1], $subdivision)) die ("Parameter does not name a subdivision!\n");
$DIVISION = $subdivision[$argv[1]];

# load the wiki page containing the member data
$ch = curl_init(); 
curl_setopt($ch, CURLOPT_URL, "http://wiki.piratenpartei.de/Mitgliederzahl"); 
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
$res = curl_exec($ch); 
curl_close($ch); 

# include the PHP Simple HTML DOM Parser
include_once('includes/simple_html_dom.php');

# process HTML from result
$html = str_get_html($res);

// get lines of wikitable
if ($DIVISION == "Bund") {
    $table = $html->find('table[class=wikitable sortable] tr[class=sortbottom] td');

    // collect data of the following rows
    $mitglieder            = str_get_html($table[1])->find('td text');
    $stimmberechtigt       = str_get_html($table[2])->find('td text');
    $einwohner             = str_get_html($table[4])->find('td text');
    $mitgliederjeeinwohner = str_get_html($table[5])->find('td text');
    $flaeche               = str_get_html($table[7])->find('td text');
    $mitgliederjeflaeche   = str_get_html($table[8])->find('td text');
    $stand                 = str_get_html($table[9])->find('td text');

    // clean up data
    $mitglieder = trim($mitglieder[0]);
    $mitglieder = str_replace(".", "", $mitglieder);
    $stimmberechtigt = trim($stimmberechtigt[1]);
    $stimmberechtigt = str_replace(".", "", $stimmberechtigt);
    $einwohner = trim(str_replace(",", ".", $einwohner[0])) * 1000000; // replace "1,6" by 1600000 
    $mitgliederjeeinwohner = trim($mitgliederjeeinwohner[0]);
    $flaeche = trim($flaeche[0]) * 1000; // replace "23.180" by 23180
    $mitgliederjeflaeche = trim($mitgliederjeflaeche[0]);
    $stand = "null";
} else {
    $table = $html->find('table[class=wikitable sortable] td');

    for ($i = 0; $i < count($table); $i++) {
        // get link text
        $t = str_get_html($table[$i])->find('td a text');

        // traverse until division title (e.g. "Mecklenburg-Vorpommern") is found
        if ($t[0] != $DIVISION) {
            continue;
        }

        // collect data of the following rows
        $mitglieder            = str_get_html($table[$i+1])->find('td text');
        $stimmberechtigt       = str_get_html($table[$i+2])->find('td text');
        $einwohner             = str_get_html($table[$i+4])->find('td text');
        $mitgliederjeeinwohner = str_get_html($table[$i+5])->find('td text');
        $flaeche               = str_get_html($table[$i+7])->find('td text');
        $mitgliederjeflaeche   = str_get_html($table[$i+8])->find('td text');
        $stand                 = str_get_html($table[$i+9])->find('td text');

        // clean up data
        $mitglieder = trim($mitglieder[0]);
        $stimmberechtigt = trim($stimmberechtigt[0]);
        $einwohner = trim(str_replace(",", ".", $einwohner[1])) * 1000000; // replace "1,6" by 1600000 
        $mitgliederjeeinwohner = trim($mitgliederjeeinwohner[1]);
        $flaeche = trim($flaeche[1]) * 1000; // replace "23.180" by 23180
        $mitgliederjeflaeche = trim($mitgliederjeflaeche[1]);
        $stand = "\"" . trim($stand[1]) . "\"";

        // fix data that is not present
        if ($stimmberechtigt == "--") {
            $stimmberechtigt = "null";
        }

        break;
    }
}


// output JSON
echo <<<EOT
{
    "mitglieder": $mitglieder,
    "stimmberechtigt": $stimmberechtigt,
    "einwohner": $einwohner,
    "mitglieder_je_einwohner": $mitgliederjeeinwohner,
    "flaeche": $flaeche,
    "mitglieder_je_flaeche": $mitgliederjeflaeche,
    "stand": $stand
}

EOT;

?>
