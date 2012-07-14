#!/usr/bin/env python
# encoding: utf-8

#############################################################################
# Purpose:
#   Lists areas of a LQFB instance.
#
# Usage:
#   getAreas.py INSTANCE [AREAID]
#
#   INSTANCE - A LQFB instance identifier such as 'bund' (Bundesinstanz) or
#              'mv' (Mecklenburg-Vorpommern)
#   AREADID - An id of an area (optional). If no AREADID is given, all areas
#             are returned.
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
assert len(sys.argv) > 1, 'at least one parameter must be given'
INSTANCE = sys.argv[1]
assert len(sys.argv) < 3, 'at most two parameter must be given'
if len(sys.argv) > 2:
    AREAID = sys.argv[2]

# read keys
__location__ = os.path.realpath(
    os.path.join(os.getcwd(), os.path.dirname(__file__)))
lqfb_keys = json.loads(open(os.path.join(__location__, 'keys.json')).read())
assert INSTANCE in lqfb_keys['keys'], 'no key for that instance stored'

# build URL for the request
if INSTANCE == 'bund':
    url = "https://lqfb.piratenpartei.de/pp/api/area.html&key=" + lqfb_keys['keys']['bund'] + "&api_engine=json"
else:
    url = "https://lqpp.de/" + INSTANCE + "/webmcp-wrapper.lua?_webmcp_urldepth=1&_webmcp_module=api&_webmcp_view=area&key=" + lqfb_keys['keys'][INSTANCE] + "&api_engine=json"

# if further parameter is given, treat it as id for an area
if len(sys.argv) > 2:
    url += "&id=" + AREAID


# get JSON and transform it to a dict
obj = json.loads(urllib2.urlopen(url).read())


# generate URLs from ids and add to entries
for entry in obj:
    if INSTANCE == 'bund':
        entry.update({'url' : 'http://pplf.de/b' + str(entry['id'])})
    else:
        entry.update({'url' : 'http://' + INSTANCE + '.pplf.de/b' + str(entry['id'])})


# return pretty-printed JSON
print(json.dumps(obj, indent=2))
