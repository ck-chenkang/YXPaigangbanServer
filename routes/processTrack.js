const { time } = require('console');
var express = require('express');
var router = express.Router();
var path = require('path');

var db = require('../lib/processTrackdb');
var log = require('../lib/processTrackLog');
var dateTime = require("../lib/currentTime");


/* GET  获取订单列表 */
router.get('/list', function (req, res, next) {

    let reqParams = req.query;
    let pattern = /(((\d{4})-(0[13578]|1[02])-(0[1-9]|[12]\d|3[01]))|((\d{4})-(0[469]|11)-(0[1-9]|[12]\d|30))|((\d{4})-(02)-(0[1-9]|1\d|2[0-8]))|((\d{2}(0[48]|[2468][048]|[13579][26]))-(02)-(29))|(((0[48]|[2468][048]|[13579][26])00)-(02)-(29)))/;

    //判断 参数是否存在
    if (reqParams.startDate == undefined && reqParams.endDate == undefined) {
        reqParams.startDate = '1970-01-01';
        reqParams.endDate = dateTime.currentDate;
        /*         res.send(
                    {
                        "code": 0,
                        "msg": "Error: \'startDate\' 或者 \'endDate\' 没定义 !",
                        "data": ""
                    }
                );
                return; */
    }

    // 判断 时间格式是否为"2020-01-01"
    if (!pattern.test(reqParams.startDate) || !pattern.test(reqParams.endDate)) {
        res.send({
            "code": 2,
            "msg": "Error：\'startDate\' 或者 \'endDate\' 格式错误，正确格式为: \'xxxx-xx-xx\' ",
            "data": ""
        });
        return;
    }


    // 判断 开始日期是否比结束日期小
/*     if (reqParams.endDate <= reqParams.startDate) {
        res.send({
            "code": 2,
            "msg": "Error：\'startDate\' 要小于 \'endDate\'",
            "data": ""
        });
        return;
    } */

    let sql = `SELECT
            RTRIM(hbdns.job_no) AS cylinderNumber,--缸号 
            RTRIM(hbdns.intime) AS billingDate,--开单日期
            RTRIM(hbdns.customer) AS customer,--客户名称
            RTRIM(hbdns.color_no) AS colorNumber,--色号
            RTRIM(hbdns.color) AS color,--颜色
            RTRIM(hbdns.fabric) AS clothType,--布种
            RTRIM(hbdns.remark) AS remark,--评论
            RTRIM(hbdns.require) AS require,--要求
            RTRIM(hbdns.indepart) AS currentProcess,--当前打卡工序
            RTRIM(hbdns.inuser) AS processPerson--,--责任人
            -- RTRIM(hbdnsskill.skill) AS technology
            FROM
                hbdns 
                -- LEFT JOIN hbdnsskill on hbdns.job_no = hbdnsskill.job_no
            WHERE
                hbdns.intime BETWEEN '` + reqParams.startDate + `' 
                AND '` + reqParams.endDate + `'
                AND hbdns.indepart NOT LIKE '%成品出库%'
            ORDER BY
                hbdns.intime DESC`;

    console.log(sql);
    db.sqlexe(sql, function (err, result) {
        if (err) {
            let errorPath = path.join(__dirname, "../errorLog/processTrackError.txt");
            log.writeError(errorPath, err);
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
        // var midStr = "";
        var initJob_no = "";

        arrary.forEach(function (value, index) {
            // if (index == 0) {
            // initJob_no = value.cylinderNumber;
            // midStr += value.technology;
            // } else {
            // if (initJob_no == value.cylinderNumber) {
            // midStr += ",";
            // midStr += value.technology;
            // } else {
            initJob_no = value.cylinderNumber;
            resultArr.push({
                "cylinderNumber": initJob_no,
                // "technology": midStr,
                "billingDate": value.billingDate == null ? "" : value.billingDate,
                "color": value.color == null ? "" : value.color,
                "colorNumber": value.colorNumber == null ? "" : value.colorNumber,
                "currentProcess": value.currentProcess == null ? "" : value.currentProcess,
                "customer": value.customer == null ? "" : value.customer,
                "clothType": value.clothType == null ? "" : value.clothType, 
                "processPerson": value.processPerson == null ? "" : value.processPerson,
                "remark": value.remark == null ? "" : value.remark,
                "require": value.require == null ? "" : value.require
            });

            // midStr = value.technology;
            // }
            // }
        });

        res.send({
            "code": 1,
            "msg": "操作成功",
            "data": {
                "count": resultArr.length,
                "list": resultArr
            }
        });
        return;
    });
});

/* GET  获取订单详情 */
router.get('/content', function (req, res, next) {

    let reqParams = req.query;

    if (reqParams.cylinderNumber == undefined) {
        res.send(
            {
                "code": 0,
                "msg": "Error: \'cylinderNumber(缸号)\' 没定义 !",
                "data": ""
            }
        );
        return;
    }

    let sql = `SELECT
                    RTRIM( hbdns.job_no ) AS cylinderNumber,--缸号
                    RTRIM( hbdns.intime ) AS billingDate,--开单日期
                    RTRIM( hbdns.customer ) AS customer,--客户名称
                    RTRIM( hbdns.color_no ) AS colorNumber,--色号
                    RTRIM( hbdns.color ) AS color,--颜色
                    RTRIM( hbdns.fabric ) AS clothType,--布种
                    RTRIM( hbdns.remark ) AS remark,--评论
                    RTRIM( hbdns.require ) AS require,--要求
                    RTRIM( hbdns.indepart ) AS currentProcess,--当前打卡工序
                    RTRIM( hbdns.inuser ) AS processPerson-- ,--责任人
                    -- RTRIM( hbdnsskill.skill ) AS technology 
                FROM
                    hbdns
                    LEFT JOIN hbdnsskill ON hbdns.job_no = hbdnsskill.job_no 
                WHERE
                    hbdns.job_no = '`+ reqParams.cylinderNumber + `' 
                ORDER BY
                    hbdns.intime DESC`;

    db.sqlexe(sql, function (err, result) {
        if (err) {
            let errorPath = path.join(__dirname, "../errorLog/processTrackError.txt");
            log.writeError(errorPath, err);
            // console.log(err);
            res.send({
                "code": 0,
                "msg": "sql语句执行失败:\n" + err.message + "\n" + err.stack + "\n",
                "data": ""
            });
            return;
        }

        var arrary = Array.from(result.recordset);
        var midObj = {};
        // var midStr = "";
        arrary.forEach(function(value, index){
            midObj.cylinderNumber = value.cylinderNumber == null ? "":value.cylinderNumber;
            midObj.billingDate = value.billingDate == null ? "":value.billingDate;
            midObj.customer = value.customer == null ? "":value.customer;
            midObj.colorNumber = value.colorNumber == null ? "":value.colorNumber;
            midObj.color = value.color == null ? "":value.color;
            midObj.clothType = value.clothType == null ? "":value.clothType;
            midObj.remark = value.remark == null ? "":value.remark;
            midObj.require = value.require == null ? "":value.require;
            midObj.currentProcess = value.currentProcess == null ? "":value.currentProcess;
            midObj.processPerson = value.processPerson == null ? "":value.processPerson;
        });
        res.send({
            "code": 1,
            "msg": "操作成功",
            "data": midObj
        });
        return;
    });
});


/* GET  根据缸号获取订单对应的完整工序*/
router.get('/completeProcess', function (req, res, next) {

    let reqParams = req.query;

    if (reqParams.cylinderNumber == undefined) {
        res.send(
            {
                "code": 0,
                "msg": "Error: \'cylinderNumber(缸号)\' 没定义 !",
                "data": ""
            }
        );
        return;
    }

    let sql = `SELECT
                    RTRIM( hbdns.job_no ) AS cylinderNumber,--缸号
                    RTRIM( hbdns.intime ) AS billingDate,--开单日期
                    RTRIM( hbdns.customer ) AS customer,--客户名称
                    RTRIM( hbdns.color_no ) AS colorNumber,--色号
                    RTRIM( hbdns.color ) AS color,--颜色
                    RTRIM( hbdns.fabric ) AS clothType,--布种
                    RTRIM( hbdns.remark ) AS remark,--评论
                    RTRIM( hbdns.require ) AS require,--要求
                    RTRIM( hbdns.indepart ) AS currentProcess,--当前打卡工序
                    RTRIM( hbdns.inuser ) AS processPerson,--责任人
                    RTRIM( hbdnsskill.skill ) AS technology 
                FROM
                    hbdns
                    LEFT JOIN hbdnsskill ON hbdns.job_no = hbdnsskill.job_no 
                WHERE
                    hbdns.job_no = '`+ reqParams.cylinderNumber + `' 
                ORDER BY
                    hbdns.intime DESC`;

    db.sqlexe(sql, function (err, result) {
        if (err) {
            let errorPath = path.join(__dirname, "../errorLog/processTrackError.txt");
            log.writeError(errorPath, err);
            // console.log(err);
            res.send({
                "code": 0,
                "msg": "sql语句执行失败:\n" + err.message + "\n" + err.stack + "\n",
                "data": ""
            });
            return;
        }

        var arrary = Array.from(result.recordset);
        var midStr = "";

        arrary.forEach(function (value, index) {
            let str = value.technology == null ? "": value.technology;
            if (index != arrary.length - 1) {
                midStr += str
                midStr += ",";
            } else {
                midStr += str;
            }
        });

        var midArr = midStr.split(",");
        var returnArr = [];

        midArr.forEach(function (value) {
            returnArr.push({ "name": value == null ? "" : value });
        });

        res.send({
            "code": 1,
            "msg": "操作成功",
            "data":
            {
                "list": returnArr
            }
        });
        return;
    });
});

/* GET  根据缸号获取订单对应的工序操作流程  打卡*/
router.get('/process/list', function (req, res, next) {

    let reqParams = req.query;

    if (reqParams.cylinderNumber == undefined) {
        res.send(
            {
                "code": 0,
                "msg": "Error: \'cylinderNumber(缸号)\' 没定义 !",
                "data": ""
            }
        );
        return;
    }

    let sql = `SELECT
                    RTRIM( hbdnsskill.skill ) AS name,
                    RTRIM( hbdnsskill.okdate ) AS createTime--缸号
                FROM
                    hbdnsskill 
                WHERE
                    hbdnsskill.job_no = '` + reqParams.cylinderNumber + `' 
                ORDER BY
                    hbdnsskill.recno`;

    db.sqlexe(sql, function (err, result) {
        if (err) {
            let errorPath = path.join(__dirname, "../errorLog/processTrackError.txt");
            log.writeError(errorPath, err);
            // console.log(err);
            res.send({
                "code": 0,
                "msg": "sql语句执行失败:\n" + err.message + "\n" + err.stack + "\n",
                "data": ""
            });
            return;
        }

        var arrary = Array.from(result.recordset);
        var returnArr = [];

        arrary.forEach(function (value, index) {
            if(value.createTime != null){
                returnArr.push({
                    "name": value.name == null ? "": value.name,
                    "processPerson": "管理员",
                    "createTime": value.createTime
                });
            }
        }
        );

        res.send({
            "code": 1,
            "msg": "操作成功",
            "data":
            {
                "list": returnArr
            }
        });
        return;
    });
});

module.exports = router;
