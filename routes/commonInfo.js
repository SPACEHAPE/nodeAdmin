const axios = require('axios');
require('dotenv').config();
const express = require('express');
const router = express.Router();
const query = require('../mysql');
const Cookies = require("cookies")
const moment = require('moment');
//上传图片的模板
var multer=require('multer');
//生成的图片放入uploads文件夹下
// 设置图片存储路径
var storage = multer.diskStorage({
	destination: function (req, file, cb) {
	  cb(null, './uploads'); // ../uploads是将存放图片文件夹创建在node项目平级，./uploads会存放在node项目根目录下，需要提前建好文件夹，否则会报错
	},
	filename: function (req, file, cb) {
	  cb(null, `${Date.now()}-${file.originalname}`) // 文件名
	}
  })
  // 添加配置文件到muler对象。
  var upload = multer({ storage: storage });

// 公告信息管理 
router.get('/announcement', (req, res) => {
    const { pageNo, pageSize, title } = req.query
    const cookies = new Cookies(req, res)
    const loginName = cookies.get("loginName") 
    let totalSql = `select count(*) from announcement_list where loginName = '${loginName}';`
    let sql = `select * from announcement_list where title like '${title}%'  limit ${(pageNo - 1) * pageSize}, ${pageSize};`
    // if(loginName === 'admin') {
    //     totalSql = `select count(*) from announcement_list;`
    //     sql = `select * from announcement_list where title like '${title}%'  limit ${(pageNo - 1) * pageSize}, ${pageSize};`
    // }
    query(sql, function (error, results, fields) {
     if (error) {
         console.log(error)
         return
     };
     query(totalSql, function(errorCount, resultsCount, fields) {
         if(error) return;
         res.jsonp({
             code: 0,
             message: '成功',
             recordsTotal: resultsCount[0]['count(*)'],
             data: results
         })
         return
     })
     });
})


// 图片上传 /file/upload
router.post("/file/upload", upload.single('file'), (req, res) => {
	res.json({
		code: 200,
		data: {
		  img: `http://localhost:80/uploads/${req.file.filename}`
		},
		msg: '上传成功'
	})
	return
})

// 公告信息新增
router.post('/announcement', (req, res) => {
    const { content, title, face } = req.body
    console.log(face.img)
    const imageUrl = face.img
    const cookies = new Cookies(req, res)
    const loginName = cookies.get("loginName")
    const publishTimeNString = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
    const sql = `insert into announcement_list(loginName, content, title, publishTimeNString, publisher, reviseTimeString, reviser, imageUrl ) values(?,?,?,?,?,?,?,?)`;
    const option = [loginName,content, title,publishTimeNString, loginName, publishTimeNString, loginName,imageUrl]
    query(sql, option, function (error, results, fields) {
     if (error) {
        console.log(error)
         return
     };
         res.jsonp({
             code: 0,
             message: '新增成功',
             data: results
         })
         return
     });
})

 // 修改公告信息
 router.put('/announcement', async (req, res) => {
     const { content, title, id, face } = req.body
     const imageUrl = face.img
    const cookies = new Cookies(req, res)
    const loginName = cookies.get("loginName")
    const publishTimeNString = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
    const sql = `update announcement_list set content = ?, title = ?,reviseTimeString = ?, reviser = ?, imageUrl = ? where id = ?`;
    const option = [content, title,publishTimeNString, loginName,imageUrl, id ]
	query(sql, option, function(error, results, fields) {
		if (error) {
            console.log(error)
			res.jsonp({
				code: 0,
				data: [],
				message: '修改失败'
			})
		} else {
			res.jsonp({
				code: 0,
				data: [],
				message: '修改成功'
			})
		}
		return
	})
})

// 公告信息删除
router.delete('/announcement/:id', (req, res) => {
    let sql = `DELETE FROM announcement_list WHERE id = ?`;
	const option = req.params.id
    query(sql, option, function (error, results, fields) {
     if (error) {
         return
     };
         res.jsonp({
             code: 0,
             message: '删除成功',
             data: results
         })
         return
     });
 })

