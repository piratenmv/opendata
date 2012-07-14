//////////////////////////////////////////////////////////
// Mitgliedsdaten
//////////////////////////////////////////////////////////

app.get('/members/:area', function(req, res) {
    var options = [req.params.area];
    var tool = "members/getMembers.php";
    care(tool, options, req, res);
});
