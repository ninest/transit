import { DaysOperating, getDaysOperating } from "./calendar.js";
import { readCSV } from "./utils/file.js";

const trips = await readCSV("./data/MBTA_GTFS/trips.txt");
const stopTimes = await readCSV("./data/MBTA_GTFS/stop_times.txt");
const directions = await readCSV("./data/MBTA_GTFS/directions.txt");

// Red line
const routeId = "Orange";
const directionForRoute = directions.filter((d) => d.route_id === routeId);

interface Schedule {
  routeId: string;

  trips: {
    directionId: string;
    routeType: string;
    operatingDays: DaysOperating;
    stops: {
      arrivalTime: string;
      departureTime: string;
      stopId: any;
    }[];
  }[];
}

const scheduleTrips: Schedule["trips"] = [];

for (const direction of directionForRoute) {
  const tripsForRoute = trips.filter((t) => t.route_id === routeId && t.direction_id === direction.direction_id);

  for (const trip of tripsForRoute) {
    const stopTimesForTripInDirection = stopTimes.filter((st) => st.trip_id === trip.trip_id);

    const stopIds = stopTimesForTripInDirection.map((stft) => stft.stop_id);
    // const stopsForRoute = stopIds.map((stopId) => stops.find((stop) => stop.stop_id === stopId));

    // console.log(stopTimesForTripInDirection.length, stopsForRoute.length);

    const stops: Schedule["trips"][number]["stops"] = [];
    for (const stopTime of stopTimesForTripInDirection) {
      stops.push({
        arrivalTime: stopTime.arrival_time,
        departureTime: stopTime.departure_time,
        stopId: stopTime.stop_id,
      });
    }

    scheduleTrips.push({
      directionId: direction.direction_id,
      routeType: trip.trip_route_type,
      operatingDays: getDaysOperating(trip.service_id),
      stops,
    });
  }
}

const schedule: Schedule = {
  routeId,
  trips: scheduleTrips,
};

Bun.write(`./output/boston/${routeId}.json`, JSON.stringify(schedule));
