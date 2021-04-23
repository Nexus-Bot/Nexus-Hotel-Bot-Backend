const express = require("express");

// connecting db
require("./db/mongoose");

const bookingRouter = require("./routers/bookingRouter");
const availabilityRouter = require("./routers/availabilityRouter");

const app = express();

app.use(express.json());
app.use(bookingRouter);
app.use(availabilityRouter);

module.exports = app;
