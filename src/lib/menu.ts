export type MenuGroup = { title: string; links: { label: string; href: string }[] };
export type MenuItem = { label: string; href: string; highlight?: boolean; groups?: MenuGroup[]; feature?: { title: string; href: string; image: string; text: string } };

export const mainMenu: MenuItem[] = [
  {
    label: "Occasions",
    href: "/flowers",
    groups: [
      {
        title: "Celebrate",
        links: [
          { label: "Birthday", href: "/birthday-flowers" },
          { label: "Anniversary", href: "/anniversary-flowers" },
          { label: "Love & Romance", href: "/love-and-romance-flowers" },
          { label: "Congratulations", href: "/congratulations-flowers" },
          { label: "New Baby", href: "/new-baby-flowers" },
        ],
      },
      {
        title: "Support",
        links: [
          { label: "Sympathy & Funeral", href: "/sympathy-flowers" },
          { label: "Get Well", href: "/get-well-flowers" },
          { label: "Thank You", href: "/thank-you-flowers" },
        ],
      },
      {
        title: "Holidays",
        links: [
          { label: "Mother's Day", href: "/mothers-day-flowers" },
          { label: "Valentine's Day", href: "/valentines-day-flowers" },
        ],
      },
    ],
    feature: { title: "Birthday Best Sellers", href: "/birthday-flowers", image: "cat/birthday", text: "Bright bouquets delivered today" },
  },
  {
    label: "Flowers",
    href: "/flowers",
    groups: [
      {
        title: "By Flower",
        links: [
          { label: "Roses", href: "/roses" },
          { label: "Sunflowers", href: "/sunflowers" },
          { label: "Tulips", href: "/tulips" },
          { label: "Lilies", href: "/lilies" },
          { label: "Peonies", href: "/peonies" },
          { label: "Hydrangeas", href: "/hydrangeas" },
          { label: "Orchids", href: "/orchids" },
          { label: "Mixed Bouquets", href: "/flower-bouquets" },
        ],
      },
      {
        title: "Shop",
        links: [
          { label: "All Flowers", href: "/flowers" },
          { label: "Best Sellers", href: "/best-sellers" },
          { label: "Luxury Collection", href: "/luxury-flowers" },
          { label: "Flowers Under $50", href: "/flowers-under-50" },
        ],
      },
    ],
    feature: { title: "The Rose Shop", href: "/roses", image: "cat/roses", text: "A dozen roses from $64.99" },
  },
  { label: "Same-Day Delivery", href: "/same-day-flower-delivery", highlight: true },
  { label: "Best Sellers", href: "/best-sellers" },
  { label: "Sympathy", href: "/sympathy-flowers" },
  { label: "Plants & Gifts", href: "/flower-gifts", groups: [{ title: "Gifts", links: [{ label: "Plants & Succulents", href: "/plants" }, { label: "Orchid Plants", href: "/orchids" }, { label: "Flower Gift Boxes", href: "/flower-gifts" }] }] },
  { label: "Blog", href: "/blog" },
];

export const footerMenu: MenuGroup[] = [
  {
    title: "Shop",
    links: [
      { label: "Same-Day Flower Delivery", href: "/same-day-flower-delivery" },
      { label: "Best Sellers", href: "/best-sellers" },
      { label: "Birthday Flowers", href: "/birthday-flowers" },
      { label: "Sympathy Flowers", href: "/sympathy-flowers" },
      { label: "Roses", href: "/roses" },
      { label: "Cheap Flowers Under $50", href: "/flowers-under-50" },
      { label: "Flower Delivery by State", href: "/flower-delivery" },
    ],
  },
  {
    title: "Customer Service",
    links: [
      { label: "Contact Us", href: "/contact" },
      { label: "Track Your Order", href: "/track-order" },
      { label: "Delivery Information", href: "/delivery-information" },
      { label: "FAQ", href: "/faq" },
      { label: "100% Satisfaction Guarantee", href: "/refund-policy" },
      { label: "My Account", href: "/account" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Flower Blog", href: "/blog" },
      { label: "Flower Care Guide", href: "/blog/how-to-make-flowers-last-longer" },
      { label: "Terms of Use", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Sitemap", href: "/sitemap.xml" },
    ],
  },
];
