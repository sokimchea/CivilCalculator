const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.post('/calculate-hauling', (req, res) => {
    const { soilVolume, bulkingFactor, truckCapacity, cycleDuration, finishDuration, workingHoursPerDay } = req.body;

    const totalVolume = soilVolume * bulkingFactor;
    const totalCycles = totalVolume / truckCapacity;
    const totalWorkingHours = finishDuration * workingHoursPerDay;
    const numberOfTrucks = totalCycles / (totalWorkingHours / cycleDuration);

    res.json({
        numberOfTrucks: Math.ceil(numberOfTrucks),
        totalVolume: totalVolume.toFixed(2),
        totalCycles: totalCycles.toFixed(2),
        totalWorkingHours: totalWorkingHours
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
