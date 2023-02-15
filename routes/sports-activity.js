const axios = require('axios');
//API key needed for Decathlon(?)
const express = require('express');

const router = express.Router();


// TODO: Add error checking for req.body variables
// TODO: Add error responses / Catch errors
router.get('/place/list', async (req, res) => {
	const { origin, radius, sport } = req.query;

	if (!origin) {
		var errorMsg = "Parameter \'origin\' is required. Format: <longitude>,<latitude>. No spaces. Example: -71.117730,42.352190";
		res.status(400).send(errorMsg);
	}

	var url = `https://sportplaces.api.decathlon.com/api/v1/places?origin=${origin}`;

	if (radius) {
		url += `&radius=${radius}`;
	}

	if (sport) {
		const sport_id = await getSportId(sport);
		url += `&sports=${sport_id}`;
	}

	console.log('url', url);
	const decathlonResponse = await axios.get(url);

	console.log('list', decathlonResponse.data.data.features);

	const data = decathlonResponse.data.data.features.map(function(x) {
		return {
			sports_place_id: x.properties.uuid,
			sports_place_name: x.properties.name,
			distance: x.properties.proximity // Convert from km to mi later
		};
	});

	res.status(200).send(data);
});


// TODO: implement...
router.get('/place', async (req, res) => {
	const { sports_place_id } = req.query;

	var url = "https://sportplaces.api.decathlon.com/api/v1/places/" + sports_place_id;

	const decathlonResponse = await axios.get(url);

	console.log('decathlonResponse', decathlonResponse.data);

	const decData = decathlonResponse.data.properties;

	const sportsData = decData.activities;
	const sportsString = await parseSportsData(sportsData);

	const addressData = decData.address_components;
	const address = parseAddress(addressData);

	const longitude_latitude = parseLongLat(decathlonResponse.data.geometry);

	// TODO: Calculate distance between user location and this place
	const data = {
		sports_place_id : sports_place_id,
		sports_place_name : decData.name,
		sports_activities : sportsString,
		address : address,
		distance : decData.proximity, // Decathlon API doesn't give proximity for this route
		longitude_latitude : longitude_latitude,
	};

	res.status(200).send(data);
	return;
});

router.post('/favorite', async (req, res) => {
	res.status(200).send(' test: success ');
	return;
});

const parseAddress = (addressData) => {
	console.log('addressData', addressData);
	var address = "";

	if (addressData.address) {
		address += addressData.address + ", ";
	}

	if (addressData.city) {
		address += addressData.city;
	}

	if (addressData.province) {
		address += " " + addressData.province;
	}

	if (addressData.postal_code) {
		address += " " + addressData.postal_code;
	}

	return address;
}

const parseSportsData = async (sportsData) => {
	var sportsString = "";
	var sportId = "";
	var sportName = "";

	// TODO: Use Promise.all for parallel awaits
	for (var s of sportsData) {
		sportId = s.sport_id;
		sportName = await getSportName(sportId);
		sportsString += sportName + ", "
	}

	return sportsString;
}

const parseLongLat = (data) => {
	if (data.type == "Point") {
		return  data.coordinates[0] + "," + data.coordinates[1];
	} else if (data.type == "Linestring") {
		return  data.coordinates[0][0] + "," + data.coordinates[0][1];
	}

	return "";
}


// TODO: Throw error if sport_name is not valid
const getSportId = async (sportName) => {
	var url = `https://sports.api.decathlon.com/sports/${sportName}`;
	const decathlonResponse = await axios.get(url);

	const sportId = decathlonResponse.data.data.id;
	return sportId;
}

const getSportName = async (sportId) => {
	var url = `https://sports.api.decathlon.com/sports/${sportId}`;
	const decathlonResponse = await axios.get(url);

	const sportName = decathlonResponse.data.data.attributes.name;
	return sportName;
}

module.exports = router;
