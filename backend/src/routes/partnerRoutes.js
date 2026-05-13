import express from "express";
import auth, { allowRoles } from "../middleware/auth.js";
import Organization from "../models/Organization.js";
import { haversineDistanceKm } from "../utils/geo.js";

const seedIfEmpty = async () => {
  const count = await Organization.estimatedDocumentCount();
  if (count > 0) return;
  await Organization.insertMany([
    {
      name: "Blue Cross of India, Chennai",
      type: "ngo",
      phone: "+91-44-2235-7318",
      address: "1 Eldams Rd, Adyar, Chennai",
      location: { latitude: 13.0067, longitude: 80.2574 },
      services: ["rescue", "treatment", "ambulance"],
    },
    {
      name: "BSPCA Animal Hospital, Mumbai",
      type: "ngo",
      phone: "+91-22-2413-7518",
      address: "Dr S.S. Rao Rd, Parel, Mumbai",
      location: { latitude: 18.9986, longitude: 72.8405 },
      services: ["rescue", "24x7 hospital"],
    },
    {
      name: "Government Veterinary Hospital, Bengaluru",
      type: "government_hospital",
      phone: "+91-80-2221-1704",
      address: "Queen's Rd, Shivajinagar, Bengaluru",
      location: { latitude: 12.9842, longitude: 77.6047 },
      services: ["government hospital", "outpatient"],
    },
    {
      name: "Friendicoes SECA, Delhi",
      type: "ngo",
      phone: "+91-11-2431-4787",
      address: "Defence Colony Flyover Market, Delhi",
      location: { latitude: 28.5887, longitude: 77.2433 },
      services: ["rescue", "ambulance", "hospital"],
    },
  ]);
};

const routerFactory = () => {
  const router = express.Router();

  router.post("/", auth, allowRoles("admin"), async (req, res) => {
    const org = await Organization.create(req.body);
    res.status(201).json(org);
  });

  router.get("/", auth, allowRoles("admin"), async (req, res) => {
    const orgs = await Organization.find().sort("name");
    res.json(orgs);
  });

  router.get("/nearby", auth, async (req, res) => {
    const latitude = parseFloat(req.query.latitude);
    const longitude = parseFloat(req.query.longitude);
    const radiusKm = parseFloat(req.query.radiusKm) || 30;
    const limit = parseInt(req.query.limit || "5", 10);

    if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
      return res.status(400).json({ message: "latitude and longitude are required" });
    }

    await seedIfEmpty();
    const orgs = await Organization.find();
    const withDistance = orgs
      .map((org) => ({
        org,
        distanceKm: haversineDistanceKm(
          { latitude, longitude },
          { latitude: org.location.latitude, longitude: org.location.longitude }
        ),
      }))
      .filter(({ distanceKm }) => distanceKm <= radiusKm)
      .sort((a, b) => a.distanceKm - b.distanceKm)
      .slice(0, limit)
      .map(({ org, distanceKm }) => ({
        id: org._id,
        name: org.name,
        type: org.type,
        phone: org.phone,
        address: org.address,
        services: org.services,
        distanceKm: Number(distanceKm.toFixed(2)),
      }));

    res.json(withDistance);
  });

  return router;
};

export default routerFactory;
