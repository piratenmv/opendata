//////////////////////////////////////////////////////////
// Twitter
//////////////////////////////////////////////////////////

// get information on a Twitter user
app.get('/twitter/:user.:format?', function(req, res) {
    var options = [req.params.format, req.params.user];
    var tool = "twitter/getUser.py";
    care(tool, options, req, res);
});

// get tweets of a Twitter user
app.get('/twitter/:user/stream.:format?', function(req, res) {
    var options = [req.params.format, req.params.user];
    var tool = "twitter/getTweets.py";
    care(tool, options, req, res);
});

// get replies to a Twitter user
app.get('/twitter/:user/replies.:format?', function(req, res) {
    var options = [req.params.format, req.params.user];
    var tool = "twitter/getReplies.py";
    care(tool, options, req, res);
});
