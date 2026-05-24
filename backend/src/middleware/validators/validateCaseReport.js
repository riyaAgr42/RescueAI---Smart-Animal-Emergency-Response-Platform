const allowedAnimalTypes = ["dog", "cat", "cow", "bird", "other"];
const allowedEmergencyLevels = ["low", "medium", "high", "critical"];

const validateCaseReport = (req, res, next) => {
  const { description, latitude, longitude, animalType, emergencyLevel } = req.body;

  if (!description || description.trim().length < 10) {
    return res.status(400).json({ message: "Please add a clear description with at least 10 characters." });
  }

  if (Number.isNaN(parseFloat(latitude)) || Number.isNaN(parseFloat(longitude))) {
    return res.status(400).json({ message: "Valid latitude and longitude are required." });
  }

  if (animalType && !allowedAnimalTypes.includes(animalType)) {
    return res.status(400).json({ message: "Invalid animal type selected." });
  }

  if (emergencyLevel && !allowedEmergencyLevels.includes(emergencyLevel)) {
    return res.status(400).json({ message: "Invalid emergency level selected." });
  }

  next();
};

export default validateCaseReport;