// 保修信息管理  
router.get('/repairReport', (req, res) => {
    const { pageNo, pageSize, reporter, type } = req.query
    const cookies = new Cookies(req, res)
    const loginName = cookies.get("loginName") 
    let totalSql = `select count(*) from repairReport_list where loginName = '${loginName}';`
    let sql = `select * from repairReport_list where ${loginName ? `loginName = '${loginName}'` : ''} ${reporter ? `and reporter like '${reporter}%'` : ''} ${type ? `and type = '${type}'` : ''} limit ${(pageNo - 1) * pageSize} , ${pageSize};`
    if(loginName === 'admin') {
        totalSql = `select count(*) from announcement_list;`
        sql = `select * from repairReport_list where reporter like '${reporter}%' ${type ? `and type = '${type}'` : ''}  limit ${(pageNo - 1) * pageSize}, ${pageSize};`
    }
    query(sql, function (error, results, fields) {
     if (error) {
         console.log(error)
         return
     };
     query(totalSql, function(errorCount, resultsCount, fields) {
         if(error) return;
         res.jsonp({
             code: 0,
             message: '成功',
             recordsTotal: resultsCount[0]['count(*)'],
             data: results
         })
         return
     })
         
     });
})

// 保修信息新增
router.post('/repairReport', (req, res) => {
    const { address, content, detail, type } = req.body
    const cookies = new Cookies(req, res)
    const loginName = cookies.get("loginName")
    const timeString = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
    const sql = `insert into repairReport_list(loginName, address, content, detail, reporter, timeString, status, handleTimeString, type) values(?,?,?,?,?,?,?,?,?)`;
    const option = [loginName, address, content, detail, loginName, timeString, '未修复', '三天内', type]
    query(sql, option, function (error, results, fields) {
     if (error) {
        console.log(error)
         return
     };
         res.jsonp({
             code: 0,
             message: '新增成功',
             data: results
         })
         return
     });
})

 // 处理
 router.put('/repairReport', async (req, res) => {
	const { status, id } = req.body
    const cookies = new Cookies(req, res)
    const loginName = cookies.get("loginName")
    const handleTimeString = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
    const sql = `update repairReport_list set status = ?, handleTimeString = ?,loginName = ? where id = ?`;
    const option = [status, handleTimeString, loginName, id ]
	query(sql, option, function(error, results, fields) {
		if (error) {
            console.log(error)
			res.jsonp({
				code: 0,
				data: [],
				message: '修改失败'
			})
		} else {
			res.jsonp({
				code: 0,
				data: [],
				message: '修改成功'
			})
		}
		return
	})
})

// 公告信息删除
router.delete('/repairReport/:id', (req, res) => {
    let sql = `DELETE FROM repairReport_list WHERE id = ?`;
	const option = req.params.id
    query(sql, option, function (error, results, fields) {
     if (error) {
         return
     };
         res.jsonp({
             code: 0,
             message: '删除成功',
             data: results
         })
         return
     });
 })


// 投诉信息 
router.get('/complaint', (req, res) => {
    res.jsonp({
        code: 0,
        data: [
            {id: 1, reporter: '李四', title: '报修1', timeString: '2022/04/16', address: '10栋二单元2003', status: '未修复', handler: '水电1', handleTimeString: '2022/04/16'},
            {id: 2, reporter: '王武', title: '报修2', timeString: '2022/02/16', address: '11栋二单元0203', status: '已修复', handler: '水电2', handleTimeString: '2022/03/16'},
            {id: 3, reporter: '李三', title: '报修3', timeString: '2022/02/16', address: '9栋一单元1601', status: '已修复', handler: '水电3', handleTimeString: '2022/04/26'},
            {id: 4, reporter: '李六', title: '报修4', timeString: '2021/02/16', address: '3栋一单元1604', status: '已修复', handler: '水电4', handleTimeString: '2022/04/06'},
        ],
        recordsTotal: 4,
        message: '成功'
    })
    return
})

