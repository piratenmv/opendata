//////////////////////////////////////////////////////////
// Mitgliedsdaten
//////////////////////////////////////////////////////////

app.get('/members/:area.:format?', function(req, res) {
    var options = [req.params.format, req.params.area];
    var tool = "members/getMembers.php";
    care(tool, options, req, res);
});
