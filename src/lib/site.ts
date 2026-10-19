/** Brand, company and commerce settings shared by server and client code. */
export const site = {
  name: "FlowerVsFlorist",
  domain: "flowervsflorist.com",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://flowervsflorist.com").replace(/\/+$/, ""),
  tagline: "Fresh flowers, florist-crafted, delivered today",
  description:
    "Send fresh flowers online with same-day flower delivery across the USA. Hand-arranged roses, birthday bouquets, sympathy flowers and plants from FlowerVsFlorist.",
  phone: "+14782198398",
  phoneDisplay: "(478) 219-8398",
  email: "contact@flowervsflorist.com",
  emailAlt: "hey@mandr-group.com",
  contactPerson: "Matthew Michael",
  hours: "Mon–Sat 8:00 AM – 7:00 PM ET · Sun 10:00 AM – 4:00 PM ET",
  company: {
    legalName: "M&R MARKETING GROUP, LLC",
    displayName: "M&R Marketing Group, LLC",
    type: "Domestic Limited Liability Company",
    state: "Georgia",
    controlNumber: "12039036",
    formed: "2012-05-07",
    street: "331 3rd Street",
    city: "Macon",
    region: "GA",
    postalCode: "31201",
    country: "US",
  },
  social: {
    facebook: "https://www.facebook.com/",
    instagram: "https://www.instagram.com/",
    pinterest: "https://www.pinterest.com/",
  },
} as const;

export const addressLine = `${site.company.street}, ${site.company.city}, ${site.company.region} ${site.company.postalCode}, USA`;

/** Delivery & pricing rules (all money in cents). */
export const commerce = {
  currency: "usd",
  deliveryFee: 1299,
  sameDayFee: 500,
  freeDeliveryThreshold: 7900,
  /** Same-day orders must be placed before this hour (Eastern Time). */
  sameDayCutoffHour: 14,
  maxDaysAhead: 90,
  timeZone: "America/New_York",
} as const;

export const deliveryWindows = [
  { value: "anytime", label: "Anytime (8 AM – 8 PM)" },
  { value: "morning", label: "Morning (8 AM – 12 PM)" },
  { value: "afternoon", label: "Afternoon (12 PM – 5 PM)" },
  { value: "evening", label: "Evening (5 PM – 8 PM)" },
] as const;

export const addOns = [
  { key: "vase", label: "Upgrade to Premium Glass Vase", price: 1499 },
  { key: "chocolates", label: "Gourmet Chocolate Truffles (6 pc)", price: 1999 },
  { key: "balloon", label: "Celebration Mylar Balloon", price: 999 },
  { key: "bear", label: "Plush Teddy Bear", price: 1799 },
  { key: "card", label: "Premium Greeting Card", price: 599 },
] as const;
export type AddOnKey = (typeof addOns)[number]["key"];

export const US_STATES: [string, string][] = [
  ["AL", "Alabama"], ["AK", "Alaska"], ["AZ", "Arizona"], ["AR", "Arkansas"], ["CA", "California"],
  ["CO", "Colorado"], ["CT", "Connecticut"], ["DE", "Delaware"], ["DC", "District of Columbia"], ["FL", "Florida"],
  ["GA", "Georgia"], ["HI", "Hawaii"], ["ID", "Idaho"], ["IL", "Illinois"], ["IN", "Indiana"],
  ["IA", "Iowa"], ["KS", "Kansas"], ["KY", "Kentucky"], ["LA", "Louisiana"], ["ME", "Maine"],
  ["MD", "Maryland"], ["MA", "Massachusetts"], ["MI", "Michigan"], ["MN", "Minnesota"], ["MS", "Mississippi"],
  ["MO", "Missouri"], ["MT", "Montana"], ["NE", "Nebraska"], ["NV", "Nevada"], ["NH", "New Hampshire"],
  ["NJ", "New Jersey"], ["NM", "New Mexico"], ["NY", "New York"], ["NC", "North Carolina"], ["ND", "North Dakota"],
  ["OH", "Ohio"], ["OK", "Oklahoma"], ["OR", "Oregon"], ["PA", "Pennsylvania"], ["RI", "Rhode Island"],
  ["SC", "South Carolina"], ["SD", "South Dakota"], ["TN", "Tennessee"], ["TX", "Texas"], ["UT", "Utah"],
  ["VT", "Vermont"], ["VA", "Virginia"], ["WA", "Washington"], ["WV", "West Virginia"], ["WI", "Wisconsin"],
  ["WY", "Wyoming"],
];