// 宠物信息 pet
router.get('/pet', (req, res) => {
    const { pageNo, pageSize, owner } = req.query
    const cookies = new Cookies(req, res)
    const loginName = cookies.get("loginName") 
    let totalSql = `select count(*) from pet_list where loginName = '${loginName}';`
    let sql = `select * from pet_list where ${loginName ? `loginName = '${loginName}'` : ''} ${owner ? `and owner like '${owner}%'` : ''} limit ${(pageNo - 1) * pageSize} , ${pageSize};`
    if(loginName === 'admin') {
        totalSql = `select count(*) from pet_list;`
        sql = `select * from pet_list where owner like '${owner}%'  limit ${(pageNo - 1) * pageSize}, ${pageSize};`
    }
    query(sql, function (error, results, fields) {
     if (error) {
         console.log(error)
         return
     };
     query(totalSql, function(errorCount, resultsCount, fields) {
         if(error) return;
         res.jsonp({
             code: 0,
             message: '成功',
             recordsTotal: resultsCount[0]['count(*)'],
             data: results
         })
         return
     })   
     });
})

// 宠物信息新增
router.post('/pet', (req, res) => {
    const { pageNo, pageSize, type, name, age } = req.body
    const cookies = new Cookies(req, res)
    const loginName = cookies.get("loginName")
    const timeString = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
    const sql = `insert into pet_list(loginName, type, name, age, owner, registerDateTString) values(?,?,?,?,?,?)`;
    const option = [loginName, type, name, age, loginName, timeString]
    query(sql, option, function (error, results, fields) {
     if (error) {
        console.log(error)
         return
     };
         res.jsonp({
             code: 0,
             message: '新增成功',
             data: results
         })
         return
     });
})

 // 处理
 router.put('/pet', async (req, res) => {
	const { status, id,  type, name, age } = req.body
    const cookies = new Cookies(req, res)
    const loginName = cookies.get("loginName")
    const handleTimeString = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
    const sql = `update pet_list set type = ?,name=?, age=?,loginName = ? where id = ?`;
    const option = [type, name, age, loginName, id ]
	query(sql, option, function(error, results, fields) {
		if (error) {
            console.log(error)
			res.jsonp({
				code: 0,
				data: [],
				message: '修改失败'
			})
		} else {
			res.jsonp({
				code: 0,
				data: [],
				message: '修改成功'
			})
		}
		return
	})
})

// 错误信息删除
router.delete('/pet/:id', (req, res) => {
    let sql = `DELETE FROM pet_list WHERE id = ?`;
	const option = req.params.id
    query(sql, option, function (error, results, fields) {
     if (error) {
         return
     };
         res.jsonp({
             code: 0,
             message: '删除成功',
             data: results
         })
         return
     });
 })



// 保安执勤管理
router.get('/securityDuty', (req, res) => {
    const { pageNo, pageSize, securityStaffName, company } = req.query
    const cookies = new Cookies(req, res)
    const loginName = cookies.get("loginName") 
    let totalSql = `select count(*) from securityduty_list;`
    let sql = `select * from securityduty_list where securityStaffName like '${securityStaffName}%' ${company ? `and company like '${company}%'` : ''} limit ${(pageNo - 1) * pageSize} , ${pageSize};`
    // if(loginName === 'admin') {
    //     totalSql = `select count(*) from securityduty_list;`
    //     sql = `select * from securityduty_list where securityStaffName like '${securityStaffName}%' ${company ? `and company like '${company}%'` : ''} limit ${(pageNo - 1) * pageSize} , ${pageSize};`
    // }
    query(sql, function (error, results, fields) {
     if (error) {
         console.log(error)
         return
     };
     query(totalSql, function(errorCount, resultsCount, fields) {
         if(error) return;
         res.jsonp({
             code: 0,
             message: '成功',
             recordsTotal: resultsCount[0]['count(*)'],
             data: results
         })
         return
     })   
     });
})


