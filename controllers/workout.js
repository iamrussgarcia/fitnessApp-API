const mongoose = require('mongoose');
const Workout = require('../models/workout.js');

const validId = (id) => mongoose.Types.ObjectId.isValid(id);

module.exports.addWorkout = async (req, res) => {
    try {
        const { name, duration } = req.body;

        if (!name || !duration) {
            return res.status(400).send({ error: 'Name and duration are required' });
        }

        // userId always comes from the token, never from the request body
        const workout = await new Workout({ name, duration, userId: req.user.id }).save();
        return res.status(201).send(workout);
    } catch (err) {
        console.error(err);
        return res.status(500).send({ error: 'Error in adding workout' });
    }
};

module.exports.getMyWorkouts = async (req, res) => {
    try {
        const workouts = await Workout.find({ userId: req.user.id });
        return res.status(200).send({ workouts });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ error: 'Error in fetching workouts' });
    }
};

module.exports.updateWorkout = async (req, res) => {
    try {
        const { workoutId } = req.params;
        if (!validId(workoutId)) {
            return res.status(400).send({ error: 'Invalid workout id' });
        }

        const updates = {};
        if (req.body.name !== undefined) updates.name = req.body.name;
        if (req.body.duration !== undefined) updates.duration = req.body.duration;
        if (req.body.status !== undefined) updates.status = req.body.status;
        if (Object.keys(updates).length === 0) {
            return res.status(400).send({ error: 'Nothing to update' });
        }

        const workout = await Workout.findOneAndUpdate(
            { _id: workoutId, userId: req.user.id },
            updates,
            { new: true }
        );
        if (!workout) {
            return res.status(404).send({ error: 'Workout not found' });
        }
        return res.status(200).send({ message: 'Workout updated successfully', updatedWorkout: workout });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ error: 'Error in updating workout' });
    }
};

module.exports.deleteWorkout = async (req, res) => {
    try {
        const { workoutId } = req.params;
        if (!validId(workoutId)) {
            return res.status(400).send({ error: 'Invalid workout id' });
        }

        const workout = await Workout.findOneAndDelete({ _id: workoutId, userId: req.user.id });
        if (!workout) {
            return res.status(404).send({ error: 'Workout not found' });
        }
        return res.status(200).send({ message: 'Workout deleted successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ error: 'Error in deleting workout' });
    }
};

module.exports.completeWorkoutStatus = async (req, res) => {
    try {
        const { workoutId } = req.params;
        if (!validId(workoutId)) {
            return res.status(400).send({ error: 'Invalid workout id' });
        }

        const workout = await Workout.findOneAndUpdate(
            { _id: workoutId, userId: req.user.id },
            { status: 'completed' },
            { new: true }
        );
        if (!workout) {
            return res.status(404).send({ error: 'Workout not found' });
        }
        return res.status(200).send({ message: 'Workout status updated successfully', updatedWorkout: workout });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ error: 'Error in updating workout status' });
    }
};
