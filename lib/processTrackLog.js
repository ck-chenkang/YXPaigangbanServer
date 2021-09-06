var fs = require('fs');
var time = require('./currentTime');

var writeError = async function (path , error){
    let str = "[" + time.currentTime + "]:\n";
    str += error.message;
    str += "\n";
    str += error.stack;
    str += "\n"
    fs.appendFileSync(path, str, function(err){
        if(err){
            console.log("appen error log failed");
        }
    })    
}

exports.writeError = writeError;