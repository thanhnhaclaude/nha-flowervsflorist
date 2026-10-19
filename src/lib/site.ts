/** Brand, company and commerce settings shared by server and client code. */
export const site = {
  name: "FlowerVsFlorist",
  domain: "flowervsflorist.com",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://flowervsflorist.com").replace(/\/+$/, ""),
  tagline: "Farm-fresh flowers, delivered tomorrow",
  description:
    "Send fresh flowers online with next-day flower delivery anywhere in the USA. Roses, birthday bouquets, sympathy flowers and plants, carefully packed and shipped overnight.",
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
  /** The shop's own social profiles. Leave empty until they exist — empty links are hidden. */
  social: {
    facebook: "",
    instagram: "",
    pinterest: "",
  },
  /** Parent company (owner/operator of this store). */
  parent: {
    name: "M&R Marketing Group, LLC",
    url: "https://www.mandr-group.com/",
    description: "a full-service marketing agency in Macon, Georgia",
    sameAs: [
      "https://www.facebook.com/MandRGroup",
      "https://www.instagram.com/mandrmarketing",
      "https://www.linkedin.com/company/m&r-marketing-group",
      "https://x.com/mandrmarketing",
    ],
  },
} as const;

export const addressLine = `${site.company.street}, ${site.company.city}, ${site.company.region} ${site.company.postalCode}, USA`;

/** Delivery & pricing rules (all money in cents). */
export const commerce = {
  currency: "usd",
  /** Overnight shipping (FedEx/UPS) per order. */
  deliveryFee: 1299,
  freeDeliveryThreshold: 7900,
  /** Orders placed Mon–Fri before this hour (Eastern Time) ship the same day for next-day delivery. */
  cutoffHour: 14,
  /** Days the carrier delivers flowers. */
  deliveryDays: ["Tue", "Wed", "Thu", "Fri", "Sat"],
  maxDaysAhead: 90,
  timeZone: "America/New_York",
} as const;

/** Carrier delivery: no time windows. Kept as a list so past orders still display a label. */
export const deliveryWindows = [
  { value: "anytime", label: "By end of day (carrier delivery)" },
  { value: "morning", label: "Morning" },
  { value: "afternoon", label: "Afternoon" },
  { value: "evening", label: "Evening" },
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
