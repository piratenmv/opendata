//////////////////////////////////////////////////////////
// Piratenpads
//////////////////////////////////////////////////////////

// get list of all pads
app.get('/pads/:group.:format?', function(req, res) {
    var options = [req.params.format, req.params.group];
    var tool = "pads/getPadList.php";
    care(tool, options, req, res);
});

// get details on all pads
app.get('/pads/:group/all.:format?', function(req, res) {
    var options = [req.params.format, req.params.group, req.params.id];
    var tool = "pads/getPads.php";
    care(tool, options, req, res);
});

// get details on a pad
app.get('/pads/:group/:id.:format?', function(req, res) {
    var options = [req.params.format, req.params.group, req.params.id];
    var tool = "pads/getPadById.php";
    care(tool, options, req, res);
});
