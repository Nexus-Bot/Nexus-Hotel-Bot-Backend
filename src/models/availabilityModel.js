// Availability Model stores a date and number of different types of rooms available on that date

const mongoose = require("mongoose");
const validator = require("validator");
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

/*
Room Types :-
    1> Single
    2> Double
    3> Triple
    4> Quad
    5> Twin Room
    6> Deluxe (with Queen sized Bed)
    7> Super Deluxe (with King sized Bed)
    8> Studio room
    9> Executive Suite
    10> Presidential Suite
*/

const availabilitySchema = new mongoose.Schema({
	availableAtDate: {
		type: Date,
		required: true,
	},
	SingleRoom: {
		type: Number,
		default: Single,
	},
	DoubleRoom: {
		type: Number,
		default: Double,
	},
	DeluxeRoom: {
		type: Number,
		default: Deluxe,
	},
	TripleRoom: {
		type: Number,
		default: Triple,
	},
	QuadRoom: {
		type: Number,
		default: Quad,
	},
	TwinRoom: {
		type: Number,
		default: Twin,
	},
	ExecutiveSuiteRoom: {
		type: Number,
		default: ExecutiveSuite,
	},
	SuperDeluxeRoom: {
		type: Number,
		default: SuperDeluxe,
	},
	StudioRoom: {
		type: Number,
		default: Studio,
	},
	PresidentialSuiteRoom: {
		type: Number,
		default: PresidentialSuite,
	},
});

const Availability = mongoose.model("Availability", availabilitySchema);

module.exports = Availability;
