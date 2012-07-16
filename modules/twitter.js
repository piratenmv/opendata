//////////////////////////////////////////////////////////
// Twitter
//////////////////////////////////////////////////////////

// get list of all pads
app.get('/twitter/:user', function(req, res) {
    var options = [req.params.user];
    var tool = "twitter/getUser.py";
    care(tool, options, req, res);
});
