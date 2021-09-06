   //串行执行函数
   var tasks = [];

   function addTask(task){
       tasks.push(task);
   }

   function next(){
       if(tasks.length > 0){
           tasks.shift()();
   }else{
           return;
   }
   }

   //获取 对应时间内的job_no
   let sql = "select job_no from hbdns where intime between \'"  + reqParams.startDate + "\' and \'" + reqParams.endDate + "\' order by intime desc";
   var acceptJobNo = function(err, result){
       if (err) {
           console.log("sql错误", err);
       }

       let arrary1 = Array.from(result.recordset);
       let list1 = new Array();

       arrary1.forEach(function(value1, index){
           // 获取 job_no对应的工序
           let job_no = value1.job_no;
           job_no = job_no.trim();
           list1.push(job_no);
   }
   
   var function1 = db.sqlexe(sql, function (err, result) {
       if (err) {
           console.log("sql错误", err);
       }

       let arrary1 = Array.from(result.recordset);
       let list1 = new Array();

       arrary1.forEach(function(value1, index){
           // 获取 job_no对应的工序
           let job_no = value1.job_no;
           job_no = job_no.trim();
           list1.push(job_no);
           // let sql2 = "select skill from hbdnsskill where job_no = \'" + job_no + "\'";
           // db.sqlexe(sql2, function(err, result2){
           //     if (err) {
           //         console.log("sql错误", err);
           //     }
           //     let arrary2 = Array.from(result2.recordset);
           //     let midstr = "";
           //     arrary2.forEach(function(value2, index){
           //         midstr += value2.skill;
           //         midstr = midstr.trim();
           //         midstr += " ";
           //     });
           //     list.push(midstr);
           // });
       });

       // let sql3 = "SELECT\
       //         hbdns.job_no AS cylinderNumber,--缸号\
       //         hbdns.intime AS billingDate,--开单日期\
       //         hbdns.customer AS customer,--客户名称\
       //         hbdns.color_no AS colorNumber,--色号\
       //         hbdns.color AS color,--颜色\
       //         hbdns.fabric,--布种\
       //         hbdns.remark,--评论\
       //         hbdns.require,--要求\
       //         hbdns.indepart AS currentProcess,--当前打卡工序\
       //         hbdns.inuser processPerson --责任人\
       //         FROM\
       //             hbdns\
       //         WHERE\
       //             hbdns.intime BETWEEN '2020-11-20'\
       //             AND '2020-11-24' \
       //         ORDER BY\
       //             hbdns.intime DESC";

       // console.log(list);
       // console.log(list.length);
   });
   


   

   let sql2 = "select skill from hbdnsskill where job_no = \'" + job_no + "\'";
   db.sqlexe(sql2, function (err, result) {
       if (err) {
           console.log("sql错误", err);
       }

       let arrary1 = Array.from(result.recordset);
       let list1 = new Array();

       arrary1.forEach(function(value1, index){
           // 获取 job_no对应的工序
           let job_no = value1.job_no;
           job_no = job_no.trim();
           list1.push(job_no);
       })
   });