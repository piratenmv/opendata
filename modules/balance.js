//////////////////////////////////////////////////////////
// Kontostand
//////////////////////////////////////////////////////////

app.get('/balance', function(req, res) {
    var options = [];
    var tool = "balance/balance.php";
    care(tool, options, req, res);
});
