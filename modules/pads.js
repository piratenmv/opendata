//////////////////////////////////////////////////////////
// Piratenpads
//////////////////////////////////////////////////////////

// get list of all pads
app.get('/pads/:group', function(req, res) {
    var options = [req.params.group];
    var tool = "pads/getPadList.php";
    care(tool, options, req, res);
});

// get details on all pads
app.get('/pads/:group/all', function(req, res) {
    var options = [req.params.group, req.params.id];
    var tool = "pads/getPads.php";
    care(tool, options, req, res);
});

// get details on a pad
app.get('/pads/:group/:id', function(req, res) {
    var options = [req.params.group, req.params.id];
    var tool = "pads/getPadById.php";
    care(tool, options, req, res);
});
