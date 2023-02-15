const axios = require('axios');
require('dotenv').config();
const express = require('express');
const query = require('../mysql');

const router = express.Router();

const headers = {
	headers: {
		Authorization: 'Bearer ' + process.env.YELP_API_KEY
	}
};

// 修改用户信息
router.put('/changeInfo', async (req, res) => {
	const sql = `update user_list set loginName = ?, realname = ?, tel = ?, password = ? where id = ?`;
	const {password, loginName, realname, tel, id} = req.body
	const option = [loginName, realname, tel, password, id]
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

// 新增用户
router.post('/addUser', async (req, res) => {
	let sql = `insert into user_list(password, loginName, realname, tel) values(?,?,?,?)`;
	const sql3 = `select loginName from user_list;`
	const {password, loginName, realname, tel} = req.body
	const option = [password, loginName, realname, tel]
	query(sql3, function(sql3error,sql3results, sql3fields) {
		let next = true
		if (sql3error) {
			return
		} else {
			const arr = []
			sql3results.forEach(element => {
				if(!arr.includes(element.loginName)) { 
					arr.push(element.loginName) 
				} else {
					next = false
					sql = `select * from user_list;`
					return
				}
			});
		}
		query(sql, option, function(error, results, fields) {
			if (error) {
				return
			} else {
				if(next){
					res.jsonp({
						code: 0,
						data: [],
						message: '新增成功'
					})
				} else {
					res.jsonp({
						code: -1,
						message: '新增失败，用户名已存在',
						data: []
					})
				}

				return
			}
			
		})
	})
})

// 动态路由匹配 删除
router.delete('/delete/:id', async (req, res) => {
	let sql = `DELETE FROM user_list WHERE id = ?`;
	const option = req.params.id
	query(sql, option, function(error, results, fields) {
		if (error) {
			res.jsonp({
				code: 0,
				data: [],
				message: '删除失败'
			})
		} else {
			res.jsonp({
				code: 0,
				data: [],
				message: '删除成功'
			})
		}
		return
	})
})

// TODO: Add error checking for req.body variables
// TODO: Add error responses / Catch errors
// router.get('/list', async (req, res) => {
// 	const { keyword, longitude_latitude, location, radius, sort_by } = req.query;
// 	var longitude = 0.0;
// 	var latitude = 0.0;
// 	var useLongitudeLatitude = false;

// 	var url = "https://api.yelp.com/v3/businesses/search";

// 	if (!keyword) {
// 		url += "?term=restaurant"
// 	} else {
// 		url += "?term=" + keyword
// 	}

// 	if (longitude_latitude) {
// 		const L = longitude_latitude.split(",");

// 		if (L.length == 2) {
// 			useLongitudeLatitude = true;
// 			longitude = Number(L[0]);
// 			latitude = Number(L[1]);

// 			url += "&longitude=" + longitude;
// 			url += "&latitude=" + latitude;
// 		}
// 	}

// 	if (!useLongitudeLatitude && location) {
// 		url += "&location=" + location;
// 	}

// 	if (radius) {
// 		let radiusNum = Number(radius) * 1000;
// 		url += "&radius=" + radiusNum;
// 	}

// 	if (sort_by) {
// 		url += "&sort_by=" + sort_by;
// 	}

// 	const yelpResponse = await axios.get(url, headers);

// 	let description = "";
// 	let distance = 0;

// 	const data = yelpResponse.data.businesses.map(function(x) {
// 		description = "";

// 		for (const c of x.categories) {
// 			description += c.title + ", ";
// 		}

// 		description = description.slice(0, -2); // Remove last 2 characters

// 		// TODO: Convert to miles instead of km
// 		distance = Number(x.distance) / 1000;

// 		return {
// 			restaurant_id: x.id,
// 			restaurant_name: x.name,
// 			image_url: x.image_url,
// 			description: description,
// 			rating: x.rating,
// 			price: x.price,
// 			distance: distance
// 		};
// 	});

// 	res.status(200).send(data);
// });

// // TODO: implement error-checking
// // TODO: implement for locales other than US-EN(?)
// // TODO: figure out which members of the yelp response to return to front end
// router.get('/reviews', async (req, res) => {
// 	const { restaurant_id } = req.query;

// 	var url = "https://api.yelp.com/v3/businesses/" + restaurant_id + "/reviews";
	
// 	const yelpResponse = await axios.get(url, headers);
	
// 	res.status(200).send(yelpResponse.data);
// });


// // TODO: Check that restaurant_id is given. If not, res.status(400).error('error msg')
// // TODO: Catch errors from yelp api call, res.send error
// // TODO: Get user location so we could calculate distance
// // Example restaurant_id (could use for testing): HUtHbHjyu114ptcilT_M6g
// router.get('/', async (req, res) => {
// 	const { restaurant_id } = req.query;

// 	var url = "https://api.yelp.com/v3/businesses/" + restaurant_id;

// 	const yelpResponse = await axios.get(url, headers);
// 	const restaurant = yelpResponse.data;

// 	let description = "";

// 	for (const c of restaurant.categories) {
// 		description += c.title + ", ";
// 	}

// 	description = description.slice(0, -2); // Remove last 2 characters

// 	let a = restaurant.location.display_address;
// 	let address = a[0] + ', ' + a[1];

// 	const data = {
// 		restaurant_id: restaurant.id,
// 		restaurant_name: restaurant.name,
// 		image_url: restaurant.image_url,
// 		description: description,
// 		rating: restaurant.rating,
// 		price: restaurant.price,
// 		distance: 0, // TBD
// 		address: address
// 	};

// 	res.status(200).send(data);
// });

// TODO: Implement once DB gets sorted out
router.post('/favorite', (req, res) => {
	res.status(200).send(' test : success ');
});


module.exports = router;
