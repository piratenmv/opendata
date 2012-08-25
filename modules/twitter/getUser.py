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

# get parameters
assert len(sys.argv) > 1, 'at exactly one parameter must be given'
USERNAME = sys.argv[1]

# use Tweepy API
api = tweepy.API()
info = api.get_user(screen_name=USERNAME)

# copy data to dict
data = dict()
data['contributors_enabled'] = info.contributors_enabled
data['created_at'] = str(info.created_at)
data['default_profile'] = info.default_profile
data['default_profile_image'] = info.default_profile_image
data['description'] = info.description
data['favourites_count'] = info.favourites_count
data['follow_request_sent'] = info.follow_request_sent
data['followers_count'] = info.followers_count
data['following'] = info.following
data['friends_count'] = info.friends_count
data['geo_enabled'] = info.geo_enabled
data['id'] = info.id
data['id_str'] = info.id_str
data['is_translator'] = info.is_translator
data['lang'] = info.lang
data['listed_count'] = info.listed_count
data['location'] = info.location
data['name'] = info.name
data['notifications'] = info.notifications
data['profile_background_color'] = info.profile_background_color
data['profile_background_image_url'] = info.profile_background_image_url
data['profile_background_image_url_https'] = info.profile_background_image_url_https
data['profile_background_tile'] = info.profile_background_tile
data['profile_image_url'] = info.profile_image_url
data['profile_image_url_https'] = info.profile_image_url_https
data['profile_link_color'] = info.profile_link_color
data['profile_sidebar_border_color'] = info.profile_sidebar_border_color
data['profile_sidebar_fill_color'] = info.profile_sidebar_fill_color
data['profile_text_color'] = info.profile_text_color
data['profile_use_background_image'] = info.profile_use_background_image
data['protected'] = info.protected
data['screen_name'] = info.screen_name
data['show_all_inline_media'] = info.show_all_inline_media
data['statuses_count'] = info.statuses_count
data['time_zone'] = info.time_zone
data['url'] = info.url
data['utc_offset'] = info.utc_offset
data['verified'] = info.verified

# return JSON
print(json.dumps(data, sort_keys=True, indent=4))
