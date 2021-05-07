const express = require("express");
const router = new express.Router();
const validator = require("validator");
const Availability = require("../models/availabilityModel");
const {
	Single,
	Deluxe,
	Double,
	Triple,
	Twin,
	Quad,
	ExecutiveSuite,
	PresidentialSuite,
	SuperDeluxe,
	Studio,
} = require("../variables/totalRooms");

// When all rooms are available on a date, then we send all default values of total rooms
const emptyDate = () => {
	return {
		SingleRoom: Single,
		DoubleRoom: Double,
		TripleRoom: Triple,
		TwinRoom: Twin,
		QuadRoom: Quad,
		DeluxeRoom: Deluxe,
		SuperDeluxeRoom: SuperDeluxe,
		StudioRoom: Studio,
		ExecutiveSuiteRoom: ExecutiveSuite,
		PresidentialSuiteRoom: PresidentialSuite,
	};
};

router.post("/isAvailable", async (req, res) => {
	let date = req.body.date;
	if (!validator.isDate(date)) {
		return res.status(400).send("Invalid Date Provided");
	}

	// To reject request for checking availability of past date
	if (new Date(date) < new Date()) {
		return res
			.status(400)
			.send("You can't check availability of past date");
	}

	try {
		const isAvailable = await Availability.findOne({
			availableAtDate: new Date(date),
		});

		if (!isAvailable) {
			return res.status(200).send(emptyDate());
		}

		// In isAvailable object properties are non-configurable by default, therefore can't delete them using delete.
		// Next line copied from stack overflow
		// https://stackoverflow.com/questions/33239464/javascript-delete-object-property-not-working
		let obj = { ...isAvailable }._doc;

		// To not send unnecessary details to user
		delete obj._id;
		delete obj.availableAtDate;
		delete obj.__v;
		res.status(200).send(obj);
	} catch (err) {
		console.log(err);
		res.status(400).send(err.message);
	}
});

module.exports = router;
