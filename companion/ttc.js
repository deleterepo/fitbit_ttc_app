import fetch from 'isomorphic-fetch'
import { STOPS_JSON, SCRIPT_URL } from "../common/globals.js";
var Promise = require("bluebird");




function delayMyPromise(myPromise, myDelay) {
  return Promise.delay(myDelay).then(function () {
    return myPromise;
  });
};

function fetchMapped(url) {
  console.log("Fetching " + url);

}

export function BartAPI() { };

BartAPI.prototype.realTimeDepartures = function (userLat, userLon, direction) {
  let self = this;

  return new Promise(function (resolve, reject) {
    fetch(STOPS_JSON).then(function (response) {
      return response.json();
    }).then(function (json) {
      const stops = json.stops;
      let stopsByDistance = stops.sort(function (a, b) {
        var origLat = 43.6451965,
          origLong = -79.4020613;

        return distance(origLat, origLong, a.lat, a.lon) - distance(origLat, origLong, b.lat, b.lon);
      });

      const closestStop = stopsByDistance[0];
      const predictionsUrl = SCRIPT_URL + "&command=predictions" + "&stopid=" + closestStop.stopId;

      fetch(predictionsUrl).then(function (response) {
        return response.json();
      }).then(function (predictions) {
        console.log(predictions);

        resolve(predictions);
      });
    });

  });
};

var distance = function (lat1, lon1, lat2, lon2) {
  var radlat1 = Math.PI * lat1 / 180;
  var radlat2 = Math.PI * lat2 / 180;
  var theta = lon1 - lon2;
  var radtheta = Math.PI * theta / 180;
  var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  dist = Math.acos(dist);
  dist = dist * 180 / Math.PI;
  dist = dist * 60 * 1.1515;
  dist = dist * 1.609344;

  return dist;
};



let bartApi = new BartAPI();
bartApi.realTimeDepartures("", "").then(function (stops) {

  //console.log(stops.slice(1, 5));
}).catch(function (e) {
  console.log("error"); console.log(e)
});
