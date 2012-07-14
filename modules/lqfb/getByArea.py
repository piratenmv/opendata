#!/usr/bin/env python
# encoding: utf-8

#############################################################################
# Purpose:
#   Lists initiatives of a LQFB instance filtered by a given area id.
#
# Usage:
#   getByArea.py INSTANCE AREAID
#
#   INSTANCE - A LQFB instance identifier such as 'bund' (Bundesinstanz) or
#              'mv' (Mecklenburg-Vorpommern)
#   AREADID - An id of an area.
#
# Files:
#   Expects a file 'keys.json' to be present in the same directory which
#   holds API keys for different LQFB instances.
#
# Author:
#   Niels Lohmann <niels.lohmann@piraten-mv.de>
#############################################################################

import sys
import urllib2
import json
import os

# get parameters
assert len(sys.argv) == 3, 'exactly two parameters must be given'
INSTANCE = sys.argv[1]
AREAID = sys.argv[2]

# read keys
__location__ = os.path.realpath(
    os.path.join(os.getcwd(), os.path.dirname(__file__)))
lqfb_keys = json.loads(open(os.path.join(__location__, 'keys.json')).read())
assert INSTANCE in lqfb_keys['keys'], 'no key for that instance stored'

# build URL for the request
if INSTANCE == 'bund':
    url = "https://lqfb.piratenpartei.de/pp/api/initiative.html&key=" + lqfb_keys['keys']['bund'] + "&area_id=" + AREAID + "&api_engine=json"
else:
    url = "https://lqpp.de/" + INSTANCE + "/webmcp-wrapper.lua?_webmcp_urldepth=1&_webmcp_module=api&_webmcp_view=initiative&key=" + lqfb_keys['keys'][INSTANCE] + "&area_id=" + AREAID + "&api_engine=json"


# get JSON and transform it to a dict
obj = json.loads(urllib2.urlopen(url).read())


# generate URLs from ids and add to entries
for entry in obj:
    if INSTANCE == 'bund':
        entry.update({'url' : 'http://pplf.de/i' + str(entry['id'])})
    else:
        entry.update({'url' : 'http://' + INSTANCE + '.pplf.de/i' + str(entry['id'])})


# return pretty-printed JSON
print(json.dumps(obj, indent=2))
