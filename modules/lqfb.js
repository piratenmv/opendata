//////////////////////////////////////////////////////////
// Liquid Feedback
//////////////////////////////////////////////////////////

// get all new initiatives (default)
app.get('/lqfb/:instance.:format?', function(req, res) {
    var options = [req.params.format, req.params.instance, 'new'];
    var tool = "lqfb/getByState.py";
    care(tool, options, req, res);
});

// get all areas
app.get('/lqfb/:instance/areas.:format?', function(req, res) {
    var options = [req.params.format, req.params.instance];
    var tool = "lqfb/getAreas.py";
    care(tool, options, req, res);
});

// get areas by id
app.get('/lqfb/:instance/areas/:id.:format?', function(req, res) {
    var options = [req.params.format, req.params.instance, req.params.id];
    var tool = "lqfb/getAreas.py";
    care(tool, options, req, res);
});

// get initiatives by area encoded as integer
app.get('/lqfb/:instance/areas/:id/initiatives.:format?', function(req, res) {
    var options = [req.params.format, req.params.instance, req.params.id];
    var tool = "lqfb/getByArea.py";
    care(tool, options, req, res);
});

// get initiatives by state (new, accepted, frozen, voting, cancelled, finished)
app.get('/lqfb/:instance/state/:state.:format?', function(req, res) {
    var options = [req.params.format, req.params.instance, req.params.state];
    var tool = "lqfb/getByState.py";
    care(tool, options, req, res);
});

// get initiative by id
app.get('/lqfb/:instance/:id.:format?', function(req, res) {
    var options = [req.params.format, req.params.instance, req.params.id];
    var tool = "lqfb/getById.py";
    care(tool, options, req, res);
});

// get initiative by id and show suggestions
app.get('/lqfb/:instance/:id/suggestions.:format?', function(req, res) {
    var options = [req.params.format, req.params.instance, req.params.id];
    var tool = "lqfb/getSuggestions.py";
    care(tool, options, req, res);
});
