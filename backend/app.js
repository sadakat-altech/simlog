const createError = require('http-errors');
const express = require('express');
const cors = require("cors");
require('dotenv').config();
const path = require('path');
const cookieParser = require('cookie-parser');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const logsRouter = require('./routes/logs');
const logTypesRouter = require('./routes/logTypes');
const jobsRouter = require('./routes/jobs');
const sourcesRouter = require('./routes/sources');
const collectorsRouter = require('./routes/collectors');
const simulationRouter = require('./routes/simulation');

const Database = require('./dbconfig');

const app = express();

const corsOptions = {
  //origin: "http://localhost:8000"
};

app.use(cors(corsOptions));
// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/logs', logsRouter);
app.use('/logTypes', logTypesRouter);
app.use('/jobs', jobsRouter);
app.use('/sources', sourcesRouter);
app.use('/collectors', collectorsRouter);
app.use('/simulations', simulationRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

module.exports = app;
