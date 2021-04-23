const isLeapYear = (year) => {
	if (year % 400 == 0 || (year % 4 == 0 && year % 100 != 0)) return true;
	return false;
};

// takes day, month and year as integers and returns a date string in format YYYY-MM-DD
const convertToDateInString = (day, month, year) => {
	let date = "";
	date = date + year;
	date += "-";

	// if month is of one digit, then to make it of two digits
	if (month < 10) date += "0";
	date = date + month;
	date += "-";

	// same as month
	if (day < 10) date += "0";
	date = date + day;
	return date;
};

// date in format YYYY-MM-DD
// calculating next date
const nextDate = (date) => {
	let year = parseInt(date.substr(0, 4));
	let month = parseInt(date.substr(5, 2));
	let day = parseInt(date.substr(8, 2));
	const daysInMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

	if (isLeapYear(year)) {
		daysInMonths[1]++;
	}

	if (day < daysInMonths[month - 1]) {
		day++;
	} else if (month == 12) {
		year++;
		month = 1;
		day = 1;
	} else {
		day = 1;
		month++;
	}

	return convertToDateInString(day, month, year);
};

module.exports = nextDate;
