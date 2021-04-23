const express = require("express");
const router = new express.Router();
const Booking = require("../models/bookingModel");
const Availability = require("../models/availabilityModel");
const validator = require("validator");
const nextDate = require("../utils/nextDate");

// For booking
router.post("/booking", async (req, res) => {
	const booking = new Booking(req.body);
	let date = req.body.bookingDate;

	// It will contain all dates on which a user is trying to book rooms
	let allDates = [];
	const roomType = req.body.roomType;
	const numberOfRooms = req.body.numberOfRooms;

	// Rejecting booking for past dates which is impossible
	if (!validator.isDate(date) || new Date(date) < new Date()) {
		return res.status(400).send("Invalid Date Provided");
	}

	// To check availability of all dates that user is trying to book rooms
	for (let i = 0; i < booking.numberOfDays; i++) {
		let dateDoc = await Availability.findOne({
			availableAtDate: new Date(date),
		});

		if (!dateDoc) {
			const dateObj = {
				availableAtDate: date,
			};
			const AvailableDoc = new Availability(dateObj);
			try {
				await AvailableDoc.save();
			} catch (err) {
				res.status(500).send();
			}

			dateDoc = AvailableDoc;
		}
		if (dateDoc[roomType] < numberOfRooms) {
			return res
				.status(500)
				.send(
					`${numberOfRooms} ${roomType} rooms are not available on ${date}. Kindly check the availability.`
				);
		}
		allDates.push(date);

		date = nextDate(date);
	}

	try {
		const bookingDoc = await booking.save();

		// Now as all dates have required rooms available, so booking successfull and decreasing the availability of dates
		allDates.forEach(async (date) => {
			let dateDoc = await Availability.findOne({
				availableAtDate: new Date(date),
			});
			dateDoc[roomType] -= numberOfRooms;
			await dateDoc.save();
		});

		// Sending id of the stored document as private token which user will user for identification of booking at the time of cancellation
		res.status(201).send({
			token: bookingDoc.id,
		});
	} catch (err) {
		console.log(err);
		res.status(400).send();
	}
});

// For cancellation of booking
router.delete("/booking/cancellation/:token", async (req, res) => {
	const token = req.params.token;
	try {
		// If request is already cancelled
		const bookingDoc = await Booking.findOne({ _id: token });
		if (!bookingDoc) {
			return res
				.status(400)
				.send("Invalid request. Already cancelled the booking");
		}
		console.log(bookingDoc.bookingDate);
		let date = bookingDoc.bookingDate;

		// converting timestamp to string
		date = date.toISOString();
		date = date.substr(0, 10);
		const numOfRooms = bookingDoc.numberOfRooms;
		const numOfDays = bookingDoc.numberOfDays;
		const roomTypeToDelete = bookingDoc.roomType;

		// If booking date is today or in past, then can't cancel
		if (new Date(date) <= new Date()) {
			return res.status(400).send("You can't cancel booking now");
		}
		await bookingDoc.deleteOne({ _id: token });

		// If booking is cancelled successfully, then increasing the availability of the dates again
		for (let i = 0; i < numOfDays; i++) {
			let dateDoc = await Availability.findOne({
				availableAtDate: new Date(date),
			});
			dateDoc[roomTypeToDelete] += numOfRooms;
			await dateDoc.save();
			date = nextDate(date);
		}

		res.status(200).send("Booking cancelled successfully");
	} catch (err) {
		console.log(err);
		res.status(400).send(err);
	}
});

// To get info of booking using token
router.get("/booking/info/:token", async (req, res) => {
	const token = req.params.token;
	try {
		// If the booking is already cancelled
		const bookingDoc = await Booking.findOne({ _id: token });
		if (!bookingDoc) {
			return res
				.status(400)
				.send("Invalid request. Already cancelled the booking");
		}

		let obj = { ...bookingDoc }._doc;
		delete obj._id;
		delete obj.__v;
		obj.token = token;
		res.status(200).send(obj);
	} catch (err) {
		console.log(err);
		res.status(400).send();
	}
});

module.exports = router;
