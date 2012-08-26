#!/usr/bin/env python
# encoding: utf-8
#############################################################################
# Purpose:
#   Lists tweets of a user.
#
# Usage:
#   getTweets.py USERNAME [SINCE]
#
#   USERNAME: A twitter username
#   SINCE:    An id since newer twitter should be returned (optional)
#
#   If no SINCE is given, the most recent 200 tweets are returned.
#
# Files:
#   Expects the Tweepy framework (http://code.google.com/p/tweepy/) in the
#   'tweepy' subdirectory.
#
# Author:
#   Johannes Loepelmann <johannes.loepelmann@piraten-mv.de>
#   Niels Lohmann <niels.lohmann@piraten-mv.de>
#############################################################################

import sys
import tweepy
import json

if (len(sys.argv) == 1):
    print('''{
  "error": {
    "message": "at least one parameter must be given"
   }
}''')
    sys.exit(1)

if (len(sys.argv) > 3):
    print('''{
  "error": {
    "message": "at most parameters must be given"
   }
}''')
    sys.exit(1)


USERNAME = sys.argv[1]

SINCE = 0
if len(sys.argv)>2:
    SINCE = sys.argv[2]


try:
    if SINCE != 0:
        results = tweepy.api.user_timeline(screen_name=USERNAME, since_id=SINCE)
    else:
        results = tweepy.api.user_timeline(screen_name=USERNAME, count=200)

    data = []
    for result in results:
        data.append({'user':USERNAME, 'text':result.text, 'time':result.created_at.isoformat(' '), 'id':result.id, 'retweets':result.retweet_count})

    print(json.dumps(data, sort_keys=True, indent=4))

except tweepy.error.TweepError as t:
    print('''{
  "error": {
    "message": "an error occurred communicating with Twitter"
   }
}''')
    sys.exit(1)
