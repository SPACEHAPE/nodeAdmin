const axios = require('axios');
require('dotenv').config();
const express = require('express');
const Cookies = require("cookies")
const router = express.Router();
const query = require('../mysql');


router.post('/login', (req, res) => {
	console.log(req.body.loginName);
	const sql = `select * from user_list where loginName = ? and password = ?`
	const { loginName, password } = req.body
	const option = [loginName, password]
	query(sql, option, function(error, results, fields) {
		if (error) {
			res.jsonp({
				code: 0,
				data: [],
				message: '修改失败'
			})
		} else {
			if (results.length === 0) {
				res.jsonp({code: -1, data: [], message: '账户或者密码错误' })
			} else {
				const cookies = new Cookies(req, res);
				cookies.set("loginName", req.body.loginName)
				res.json({message: '登录成功', code: 0, data: []})
			}
		}
		return
	})
});

router.post('/location', async (req, res) => {
	const { user_id, address } = req.body;
	const longitude_latitude = await convertAddressToLongLat(address);
	const data = {
		longitude_latitude
	};

	// TODO: Save longitude_latitude to database based on user_id

	res.status(200).send(data);
});

const convertAddressToLongLat = async (address) => {
	const headers = {
		headers: {
			Authorization: process.env.RADAR_TEST_SECRET
		}
	};

	var url = `https://api.radar.io/v1/geocode/forward?query=${address}`;
	const radarResponse = await axios.get(url, headers);

	const longitude = radarResponse.data.addresses[0].longitude;
	const latitude = radarResponse.data.addresses[0].latitude;
	const longitude_latitude = `${longitude},${latitude}`;

	return longitude_latitude;
}

module.exports = router;