// 保安执勤管理新增
router.post('/securityDuty', (req, res) => {
    const { company, securityStaffName, timeRange } = req.body
    const cookies = new Cookies(req, res)
    const loginName = cookies.get("loginName")
    const sql = `insert into securityduty_list(loginName, company, securityStaffName, timeRange) values(?,?,?,?)`;
    const option = [loginName, company, securityStaffName, timeRange]
    query(sql, option, function (error, results, fields) {
     if (error) {
        console.log(error)
         return
     };
         res.jsonp({
             code: 0,
             message: '新增成功',
             data: results
         })
         return
     });
})


 // 编辑
 router.put('/securityDuty', async (req, res) => {
	const {  company, securityStaffName, timeRange, id } = req.body
    const cookies = new Cookies(req, res)
    const sql = `update securityduty_list set company = ?,securityStaffName=?, timeRange=? where id = ?`;
    const option = [company, securityStaffName, timeRange, id]
	query(sql, option, function(error, results, fields) {
		if (error) {
            console.log(error)
			res.jsonp({
				code: 0,
				data: [],
				message: '修改失败'
			})
		} else {
			res.jsonp({
				code: 0,
				data: [],
				message: '修改成功'
			})
		}
		return
	})
})

// 错误信息删除
router.delete('/securityDuty/:id', (req, res) => {
    let sql = `DELETE FROM securityduty_list WHERE id = ?`;
	const option = req.params.id
    query(sql, option, function (error, results, fields) {
     if (error) {
         return
     };
         res.jsonp({
             code: 0,
             message: '删除成功',
             data: results
         })
         return
     });
 })




// 转租管理 
router.get('/subleaseLog', (req, res) => {
    res.jsonp({
        code: 0,
        data: [
            {id: 1, house: 'A1栋', realname: '李四', tel:'888888', tenantName: 'JEFFERY', tenantTel: '旺财', purpose: '自助', status: '已出租', deliveryDateString: '2022/04/16'},
            {id: 2, house: '王武', realname: '华泰',  tel:'111111', tenantName: 'TOM', tenantTel: '水电2', purpose:"商业活动",status: '待出租', deliveryDateString: '2022/03/16'},
            {id: 3, house: '李三', realname: '泰安',  tel:'666666',  tenantName: 'TOMS', tenantTel: '水电3',purpose:"自助",  status: '已出租',deliveryDateString: '2022/04/26'},
            {id: 4, house: '李六', realname: '安谋',  tel:'555555',  tenantName: '阿黄',  tenantTel: '水电4', purpose:"商业活动",status: '未出租', deliveryDateString: '2022/04/06'},
        ],
        recordsTotal: 4,
        message: '成功'
    })
    return
})

// 疫情防控 
router.get('/antiepidemicLog', (req, res) => {
    res.jsonp({
        code: 0,
        data: [
            {id: 1, people: 'A1栋', realname: '李四', address:'武汉', healthCodeColor: '绿码', otherCityReturnString: '是', returnCity: '上海', temperature: '36.5', registerTimeNString: '2022/04/16'},
            {id: 2, people: '王武', realname: '华泰',  address:'长沙', healthCodeColor: '绿码', otherCityReturnString: '否', returnCity:"上海", temperature: '36.7', registerTimeNString: '2022/03/16'},
            {id: 3, people: '李三', realname: '泰安',  address:'上海',  healthCodeColor: '黄码', otherCityReturnString: '是',returnCity:"北京",  temperature: '36.6',registerTimeNString: '2022/04/26'},
            {id: 4, people: '李六', realname: '安谋',  address:'北京',  healthCodeColor: '绿码',  otherCityReturnString: '是', returnCity:"北京",temperature: '36.4', registerTimeNString: '2022/04/06'},
        ],
        recordsTotal: 4,
        message: '成功'
    })
    return
})
module.exports = router;