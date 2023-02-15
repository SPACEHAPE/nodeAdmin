require('dotenv').config();
const express = require('express');
const query = require('../mysql');
const Cookies = require("cookies")

const router = express.Router();

const payLogSql = `select * from paylog_list where loginName = ? and status = ? limit ?, ?;`

// 列表
router.get("/suggestList", (req, res) => {
    const data = {
        code: 0,
        data: [],
        message: '成功'
    }
    res.status(200).send(data);
});

router.get('/payLog', (req, res) => {
    const { status, title, displayTitle, pageNo, pageSize } = req.query
    const cookies = new Cookies(req, res)
    const loginName = cookies.get("loginName") 
    let totalSql = `select count(*) from paylog_list where loginName = '${loginName}';`
    let sql = `select * from paylog_list where (loginName = '${loginName}' ${status ? 'and': 'or'} status = '${status}') ${displayTitle ? `and displayTitle = '${displayTitle}'` : ``} and title like '${title}%' limit ${(pageNo - 1) * pageSize} , ${pageSize}`
    if(loginName === 'admin') {
        totalSql = `select count(*) from paylog_list;`
        sql = `select * from paylog_list where title like '${title}%' ${status ? `and status = '${status}'`: ''} ${displayTitle ? `and displayTitle = '${displayTitle}'` : ``} limit ${(pageNo - 1) * pageSize} , ${pageSize}`
    }
    console.log(sql)
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
router.post('/payLog', (req, res) => {
    const { title,displayTitle, loginName, timeString, price } = req.body
    // const cookies = new Cookies(req, res)
    // const loginName = cookies.get("loginName")
    const sql = `insert into paylog_list(title, displayTitle, loginName, timeString, status, price) values(?,?,?,?,?,?)`;
    const option = [title,displayTitle,loginName,timeString, '未缴费', price]
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

// 删除
router.delete('/delete/:id', (req, res) => {  
    let sql = `DELETE FROM paylog_list WHERE id = ?`;
	const option = req.params.id
    query(sql, option, function (error, results, fields) {
        if (error) {
            console.log(error)
            res.jsonp({
                code: -1,
                data: [],
                message: '删除失败'
            })
            return
        } else {
            const data = {
                code: 0,
                data: [],
                message: '删除成功'
            }
            res.jsonp(data)
        }
        return
    })
})

router.post('/changeStatus', (req, res) => {
    const { id } = req.body
    const cookies = new Cookies(req, res)
    const sql = `update paylog_list set status = ? where id = ?`;
    const option = ['已缴费', id]
    query(sql, option, function (error, results, fields) {
        if (error) {
            console.log(error)
            res.jsonp({
                code: -1,
                data: [],
                message: '缴费失败'
            })
            return
        } else {
            const data = {
                code: 0,
                data: [],
                message: '缴费成功'
            }
            res.jsonp(data)
        }
        return
    })
})
module.exports = router;