var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
var async = require('async');


// Create connection to database
var config =
{
    userName: 'ajacques', 
    password: 'Legolas01!',
    server: 'studentpoll.database.windows.net',
    options:
    {
        database: 'studentPollDatabase',
        encrypt: true
    }
}
var connection = new Connection(config);

function Start()
{
    console.log('Reading rows from the Table...');

    // Read all rows from table
    var request = new Request(
        "SELECT * FROM Cities",
        function(err, rowCount, rows)
        {
            console.log(rowCount + ' row(s) returned');
            process.exit();
        }
    );

    request.on('row', function(columns) {
        columns.forEach(function(column) {
            console.log("%s\t%s", column.metadata.colName, column.value);
        });
    });
    connection.execSql(request);
}



// new

function Update(CityName, callback) {
    // console.log("Updating Location to '" + location + "' for '" + name + "'...");
    console.log("'+1 votes for '" + CityName + "'.'" );


    // Update the employee record requested
    request = new Request(
    // 'UPDATE TestSchema.Employees SET Location=@Location WHERE Name = @Name;',
    'UPDATE Cities SET Votes= Votes+1 WHERE CityName = @CityName;',

    function(err, rowCount, rows) {
        if (err) {
        callback(err);
        } else {
        console.log(rowCount + ' row(s) updated');
        callback(null, 'Jared');
        }
    });
    request.addParameter('Name', TYPES.NVarChar, name);
    request.addParameter('Location', TYPES.NVarChar, location);

    // Execute SQL statement
    connection.execSql(request);
}



function Read(callback) {
    console.log('Reading rows from the Table...');

    // Read all rows from table
    request = new Request(
    'SELECT * FROM Cities',
    function(err, rowCount, rows) {
    if (err) {
        callback(err);
    } else {
        console.log(rowCount + ' row(s) returned');
        callback(null);
    }
    });

    // Print the rows read
    var result = "";
    request.on('row', function(columns) {
        columns.forEach(function(column) {
            if (column.value === null) {
                console.log('NULL');
            } else {
                result += column.value + " ";
            }
        });
        console.log(result);
        result = "";
    });

    // Execute SQL statement
    connection.execSql(request);
}

function Complete(err, result) {
    if (err) {
        callback(err);
    } else {
        console.log("Done!");
    }
}

// Attempt to connect and execute queries if connection goes through
connection.on('connect', function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log('Connected');

    // // Execute all functions in the array serially
    async.waterfall([
        Start,
        Read
    ], Complete)
  }
});


// to do;
// - Return DB as JSON, reference in Vue component data
// - Test dynamically calling the 'update' function via vote button
// - Test on live server