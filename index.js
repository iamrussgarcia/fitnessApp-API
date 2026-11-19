const express = require('express');
const mongoose = require('mongoose');

const userRoutes = require('./routes/user.js');
const workoutRoutes = require('./routes/workout.js');

const port = 4000;

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect("mongodb+srv://admin:admin1234@b645-garcia.ohpcw9y.mongodb.net/FitnessTrackingAPI");

let db = mongoose.connection;

app.use('/users', userRoutes);
app.use('/workouts', workoutRoutes);

db.on("error", (err) => {
  console.error("Connection to the db failed:", err);
});
db.once("open", () => {
  console.log("Connected to the database");
});

if(require.main === module){
	app.listen(process.env.PORT || 4000, () => {
	    console.log(`API is now online on port ${ process.env.PORT || 4000 }`);
	});
}


module.exports = {app,mongoose};