var express  = require('express');
var app      = express();                           // create our app w/ express
var mongoose = require('mongoose');                 // mongoose for mongodb
var morgan = require('morgan');                     // log requests to the console (express4)
var bodyParser = require('body-parser');            // pull information from HTML POST (express4)
var methodOverride = require('method-override');    // simulate DELETE and PUT (express4)


mongoose.connect('mongodb://localhost/taskList');

app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

// listen (start app with node server.js) ======================================
var port = Number(process.env.PORT || 3000);
app.listen(port);
console.log("Server listening on port 3000");


var Schema = mongoose.Schema;
var taskSchema = new Schema({

    user : String,
    taskComplted : Boolean,
    task : String

});
var Tasks = mongoose.model('tasks', taskSchema);

// api ---------------------------------------------------------------------
// get all tasks

app.get('/api/tasks/:user?/:task_id?', function(req, res) {

    var task_id = req.query.task_id;
    var user = req.query.user;
    var query = {};

    if (task_id != undefined)
        query['_id'] =  task_id ;
    else if (user != undefined)
        query['user'] =  user;

    console.log('Get Query: ' +  JSON.stringify(query) );

    // use mongoose to get all tasks in the database
    Tasks.find( query ,function(err, task) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err)
            res.send(err);

        res.json(task); // return all tasks in JSON format
    });
});

// create task and send back all tasks after creation
app.post('/api/tasks', function(req, res) {

    console.log('Create New Task');

    Tasks.create({
        task : req.body.task,
        user : req.body.user
    }, function(err , task){
        if(err)
            res.send(err.message);
        console.log('Add new task Success');

        Tasks.find({user: req.body.user}, function (err, tasks) {
            if(err)
                res.send(err.message);
            res.json(tasks);
        });
    });




});

// delete a task
app.delete('/api/tasks/:task_id', function(req, res) {

    console.log('Delete Task Request, TaskID: ' + req.params.task_id);
    Tasks.remove({
        _id : req.params.task_id
    }, function(err, tasks) {
        if (err)
            res.send(err);

        // get and return all the todos after you create another
        Tasks.find(function(err, tasks) {
            if (err)
                res.send(err)
            res.json(tasks);
        });
    });
});



app.put('/api/tasks/:task_id', function(req, res){

    Tasks.findOneAndUpdate({
        '_id' : req.params.task_id
    },{
        task : req.body.task,
        user : req.body.user,
        taskComplted : req.body.taskComplted
    },function (err, task) {
        if(err)
            res.send(err);

        res.json(task);
    });


});