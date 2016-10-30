/* ============================================================
    Write a Node.js web application that presents users with a form containing three fields 
    and a submit button. The fields should be:

    title
    year
    imdb

    Set up a route to handle a POST request of this form. This route should use the Node.js 
    MongoDB driver to insert a movie document into MongoDB. The movie document should have 
    the same shape as those we looked at in lesson examples this week.
============================================================ */

var express = require('express'),
    app = express(),
    engines = require('consolidate'),
    bodyParser = require('body-parser'),
    MongoClient = require('mongodb').MongoClient,
    assert = require('assert');

app.engine('html', engines.nunjucks);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({ extended: true })); 

// Handler for internal server errors
function errorHandler(err, req, res, next) {
    console.error(err.message);
    console.error(err.stack);
    res.status(500).render('error_template', { error: err });
}

MongoClient.connect('mongodb://localhost:27017/video', function(err, db) {
    // If err, throw error and cancel rest of operations.
    assert.equal(null, err);

    // Successful connection.
    console.log("Successfully connected to MongoDB.");

    // View the add_movie.html
    app.get("/add_movie", function(req, res, next) {
        res.render("add_movie");
    }); // get /add_movie
    
    // Handle post for /add_movie
    app.post("/add_movie", function(req, res, next) {
        var $title = req.body.title,
            $year = req.body.year,
            $imdb = req.body.imdb
        ; // variables

        // Null checks
        if ($title == "") {
            next("Please fill in the title!");
        } else if ($year == "") {
            next("Please fill in the year!");
        } else if ($imdb == "") {
            next("Missing imdb info.  Fill it out please.");
        } else {
            db.collection("movies").insertOne(
                { "title": $title, "year": $year, "imdb": $imdb },
                function(err, r) {
                    // throw error if something went wrong.
                    assert.equal(null, err);
                    res.send("Document inserted with _id: " + r.insertedId);
                } // function(err, r)
            ); // db.collection("movies")
        } // if
    }); // post /add_movie

    app.use(errorHandler);
    
    var server = app.listen(3000, function() {
        var port = server.address().port;
        console.log('Express server listening on port %s.', port);
    });

});

