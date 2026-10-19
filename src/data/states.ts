/** Major cities per state for the /flower-delivery/[state] local landing pages. */
import { US_STATES } from "@/lib/site";
import { slugify } from "@/lib/format";

const CITIES: Record<string, string[]> = {
  AL: ["Birmingham", "Montgomery", "Huntsville", "Mobile"], AK: ["Anchorage", "Fairbanks", "Juneau"], AZ: ["Phoenix", "Tucson", "Mesa", "Scottsdale"],
  AR: ["Little Rock", "Fayetteville", "Fort Smith"], CA: ["Los Angeles", "San Diego", "San Francisco", "San Jose", "Sacramento"], CO: ["Denver", "Colorado Springs", "Aurora", "Boulder"],
  CT: ["Hartford", "New Haven", "Stamford", "Bridgeport"], DE: ["Wilmington", "Dover", "Newark"], DC: ["Washington"], FL: ["Miami", "Orlando", "Tampa", "Jacksonville"],
  GA: ["Atlanta", "Macon", "Savannah", "Augusta", "Columbus"], HI: ["Honolulu", "Hilo", "Kailua"], ID: ["Boise", "Meridian", "Idaho Falls"],
  IL: ["Chicago", "Aurora", "Naperville", "Springfield"], IN: ["Indianapolis", "Fort Wayne", "Evansville"], IA: ["Des Moines", "Cedar Rapids", "Davenport"],
  KS: ["Wichita", "Overland Park", "Kansas City", "Topeka"], KY: ["Louisville", "Lexington", "Bowling Green"], LA: ["New Orleans", "Baton Rouge", "Shreveport"],
  ME: ["Portland", "Bangor", "Augusta"], MD: ["Baltimore", "Annapolis", "Rockville", "Frederick"], MA: ["Boston", "Worcester", "Cambridge", "Springfield"],
  MI: ["Detroit", "Grand Rapids", "Ann Arbor", "Lansing"], MN: ["Minneapolis", "Saint Paul", "Rochester"], MS: ["Jackson", "Gulfport", "Hattiesburg"],
  MO: ["Kansas City", "St. Louis", "Springfield", "Columbia"], MT: ["Billings", "Missoula", "Bozeman"], NE: ["Omaha", "Lincoln", "Bellevue"],
  NV: ["Las Vegas", "Henderson", "Reno"], NH: ["Manchester", "Nashua", "Concord"], NJ: ["Newark", "Jersey City", "Princeton", "Hoboken"],
  NM: ["Albuquerque", "Santa Fe", "Las Cruces"], NY: ["New York City", "Brooklyn", "Buffalo", "Rochester", "Albany"], NC: ["Charlotte", "Raleigh", "Durham", "Greensboro"],
  ND: ["Fargo", "Bismarck", "Grand Forks"], OH: ["Columbus", "Cleveland", "Cincinnati", "Dayton"], OK: ["Oklahoma City", "Tulsa", "Norman"],
  OR: ["Portland", "Eugene", "Salem", "Bend"], PA: ["Philadelphia", "Pittsburgh", "Allentown", "Harrisburg"], RI: ["Providence", "Warwick", "Newport"],
  SC: ["Charleston", "Columbia", "Greenville", "Myrtle Beach"], SD: ["Sioux Falls", "Rapid City", "Pierre"], TN: ["Nashville", "Memphis", "Knoxville", "Chattanooga"],
  TX: ["Houston", "Dallas", "Austin", "San Antonio", "Fort Worth"], UT: ["Salt Lake City", "Provo", "Ogden", "St. George"], VT: ["Burlington", "Montpelier", "Rutland"],
  VA: ["Virginia Beach", "Richmond", "Arlington", "Norfolk"], WA: ["Seattle", "Spokane", "Tacoma", "Bellevue"], WV: ["Charleston", "Morgantown", "Huntington"],
  WI: ["Milwaukee", "Madison", "Green Bay"], WY: ["Cheyenne", "Casper", "Jackson"],
};

export type StateInfo = { code: string; name: string; slug: string; cities: string[] };

export const states: StateInfo[] = US_STATES.map(([code, name]) => ({ code, name, slug: slugify(name), cities: CITIES[code] ?? [] }));
export const stateBySlug = new Map(states.map((s) => [s.slug, s]));
