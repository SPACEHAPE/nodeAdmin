const cors = require("cors");
const express = require('express');
const bodyParser = require('body-parser')
const query = require('./mysql');
const Cookies = require("cookies")

const apiRouter = require('./routes/apiRouter');
const paymentRouter = require('./routes/paymentRouter')
const userRouter = require('./routes/user');
const sportsActivityRouter = require('./routes/sports-activity');
const baseInfo = require('./routes/baseInfo')
const commonInfo = require('./routes/commonInfo')
const app = express();
const port = 80;

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const corsOptions = {
   origin:'*',
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
};

app.use(cors(corsOptions)); // Use this after the variable declaration
app.use(express.static('media'));
app.use(express.json());



app.get('/', (req, res) => {
	res.sendFile(__dirname + '/media/home.html');
	console.log('Request for home page received.');
	return;
});

app.get('/media/cirno.gif', (req, res) => {
	res.sendFile(__dirname + '/media/cirno.gif');
	return;
});

app.get("/uploads/*", function (req, res) {
	res.sendFile( __dirname + "/" + req.url );
})



// 基础信息
app.get('/parkingLog', (req, res) => {
	const sql = `select t1.num1,t2.num2,t3.num3, t4.num4, t5.num5 from
	(select count(*) num1 from parking_list) t1,
	(select count(*) num2 from paylog_list) t2,
	(select count(*) num3 from repairreport_list) t3,
	(select count(*) num4 from owner_list) t4,
	(select count(*) num5 from building_list where buildType = '1' ) t5;`

	query(sql, function(error, results, fields){
		if(error) return;
		console.log(results)
		const data = [
			{name: '车位数量', value: results[0].num1},
			{name: '缴费记录', value: results[0].num2},
			{name: '投诉数', value: results[0].num3},
			{name: '业主户数', value: results[0].num4},
			{name: '房屋数', value: results[0].num5}
		]
		res.jsonp({
			code: 0,
			data,
			message: '成功'
		})
		return
	})
});

// welcome pie图表 /repairReport/pie
app.get('/repairReport/pie', (req, res) => {
	const sql = `select t1.num1,t2.num2,t3.num3, t4.num4 from
	(select count(*) num1 from parking_list) t1,
	(select count(*) num2 from paylog_list) t2,
	(select count(*) num3 from repairreport_list) t3,
	(select count(*) num4 from owner_list) t4;`

	query(sql, function(error, results, fields){
		if(error) return;
		console.log(results)
		const data = [
			{name: '车位数量', value: results[0].num1},
			{name: '缴费记录', value: results[0].num2},
			{name: '投诉数', value: results[0].num3},
			{name: '业主户数', value: results[0].num4}
		]
		res.jsonp({
			code: 0,
			data,
			message: '成功'
		})
		return
	})
	
})

// weclome 图表 
app.get('/payLog/bar', (req, res) => {
	const sql = `select t1.num1,t2.num2,t3.num3, t4.num4 from
	(select count(*) num1 from parking_list) t1,
	(select count(*) num2 from paylog_list) t2,
	(select count(*) num3 from repairreport_list) t3,
	(select count(*) num4 from owner_list) t4;`

	query(sql, function(error, results, fields){
		if(error) return;
		console.log(results)
		const data = [
			{name: '车位数量', value: results[0].num1},
			{name: '缴费记录', value: results[0].num2},
			{name: '投诉数', value: results[0].num3},
			{name: '业主户数', value: results[0].num4}
		]
		res.jsonp({
			code: 0,
			data,
			message: '成功'
		})
		return
	})
})

// 用户列表 
app.get('/getUser', (req, res) => {
	const cookies = new Cookies(req, res)
	const user_id = cookies.get("loginName")
	const sql = `select * from user_list where loginName like '${req.query.loginName}%' and realname like '${req.query.realname}%' limit ${(req.query.pageNo - 1) * req.query.pageSize}, ${req.query.pageSize}`
	const sql2 = `select count(*) from user_list;`
	
	query(sql, function (error, results, fields) {
		if (error){ 
			console.log(error)
			return 
		};
		query(sql2, function (errorCount, resultsCount, fields) {
			if (error){ 
				console.log(error)
				return 
		    };
			res.jsonp({
				code: 0,
				message: '成功',
				recordsTotal: resultsCount[0]['count(*)'],
				data: results
			  })
			});
			// query(sql3, function (sql3Error, sql3Results, sql3Fields){
			// 	console.log(sql3Results)
			// 	const arr = []
			// 	sql3Results.forEach(element => {
			// 		if(!arr.includes(element.loginName)) { 
			// 			arr.push(element.loginName) 
			// 		} else {
			// 			res.jsonp({
			// 				code: -1,
			// 				message: '新增失败，用户名已存在',
			// 				data: []
			// 			  })
			// 			  return
			// 		}
			// 	});
			// 	res.jsonp({
			// 		code: 0,
			// 		message: '成功',
			// 		recordsTotal: resultsCount[0]['count(*)'],
			// 		data: results
			// 	  })
			// 	});
		    // })
			
		})
})

app.use('/userList', apiRouter);
app.use('/login', userRouter);
app.use('/payment', paymentRouter);
app.use('/sports-activity', sportsActivityRouter);
app.use('/baseInfo', baseInfo);
app.use('/commonInfo', commonInfo);

app.listen(port, () => {console.log(`Now Listening on port: ${port}\nPress ctrl-c to exit.`)})
