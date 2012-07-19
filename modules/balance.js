//////////////////////////////////////////////////////////
// Kontostand
//////////////////////////////////////////////////////////

app.get('/balance.:format?', function(req, res) {
    var options = [req.params.format];
    var tool = "balance/balance.php";
    care(tool, options, req, res);
});
