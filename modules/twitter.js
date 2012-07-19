//////////////////////////////////////////////////////////
// Twitter
//////////////////////////////////////////////////////////

// get list of all pads
app.get('/twitter/:user.:format?', function(req, res) {
    var options = [req.params.format, req.params.user];
    var tool = "twitter/getUser.py";
    care(tool, options, req, res);
});
