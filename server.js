const express = require("express");
const dotenv = require("dotenv");
//const logger = require("./middleware/logger");
const morgan = require("morgan");
const colors = require("colors");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/error");

//load env vars
dotenv.config({ path: "./config/config.env" });

//conect to database
connectDB();

const app = express();

//body parser
app.use(express.json());

//load route files
const bootcamps = require("./routes/bootcamps");

//dev logging middleware
if (process.env.NODE_ENV === "dev") {
  app.use(morgan("dev"));
}

//Mount routers
app.use("/api/v1/bootcamps", bootcamps);

app.use(errorHandler);

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  );
});

//Hanlde unhandled process rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error : ${err.message}`.red.bold);
  //close server and exit process
  server.close(() => process.exit(1)); //1 means exit with failure
});
