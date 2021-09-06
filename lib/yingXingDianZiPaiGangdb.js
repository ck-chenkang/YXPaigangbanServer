const mssql = require("mssql");
const conf = require("../config/yingXingDianZiPaiGangConfig");

let restoreDefaults = function () {
    conf;
};
const con = new mssql.ConnectionPool(conf);
 
con.on('error', err => {
    if (err) {  
        throw err;
    }
});
 
con.connect(err => {
    if (err) {
        console.error(err);
    }
});
 
 
var sqlexe = async function(sql, callBack){
    try{
        var ps = new mssql.PreparedStatement(con);
        // var sql = "select * from " + tableName + " ";
        ps.prepare(sql, err => {
            if (err)
                console.log(err);
            ps.execute("", (err, recordset) => {
                callBack(err, recordset);
                ps.unprepare(err => {
                    if (err)
                        console.log(err);
                });
            });
        });
    }catch(err){
        console.error('SQL error', err);
    }
    restoreDefaults();
}

exports.sqlexe = sqlexe;