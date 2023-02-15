const axios = require('axios');
require('dotenv').config();
const express = require('express');
const router = express.Router();
const query = require('../mysql');
const Cookies = require("cookies")

router.get('/building', (req, res) => {
   const { pageNo, pageSize, name, type } = req.query
   const cookies = new Cookies(req, res)
   const loginName = cookies.get("loginName") 
   totalSql = `select count(*) from building_list where buildType = '1';`
   sql = `select * from building_list where buildType = '1' ${name ? `and name like '${name}%'` : ''}  ${ type ? `and type = '${type}'` : ''}  limit ${(pageNo - 1) * pageSize} , ${pageSize};`
//   if(loginName === 'admin') {
//     totalSql = `select count(*) from building_list where buildType = '1';`
//     sql = `select * from building_list where buildType = '1' ${name ? `and name like '${name}%'` : ''}  ${ type ? `and type = '${type}'` : ''}  limit ${(pageNo - 1) * pageSize} , ${pageSize};`
//    }
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
// 楼宇新增
router.post('/building', (req, res) => {
    const { name, type } = req.body
    const cookies = new Cookies(req, res)
    const loginName = cookies.get("loginName") 
    const sql = `insert into building_list(type, loginName, name, buildType) values(?,?,?,?)`;
    const option = [type, loginName, name, '1' ]
    query(sql, option, function (error, results, fields) {
     if (error) {
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
// 楼宇删除
 router.delete('/building/:id', (req, res) => {
    let sql = `DELETE FROM building_list WHERE id = ?`;
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

 // 修改楼宇信息
router.put('/building', async (req, res) => {
	const sql = `update building_list set name = ?, type = ? where id = ?`;
	const {name, type, id} = req.body
	const option = [name, type, id]
	query(sql, option, function(error, results, fields) {
		if (error) {
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

// 单元楼
router.get('/buildingUnit', (req, res) => {
    const { pageNo, pageSize, name, buildingId } = req.query
    const cookies = new Cookies(req, res)
    const loginName = cookies.get("loginName") 
    // let totalSql = `select count(*) from building_list where loginName = '${loginName}' and buildType = '2';`
    // let sql = `select * from building_list where ${loginName ? `loginName = '${loginName}'` : ''} and buildType = '2' ${name ? `and name like '${name}%'` : ''}  ${ buildingId ? `and buildingId like '${buildingId}%'` : ''}  limit ${(pageNo - 1) * pageSize} , ${pageSize};`
    // if(loginName === 'admin') {
    //     totalSql = totalSql = `select count(*) from building_list where buildType = '2';`
    //     sql = `select * from building_list where buildType = '2' ${name ? `and name like '${name}%'` : ''}  ${ buildingId ? `and buildingId like '${buildingId}%'` : ''}  limit ${(pageNo - 1) * pageSize} , ${pageSize};`
    //    }
    let totalSql = `select count(*) from building_list where buildType = '2';`
    let sql = `select * from building_list where buildType = '2' ${name ? `and name like '${name}%'` : ''}  ${ buildingId ? `and buildingId like '${buildingId}%'` : ''}  limit ${(pageNo - 1) * pageSize} , ${pageSize};`
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

// 编辑
router.put('/buildingUnit', (req, res) => {
    const sql = `update building_list set name = ?, buildingId = ? where id = ?`;
	const {name, buildingId, id} = req.body
	const option = [name, buildingId, id]
	query(sql, option, function(error, results, fields) {
		if (error) {
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


//单元楼宇新增
router.post('/buildingUnit', (req, res) => {
    const { name, buildingId } = req.body
    const cookies = new Cookies(req, res)
    const loginName = cookies.get("loginName") 
    const sql = `insert into building_list(buildingId, loginName, name, buildType) values(?,?,?,?)`;
    const option = [buildingId, loginName, name, '2' ]
    query(sql, option, function (error, results, fields) {
     if (error) {
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

// 单元楼宇删除
 router.delete('/buildingUnit/:id', (req, res) => {
    let sql = `DELETE FROM building_list WHERE id = ?`;
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

// 查询
router.get('/house', (req, res) => {
    const { pageNo, pageSize, building, buildingUnit,checkinUser, name } = req.query
    const cookies = new Cookies(req, res)
    const loginName = cookies.get("loginName") 
    let totalSql = `select count(*) from house_list where loginName = '${loginName}';`
    let sql = `select * from house_list where ${loginName ? `loginName = '${loginName}'` : ''} ${name ? `and name like '${name}%'` : ''} ${ building ? `and building = '${building}'` : ''} ${ buildingUnit ? `and buildingUnit = '${buildingUnit}'` : ''} ${ checkinUser ? `and checkinUser = '${checkinUser}'` : ''} limit ${(pageNo - 1) * pageSize} , ${pageSize};`
    if(loginName === 'admin') {
        totalSql = `select count(*) from house_list;`
        sql = `select * from house_list where name like '${name}%' ${ building ? `and building = '${building}'` : ''} ${ buildingUnit ? `and buildingUnit = '${buildingUnit}'` : ''} ${ checkinUser ? `and checkinUser = '${checkinUser}'` : ''} limit ${(pageNo - 1) * pageSize} , ${pageSize};`
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

// 新增
router.post('/house',(req, res) => {
    const { building, area, buildingUnit,checkinDate, checkinUser,name, purpose, tel  } = req.body
    const cookies = new Cookies(req, res)
    const loginName = cookies.get("loginName") 
    const sql = `insert into house_list(building, loginName, area, buildingUnit,checkinDate, checkinUser,name, purpose, tel) values(?,?,?,?,?,?,?,?,?)`;
    const option = [building, loginName, area, buildingUnit,checkinDate, checkinUser,name, purpose, tel]
    console.log(option)
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
     })
    }
)

// 修改
router.put('/house',(req, res) => {
    const { building, area, buildingUnit,checkinDate, checkinUser,name, purpose, tel, id  } = req.body
    const cookies = new Cookies(req, res)
    const loginName = cookies.get("loginName") 
    const sql = `update house_list set building = ?, area = ?, buildingUnit = ?,checkinDate=?, checkinUser=?, name=?, purpose=?, tel=? where id = ?`;
	const option = [building, area, buildingUnit,checkinDate, checkinUser,name, purpose, tel, id]
    console.log(option)
    query(sql, option, function (error, results, fields) {
     if (error) {
         console.log(error)
         return
     };
         res.jsonp({
             code: 0,
             message: '修改成功',
             data: results
         })
         return
     })
    }
)

// 单元楼宇删除
router.delete('/house/:id', (req, res) => {
    let sql = `DELETE FROM house_list WHERE id = ?`;
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


router.get('/suggest', (req, res) => {
    res.jsonp({
        code: 0,
        data: [
            {id: 1, realname: "项少龙" },
            {id: 2, realname: "赵盘" },
            {id: 3, realname: "李斯" },
            {id: 4, realname: "吕不韦" }
        ],
        recordsTotal: 4,
        message: '成功'
    })
    return
})

// 车位查询 
router.get('/parkingList', (req, res) => {
    const { pageNo, pageSize, name, holder,status } = req.query
    const cookies = new Cookies(req, res)
    const loginName = cookies.get("loginName") 
    let totalSql = `select count(*) from parking_list where loginName = '${loginName}';`
    let sql = `select * from parking_list where ${loginName ? `loginName = '${loginName}'` : ''} ${name ? `and name like '${name}%'` : ''} ${ holder ? `and holder = '${holder}'` : ''} ${ status ? `and status = '${status}'` : ''} limit ${(pageNo - 1) * pageSize} , ${pageSize};`
    if(loginName === 'admin') {
        totalSql = `select count(*) from parking_list;`
        sql = `select * from parking_list where name like '${name}%' ${ holder ? `and holder = '${holder}'` : ''} ${ status ? `and status = '${status}'` : ''} limit ${(pageNo - 1) * pageSize} , ${pageSize};`
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

// 车位新增
router.post('/parkingList',(req, res) => {
    const { name, holder, status } = req.body
    const cookies = new Cookies(req, res)
    const loginName = cookies.get("loginName") 
    const sql = `insert into parking_list(loginName, name, holder, status) values(?,?,?,?)`;
    const option = [loginName, name, holder, status]
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
     })
    }
)

// 车位修改
router.put('/parkingList',(req, res) => {
    const { name, holder, status, id } = req.body
    const cookies = new Cookies(req, res)
    const loginName = cookies.get("loginName")
    const sql = `update parking_list set name = ?, holder = ?, status = ? where id = ?`;
	const option = [name, holder, status, id]
    query(sql, option, function (error, results, fields) {
     if (error) {
         console.log(error)
         return
     };
        res.jsonp({
            code: 0,
            message: '修改成功',
            data: results
        })
        return
     })
    }
)

// 车位删除
router.delete('/parkingList/:id', (req, res) => {
    let sql = `DELETE FROM parking_list WHERE id = ?`;
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



// 业主信息管理
router.get('/woner', (req, res) => {
    const { pageNo, pageSize, realname } = req.query
    const cookies = new Cookies(req, res)
    const loginName = cookies.get("loginName") 
    let totalSql = `select count(*) from owner_list where loginName = '${loginName}';`
    let sql = `select * from owner_list where ${loginName ? `loginName = '${loginName}'` : ''} ${realname ? `and realname like '${realname}%'` : ''} limit ${(pageNo - 1) * pageSize} , ${pageSize};`
    if(loginName === 'admin') {
        totalSql = `select count(*) from owner_list;`
        sql = `select * from owner_list where realname like '${realname}%'  limit ${(pageNo - 1) * pageSize}, ${pageSize};`
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

// 业主新增
router.post('/woner',(req, res) => {
    const { checkinDateString, company, gender,house, parkingLot, realname, tel, userName } = req.body
    const cookies = new Cookies(req, res)
    const loginName = cookies.get("loginName") 
    const sql = `insert into owner_list(loginName, checkinDateString, company, gender,house, parkingLot, realname, tel, userName) values(?,?,?,?,?,?,?,?,?)`;
    const option = [loginName, checkinDateString, company, gender,house, parkingLot, realname, tel, userName]
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
     })
    }
)

// 业主修改修改
router.put('/woner',(req, res) => {
    const { checkinDateString, company, gender,house, parkingLot, realname, tel, userName, id } = req.body
    const cookies = new Cookies(req, res)
    const loginName = cookies.get("loginName")
    const sql = `update owner_list set checkinDateString = ?, company = ?, gender = ?, house = ?, parkingLot = ?, realname = ?, tel = ?, userName = ? where id = ?`;
	const option = [checkinDateString, company, gender,house, parkingLot, realname, tel, userName, id]
    query(sql, option, function (error, results, fields) {
     if (error) {
         console.log(error)
         return
     };
        res.jsonp({
            code: 0,
            message: '修改成功',
            data: results
        })
        return
     })
    }
)

// 业主删除
router.delete('/woner/:id', (req, res) => {
    let sql = `DELETE FROM owner_list WHERE id = ?`;
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


// 房屋option
router.get('/house/suggest', (req, res) => {
    res.jsonp({
        code: 0,
        data: [
            {id: 1, name: '0320'},
            {id: 2, name: '0321'},
            {id: 3, name: '0322'},
            {id: 3, name: '0323'},
        ],
        recordsTotal: 4,
        message: '成功'
    })
    return
})

// 停车位 '
router.get('/parkingLog/suggest', (req, res) => {
    res.jsonp({
        code: 0,
        data: [
            {id: 1, name: '0213'},
            {id: 2, name: '0214'},
            {id: 3, name: '0215'},
            {id: 3, name: '0216'},
        ],
        recordsTotal: 4,
        message: '成功'
    })
    return
})


module.exports = router;