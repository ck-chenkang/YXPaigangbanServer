const { time } = require('console');
var express = require('express');
var router = express.Router();
var dateTime = require("../lib/currentTime");
// var path = require('path');

var db = require('../lib/yingXingDianZiPaiGangdb');
// var log = require('../lib/processTrackLog');
// var dateTime = require("../lib/currentTime");

/* GET  未出货缸的消息 */
router.get('/unshipped-batch-info', function (req, res, next) {

/*     let sql = `SELECT
                * 
                FROM
                    v_order 
                WHERE
                    billdate >= DATEADD( DAY, -60, GETDATE( ) ) 
                ORDER BY
                    billdate DESC;`; */
    
    let reqParams = req.query;
    //判断 参数是否存在
    if (reqParams.beginTime == undefined && reqParams.endTime == undefined) {
        reqParams.beginTime = '1970-01-01';
        reqParams.endTime = dateTime.currentDate;
        /*         res.send(
                    {
                        "code": 0,
                        "msg": "Error: \'startDate\' 或者 \'endDate\' 没定义 !",
                        "data": ""
                    }
                );
                return; */
    }

    let sql = `SELECT
    * 
    FROM
        v_order 
    WHERE
    billdate BETWEEN '` + reqParams.beginTime + `' AND '` +  
        reqParams.endTime + `'
    ORDER BY
    billdate DESC;`;

    // console.log(sql);
    db.sqlexe(sql, function (err, result) {
        if (err) {
            // console.log(err);
            res.send({
                "code": 0,
                "msg": "sql语句执行失败:\n" + err.message + "\n" + err.stack + "\n",
                "data": ""
            });
            return;
        }

        // console.log(result);
        var arrary = Array.from(result.recordset);
        var resultArr = new Array();

        arrary.forEach(function(value, index){
            resultArr.push({
                // "companyId" : value.customer == null ? "" : value.customer,
                "batchNo" :value.vat_no == null ? "" : value.vat_no.toString().trim(), //缸号
                "contract_no" :  value.contract_no == null ? "" : value.contract_no.toString().trim(), //订单号
                // "internalOrderNo" : ,
                // "batchDate" : value.billdate == null ? "" : value.billdate.toString().trim(),
/*                 new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')   // replace T with a space
       // delete the dot and everything after */
                "batchDate" : value.billdate == null ? "" : new Date(value.billdate.toString().trim()).toISOString().replace(/T/, ' ').replace(/\..+/, ''), //开缸日期
                "styleNo" : value.cust_styleno == null ? "" : value.cust_styleno.toString().trim(),
                "width" : value.width == null ? "" : value.width.toString().trim(),
                // "gramWeight" : ,
                "customer" :value.customer == null ? "" : value.customer.toString().trim(), //客户名称
                 "weight" :value.quantity == null ? "" : value.quantity.toString().trim(), //重量
                "fabricType" : value.fabric_name == null ? "" : value.fabric_name.toString().trim(), //布种
                "quantity":value.pieces== null ? "" : value.pieces.toString().trim(), //匹数
                "remark":value.notes == null ? "" : value.notes.toString().trim(),   //备注
                "color": value.color == null ? "" : value.color.toString().trim(),  //颜色
                "colorCode":value.ncode == null ? "" : value.ncode.toString().trim(), //色号
                "processNames": value.process == null ? "" : value.process.toString().trim(),
                // "data":,
                // "deliverDate":
                
            })

        })
        res.send({
            "code": 1,
            "msg": "操作成功",
            "data": resultArr
        });
        return;
    });
});

router.get('/ganghao', function (req, res, next) {

    let reqParams = req.query;
 
    if (reqParams.batchNo == undefined) {
        res.send(
            {
                "code": 0,
                "msg": "Error: \'batchNo(缸号)\' 没定义 !",
                "data": ""
            }
        );
        return;
    }

    let sql = `SELECT
    * 
    FROM
        v_order 
    WHERE
    v_order.vat_no = '`+ reqParams.batchNo + `'`;

    db.sqlexe(sql, function (err, result) {
        if (err) {
            console.log(err);
            res.send({
                "code": 0,
                "msg": "sql语句执行失败:\n" + err.message + "\n" + err.stack + "\n",
                "data": ""
            });
            return;
        }

        // console.log(result);
        var arrary = Array.from(result.recordset);
        var resultArr = new Array();

        arrary.forEach(function(value, index){
            resultArr.push({
                // "companyId" : value.customer == null ? "" : value.customer,
                "batchNo" :value.vat_no == null ? "" : value.vat_no.toString().trim(),
                "contract_no" :  value.contract_no == null ? "" : value.contract_no.toString().trim(),
                // "internalOrderNo" : ,
                "batchDate" : value.billdate == null ? "" : value.billdate.toString().trim(),
                "styleNo" : value.cust_styleno == null ? "" : value.cust_styleno.toString().trim(),
                "width" : value.width == null ? "" : value.width.toString().trim(),
                // "gramWeight" : ,
                "customer" :value.customer == null ? "" : value.customer.toString().trim(),
                // "weight" :"",
                "fabricType" : value.fabric_name == null ? "" : value.fabric_name.toString().trim(),
                "quantity":value.quantity == null ? "" : value.quantity.toString().trim(),
                "remark":value.notes == null ? "" : value.notes.toString().trim(),
                "color": value.color == null ? "" : value.color.toString().trim(),
                // "colorCode":,
                "processNames": value.process == null ? "" : value.process.toString().trim(),
                // "data":,
                // "deliverDate":
                
            })

        })
        res.send({
            "code": 1,
            "msg": "操作成功",
            "data": resultArr
        });
        return;
    });

});



module.exports = router;
