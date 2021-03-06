// Booking Model stores the booking details

const mongoose = require("mongoose");
const validator = require("validator");

const bookingSchema = new mongoose.Schema({
	userID: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	gender: {
		type: String,
		required: true,
	},
	age: {
		type: Number,
		default: 18,
		required: true,
		validate(value) {
			if (value <= 0) {
				throw new Error("Invalid age provided");
			}
		},
	},
	email: {
		type: String,
		required: true,
		trim: true,
		lowercase: true,
		validate(value) {
			if (!validator.isEmail(value)) {
				throw new Error("Invalid email provided");
			}
		},
	},
	aadhaarUID: {
		type: String,
		required: true,
	},
	roomType: {
		type: String,
		required: true,
	},
	numberOfRooms: {
		type: Number,
		required: true,
		default: 1,
	},
	bookingDate: {
		type: Date,
		required: true,
		validate(value) {
			if (!validator.isDate(value)) {
				throw new Error("Invalid date provided");
			}
		},
	},
	numberOfDays: {
		type: Number,
		required: true,
		default: 1,
		validate(value) {
			if (value > 10)
				throw new Error(
					"You can't book room for more than 10 days from chatbot. Kindly contact us for further booking"
				);
		},
	},
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
