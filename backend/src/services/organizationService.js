import Organization from "../models/Organization.js";
import { haversineDistanceKm } from "../utils/geo.js";

export const getNearbyPartners = async ({ latitude, longitude, limit = 5 }) => {
  const partners = await Organization.find();

  return partners
    .map((org) => ({
      org,
      distanceKm: haversineDistanceKm(
        { latitude, longitude },
        { latitude: org.location.latitude, longitude: org.location.longitude }
      ),
    }))
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, limit)
    .map(({ org, distanceKm }) => ({
      id: org._id,
      name: org.name,
      type: org.type,
      phone: org.phone,
      address: org.address,
      distanceKm: Number(distanceKm.toFixed(2)),
    }));
};
