#!/usr/bin/env python
# encoding: utf-8
#############################################################################
# Purpose:
#   Lists the information on a Twitter user.
#
# Usage:
#   getUser.py USERNAME
#
#   USERNAME: A twitter username
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
from tweepy.utils import import_simplejson
import json

if (len(sys.argv) != 2):
    print('''{
  "error": {
    "message": "exactly one parameter must be given"
   }
}''')
    sys.exit(1)

USERNAME = sys.argv[1]

try:
    info = tweepy.api.get_user(screen_name=USERNAME)

    # copy data to dict
    user_object = dict()
    user_object['contributors_enabled'] = info.contributors_enabled
    user_object['created_at'] = str(info.created_at)
    user_object['default_profile'] = info.default_profile
    user_object['default_profile_image'] = info.default_profile_image
    user_object['description'] = info.description
    user_object['favourites_count'] = info.favourites_count
    user_object['follow_request_sent'] = info.follow_request_sent
    user_object['followers_count'] = info.followers_count
    user_object['following'] = info.following
    user_object['friends_count'] = info.friends_count
    user_object['geo_enabled'] = info.geo_enabled
    user_object['id'] = info.id
    user_object['id_str'] = info.id_str
    user_object['is_translator'] = info.is_translator
    user_object['lang'] = info.lang
    user_object['listed_count'] = info.listed_count
    user_object['location'] = info.location
    user_object['name'] = info.name
    user_object['notifications'] = info.notifications
    user_object['profile_background_color'] = info.profile_background_color
    user_object['profile_background_image_url'] = info.profile_background_image_url
    user_object['profile_background_image_url_https'] = info.profile_background_image_url_https
    user_object['profile_background_tile'] = info.profile_background_tile
    user_object['profile_image_url'] = info.profile_image_url
    user_object['profile_image_url_https'] = info.profile_image_url_https
    user_object['profile_link_color'] = info.profile_link_color
    user_object['profile_sidebar_border_color'] = info.profile_sidebar_border_color
    user_object['profile_sidebar_fill_color'] = info.profile_sidebar_fill_color
    user_object['profile_text_color'] = info.profile_text_color
    user_object['profile_use_background_image'] = info.profile_use_background_image
    user_object['protected'] = info.protected
    user_object['screen_name'] = info.screen_name
    user_object['show_all_inline_media'] = info.show_all_inline_media
    user_object['statuses_count'] = info.statuses_count
    user_object['time_zone'] = info.time_zone
    user_object['url'] = info.url
    user_object['utc_offset'] = info.utc_offset
    user_object['verified'] = info.verified

    print(json.dumps(user_object, sort_keys=True, indent=4))

except tweepy.error.TweepError as t:
    print('''{
  "error": {
    "message": "an error occurred communicating with Twitter"
   }
}''')
    sys.exit(1)
