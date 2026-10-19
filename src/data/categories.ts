/**
 * Shop categories. Each one is a top-level SEO landing page (e.g. /birthday-flowers) targeting the
 * head keyword of that occasion/flower. Products link to categories through their `categories` slugs.
 */
export type CategoryGroup = "occasion" | "flower" | "collection";

export type Category = {
  slug: string;
  name: string;
  group: CategoryGroup;
  h1: string;
  seoTitle: string;
  seoDescription: string;
  intro: string;
  image: string;
  body: { heading: string; text: string }[];
  faqs?: { q: string; a: string }[];
};

export const categories: Category[] = [
  // ───────────── Occasions ─────────────
  {
    slug: "birthday-flowers",
    name: "Birthday",
    group: "occasion",
    h1: "Birthday Flowers & Same-Day Birthday Delivery",
    seoTitle: "Birthday Flowers Delivery | Same-Day Birthday Bouquets",
    seoDescription:
      "Send birthday flowers today. Bright, florist-designed birthday bouquets with same-day delivery across the USA. Add balloons, chocolates and a free card message.",
    intro:
      "Make their day unforgettable with a burst of color. Our birthday bouquets are hand-arranged by local florists and can arrive today when you order before 2 PM in the recipient's time zone.",
    image: "cat/birthday",
    body: [
      {
        heading: "Birthday flowers that feel personal",
        text: "Think about their favorite color, their personality and where the flowers will live. Cheerful sunflowers and gerbera daisies suit a sunny office desk, while blush roses and peonies bring softness to a living room. Every arrangement includes a free personalized card message so your words arrive with the blooms.",
      },
      {
        heading: "Last-minute? We deliver birthday flowers today",
        text: "Forgot until this morning? It happens. Choose any bouquet marked Same-Day, pick today's date at checkout and our florist partners will hand-deliver it this afternoon or evening. Need it to be extra special? Add a balloon, a plush bear or gourmet truffles.",
      },
    ],
    faqs: [
      { q: "Can I get birthday flowers delivered today?", a: "Yes. Order any Same-Day eligible bouquet before 2 PM in the recipient's local time, Monday–Saturday, and it will be hand-delivered today." },
      { q: "What are the best flowers for a birthday?", a: "Bright mixed bouquets, sunflowers, gerbera daisies and pink roses are our most-gifted birthday flowers. You can also choose their birth-month flower for a thoughtful touch." },
      { q: "Can I include a message and a gift?", a: "Every order includes a free card message. You can add balloons, chocolates, a teddy bear or a premium vase on the product page." },
    ],
  },
  {
    slug: "anniversary-flowers",
    name: "Anniversary",
    group: "occasion",
    h1: "Anniversary Flowers Delivered",
    seoTitle: "Anniversary Flowers Delivery | Romantic Roses & Bouquets",
    seoDescription:
      "Celebrate every year together with romantic anniversary flowers. Red roses, peonies and luxury bouquets delivered same day across the US.",
    intro:
      "From the first year to the fiftieth, say what words can't with romantic anniversary flowers—classic red roses, lush peonies and elegant designs your partner will remember.",
    image: "cat/anniversary",
    body: [
      {
        heading: "Romance in every petal",
        text: "Red roses remain the timeless symbol of love, but anniversaries are a wonderful time to personalize. Recreate the flowers from your wedding day, choose blooms in their favorite color, or go big with our luxury rose box for a milestone year.",
      },
      {
        heading: "Anniversary flowers by year",
        text: "Traditional anniversary flowers include carnations for the 1st year, lily of the valley for the 2nd, sunflowers for the 3rd, daisies for the 5th, and roses for the 15th. Our florists are happy to help match your bouquet to the year you are celebrating.",
      },
    ],
  },
  {
    slug: "sympathy-flowers",
    name: "Sympathy & Funeral",
    group: "occasion",
    h1: "Sympathy & Funeral Flowers",
    seoTitle: "Sympathy Flowers & Funeral Flower Delivery | Same Day",
    seoDescription:
      "Express your condolences with sympathy flowers and funeral arrangements. Peaceful white bouquets, wreaths and standing tributes delivered same day to homes and funeral homes.",
    intro:
      "When words feel inadequate, flowers offer comfort. Our sympathy arrangements are designed with care and delivered with discretion to homes, funeral homes and places of worship.",
    image: "cat/sympathy",
    body: [
      {
        heading: "Choosing sympathy flowers",
        text: "Arrangements sent to the family's home are typically smaller vase designs or plants that can be enjoyed for weeks. For a service, wreaths, hearts and standing tributes are displayed near the casket or memorial. White lilies, roses and chrysanthemums are traditional choices that convey peace and remembrance.",
      },
      {
        heading: "Funeral flower delivery you can rely on",
        text: "Include the name of the deceased, the funeral home and the service time in the delivery instructions and our team will coordinate timing directly with the venue. Need help choosing? Call us at (478) 219-8398 and we'll guide you with compassion.",
      },
    ],
    faqs: [
      { q: "What should I write on a sympathy card?", a: "Keep it short and sincere, e.g. \"With deepest sympathy,\" \"Holding you close in our thoughts,\" or \"Forever in our hearts.\" Sign with your full name so the family knows who sent it." },
      { q: "Can you deliver to a funeral home today?", a: "Yes. Order before 2 PM local time and add the funeral home name and service time in the delivery instructions; we coordinate directly with the venue." },
    ],
  },
  {
    slug: "love-and-romance-flowers",
    name: "Love & Romance",
    group: "occasion",
    h1: "Love & Romance Flowers",
    seoTitle: "Romantic Flowers Delivery | Red Roses for Love & Romance",
    seoDescription:
      "Sweep them off their feet with romantic flowers. Red roses, pink rose bouquets and luxury arrangements with same-day delivery nationwide.",
    intro: "Just because, date night or a big question—romantic flowers say “I love you” beautifully.",
    image: "cat/love-romance",
    body: [
      {
        heading: "More than red roses",
        text: "A dozen red roses is the classic romantic gesture, but pink roses express admiration, peonies symbolize a happy relationship, and tulips declare perfect love. Mix and match with add-ons like chocolates for a gift that feels complete.",
      },
    ],
  },
  {
    slug: "get-well-flowers",
    name: "Get Well",
    group: "occasion",
    h1: "Get Well Soon Flowers",
    seoTitle: "Get Well Flowers Delivery | Cheerful Get Well Soon Bouquets",
    seoDescription:
      "Brighten their recovery with get well flowers. Cheerful sunflowers, tulips and plants delivered same day to homes and hospitals across the USA.",
    intro: "Sunny blooms are proven mood boosters. Send cheerful get well flowers to help someone feel better, faster.",
    image: "cat/get-well",
    body: [
      {
        heading: "Hospital-friendly flowers",
        text: "Many hospitals restrict strongly scented flowers or plants in ICU units. Bright, low-fragrance designs like sunflowers, tulips and gerbera daisies are perfect, and we always recommend checking the hospital's policy before ordering. Plants and succulents are long-lasting alternatives for recovery at home.",
      },
    ],
  },
  {
    slug: "congratulations-flowers",
    name: "Congratulations",
    group: "occasion",
    h1: "Congratulations Flowers",
    seoTitle: "Congratulations Flowers Delivery | Graduation & New Job Bouquets",
    seoDescription:
      "Celebrate big wins with congratulations flowers. Vibrant bouquets for graduations, promotions, new homes and more—delivered same day.",
    intro: "New job, graduation, new home or a big promotion—celebrate their achievement with a bouquet as bright as their future.",
    image: "cat/congratulations",
    body: [
      {
        heading: "Celebrate milestones in full color",
        text: "Bold mixed bouquets with gerberas, roses and sunflowers capture the excitement of a big win. Pair your flowers with a balloon for a celebratory finishing touch.",
      },
    ],
  },
  {
    slug: "thank-you-flowers",
    name: "Thank You",
    group: "occasion",
    h1: "Thank You Flowers",
    seoTitle: "Thank You Flowers Delivery | Send Gratitude Bouquets",
    seoDescription: "Say thank you with flowers. Elegant thank-you bouquets for teachers, hosts, colleagues and friends with same-day delivery.",
    intro: "Gratitude grows when you share it. Thank a host, teacher, colleague or friend with fresh, hand-tied blooms.",
    image: "cat/thank-you",
    body: [
      {
        heading: "A thoughtful thank you",
        text: "Pink flowers convey appreciation and gratitude, while yellow blooms celebrate friendship. A mid-sized vase arrangement is the perfect size for a desk or kitchen table.",
      },
    ],
  },
  {
    slug: "new-baby-flowers",
    name: "New Baby",
    group: "occasion",
    h1: "New Baby Flowers",
    seoTitle: "New Baby Flowers Delivery | Welcome Baby Bouquets",
    seoDescription: "Welcome a little one with soft new baby flowers. Pastel bouquets and gifts delivered to homes and hospitals nationwide.",
    intro: "Welcome the newest arrival with soft pastels and gentle blooms for the proud new parents.",
    image: "cat/new-baby",
    body: [
      {
        heading: "Gentle blooms for new parents",
        text: "Soft pinks, whites and creams with baby's breath create a calm, joyful feeling. Add a plush teddy bear to make it a keepsake for the nursery.",
      },
    ],
  },
  {
    slug: "mothers-day-flowers",
    name: "Mother's Day",
    group: "occasion",
    h1: "Mother's Day Flowers",
    seoTitle: "Mother's Day Flowers Delivery | Bouquets for Mom",
    seoDescription:
      "Show Mom how much she means with Mother's Day flowers. Peonies, roses, tulips and gift sets delivered nationwide. Order early for guaranteed delivery.",
    intro: "She deserves the very best. Pick her favorites—or let our florists design something as unique as she is.",
    image: "cat/peonies",
    body: [
      {
        heading: "Order Mother's Day flowers early",
        text: "Mother's Day is the busiest flower holiday of the year. Schedule your delivery up to 90 days ahead to lock in your preferred date and the freshest selection.",
      },
    ],
  },
  {
    slug: "valentines-day-flowers",
    name: "Valentine's Day",
    group: "occasion",
    h1: "Valentine's Day Flowers & Roses",
    seoTitle: "Valentine's Day Flowers Delivery | Red Roses for Valentine's",
    seoDescription: "Order Valentine's Day flowers and roses for delivery. Classic dozen red roses, luxury rose boxes and romantic bouquets.",
    intro: "Nothing says Valentine's Day like roses. Choose a classic dozen, two dozen or our showstopping rose box.",
    image: "cat/love-romance",
    body: [
      {
        heading: "Valentine's delivery tips",
        text: "February 14 deliveries fill up fast. Order early, add a delivery window, and include a heartfelt card message—it's free with every order.",
      },
    ],
  },

  // ───────────── Flower types ─────────────
  {
    slug: "roses",
    name: "Roses",
    group: "flower",
    h1: "Roses Delivery",
    seoTitle: "Roses Delivery | Send a Dozen Roses Online Today",
    seoDescription:
      "Send roses online with same-day rose delivery. Dozen red roses, pink roses, rose boxes and mixed rose bouquets from expert florists.",
    intro: "The world's favorite flower, arranged by expert florists. Choose from red, pink, yellow and mixed rose bouquets.",
    image: "cat/roses",
    body: [
      {
        heading: "What rose colors mean",
        text: "Red roses symbolize love and passion. Pink roses express admiration and gratitude. Yellow roses celebrate friendship and joy, while white roses represent new beginnings and remembrance. Mixed bouquets let you say a little of everything.",
      },
      {
        heading: "Fresh roses that last",
        text: "Our roses are cut at peak freshness and shipped cold. Trim the stems at an angle, change the water every two days, and keep them away from direct sun and ripening fruit to enjoy them for a week or more.",
      },
    ],
    faqs: [
      { q: "How much does a dozen roses cost?", a: "Our Classic Dozen Red Roses start at $64.99, with Deluxe and Premium sizes that add more stems and a designer vase." },
      { q: "Can I send roses same day?", a: "Yes—every rose bouquet is eligible for same-day delivery when ordered before 2 PM in the recipient's time zone." },
    ],
  },
  {
    slug: "sunflowers",
    name: "Sunflowers",
    group: "flower",
    h1: "Sunflower Bouquets",
    seoTitle: "Sunflower Delivery | Sunflower Bouquets Delivered Today",
    seoDescription: "Brighten any day with sunflower delivery. Cheerful sunflower bouquets and arrangements with same-day delivery across the USA.",
    intro: "Pure sunshine in a vase. Sunflowers symbolize loyalty, adoration and happiness.",
    image: "cat/sunflowers",
    body: [{ heading: "Why everyone loves sunflowers", text: "Sunflowers are bold, happy and long-lasting, making them perfect for birthdays, get well wishes and thank-yous. They pair beautifully with roses, daisies and greenery." }],
  },
  {
    slug: "tulips",
    name: "Tulips",
    group: "flower",
    h1: "Tulip Delivery",
    seoTitle: "Tulip Delivery | Fresh Tulip Bouquets Online",
    seoDescription: "Send fresh tulips with same-day delivery. Pink, white and mixed tulip bouquets hand-arranged by local florists.",
    intro: "Graceful and elegant, tulips are the flower of spring and perfect love.",
    image: "cat/tulips",
    body: [{ heading: "Tulips keep growing", text: "Did you know tulips keep growing up to an inch after they're cut? They gracefully bend toward the light, giving each arrangement a living, artful shape." }],
  },
  {
    slug: "lilies",
    name: "Lilies",
    group: "flower",
    h1: "Lily Bouquets",
    seoTitle: "Lily Delivery | Calla Lily & Stargazer Lily Bouquets",
    seoDescription: "Order elegant lily bouquets for delivery. Calla lilies and pink lilies for sympathy, anniversaries and celebrations.",
    intro: "Elegant, fragrant and statuesque—lilies bring sophistication to any occasion.",
    image: "cat/lilies",
    body: [{ heading: "Lilies for every occasion", text: "White calla lilies are a symbol of purity and are often chosen for sympathy and weddings, while pink lilies express prosperity and admiration. Note: lilies are toxic to cats, so consider an alternative for cat owners." }],
  },
  {
    slug: "orchids",
    name: "Orchids",
    group: "flower",
    h1: "Orchid Delivery",
    seoTitle: "Orchid Delivery | Phalaenopsis Orchid Plants Delivered",
    seoDescription: "Send an orchid plant that blooms for months. Purple and white phalaenopsis orchids in decorative pots with nationwide delivery.",
    intro: "Exotic, elegant and long-lasting. Orchid plants bloom for 6–12 weeks with minimal care.",
    image: "cat/orchids",
    body: [{ heading: "Easy orchid care", text: "Place in bright, indirect light and water with three ice cubes once a week. When blooms fade, trim the spike and your orchid will rebloom." }],
  },
  {
    slug: "peonies",
    name: "Peonies",
    group: "flower",
    h1: "Peony Bouquets",
    seoTitle: "Peony Delivery | Luxurious Peony Bouquets",
    seoDescription: "Lush, romantic peony bouquets for delivery. Pink and white peonies arranged by expert florists—perfect for Mother's Day and anniversaries.",
    intro: "Romantic, ruffled and lush—peonies symbolize a happy life and good fortune.",
    image: "cat/peonies",
    body: [{ heading: "Peony season", text: "Peonies peak from late spring into early summer. Our florists source the most beautiful stems from growers around the world so you can send them more of the year." }],
  },
  {
    slug: "hydrangeas",
    name: "Hydrangeas",
    group: "flower",
    h1: "Hydrangea Arrangements",
    seoTitle: "Hydrangea Delivery | Hydrangea Bouquets & Arrangements",
    seoDescription: "Full, cloud-like hydrangea arrangements with roses and seasonal blooms, delivered same day.",
    intro: "Big, beautiful blooms with a romantic, garden-gathered feel.",
    image: "cat/hydrangeas",
    body: [{ heading: "Hydrangea care", text: "Hydrangeas drink through their petals too—mist them daily and keep the vase full of cool water." }],
  },
  {
    slug: "flower-bouquets",
    name: "Mixed Bouquets",
    group: "flower",
    h1: "Fresh Flower Bouquets",
    seoTitle: "Flower Bouquets Delivery | Fresh Mixed Bouquets Online",
    seoDescription: "Shop fresh flower bouquets online. Colorful mixed bouquets, wildflowers and seasonal designs delivered same day nationwide.",
    intro: "Our florists' favorite seasonal blooms, gathered into colorful, one-of-a-kind bouquets.",
    image: "cat/mixed",
    body: [{ heading: "Florist's choice", text: "Mixed bouquets showcase what's freshest and most beautiful each season. Color palettes stay true to the photo while individual stems may vary slightly." }],
  },
  {
    slug: "plants",
    name: "Plants",
    group: "flower",
    h1: "Plant Delivery",
    seoTitle: "Plant Delivery | Send Succulents & Indoor Plants",
    seoDescription: "Send a gift that keeps growing. Succulents, aloe and orchid plants delivered in decorative pots across the US.",
    intro: "Low-maintenance, long-lasting gifts for plant lovers, new homes and offices.",
    image: "cat/plants",
    body: [{ heading: "Gifts that grow", text: "Plants are wonderful for sympathy, housewarmings and corporate gifts. Succulents and aloe need water only every 1–2 weeks." }],
  },

  // ───────────── Collections ─────────────
  {
    slug: "same-day-flower-delivery",
    name: "Same-Day Delivery",
    group: "collection",
    h1: "Same-Day Flower Delivery",
    seoTitle: "Same Day Flower Delivery | Send Flowers Today Nationwide",
    seoDescription:
      "Need flowers today? Same-day flower delivery across the USA, hand-arranged by local florists. Order before 2 PM recipient's time, Monday–Saturday.",
    intro:
      "Order before 2 PM in the recipient's time zone and a local florist will hand-arrange and deliver your flowers today—Monday through Saturday, in all 50 states.",
    image: "cat/same-day",
    body: [
      {
        heading: "How same-day flower delivery works",
        text: "When you place an order, it's sent to a trusted local florist near your recipient. They hand-arrange your bouquet using fresh, in-season flowers and deliver it in person—usually between noon and 8 PM. You'll get an email the moment your order is confirmed.",
      },
      {
        heading: "Same-day cut-off times",
        text: "Monday–Friday: order by 2 PM recipient's local time. Saturday: order by 12 PM. Sunday delivery is available in select metro areas. Orders placed after the cut-off are delivered the next available day.",
      },
    ],
    faqs: [
      { q: "Can flowers be delivered on the same day?", a: "Yes. Every bouquet in this collection can be delivered today when ordered before the cut-off time in the recipient's time zone." },
      { q: "How much is same-day delivery?", a: "Standard delivery is $12.99, plus a $5 same-day priority fee. Orders over $79 ship free (same-day fee still applies)." },
      { q: "Do you deliver on Sundays?", a: "Sunday delivery is available in many major cities. Choose Sunday at checkout; if it's not available in that ZIP code we'll contact you." },
    ],
  },
  {
    slug: "best-sellers",
    name: "Best Sellers",
    group: "collection",
    h1: "Best-Selling Flowers",
    seoTitle: "Best Selling Flowers | Our Most Popular Bouquets",
    seoDescription: "Shop our best-selling flowers—customer-favorite roses, sunflowers and mixed bouquets with same-day delivery.",
    intro: "The bouquets our customers send again and again. Loved, reviewed and always delivered fresh.",
    image: "cat/mixed",
    body: [{ heading: "Customer favorites", text: "These designs are the ones our customers choose most often for freshness, value and wow-factor—an easy choice for any occasion." }],
  },
  {
    slug: "luxury-flowers",
    name: "Luxury Collection",
    group: "collection",
    h1: "Luxury Flowers",
    seoTitle: "Luxury Flowers Delivery | Premium Roses & Designer Bouquets",
    seoDescription: "Send luxury flowers: premium rose boxes, designer peony bouquets and lavish arrangements for unforgettable moments.",
    intro: "Showstopping designs with premium stems, lavish sizes and elevated presentation.",
    image: "cat/luxury",
    body: [{ heading: "Premium in every detail", text: "Our luxury collection features the largest, freshest stems—hand-selected roses, garden peonies and premium vases—for milestone moments." }],
  },
  {
    slug: "flowers-under-50",
    name: "Under $50",
    group: "collection",
    h1: "Cheap Flowers Delivery – Bouquets Under $50",
    seoTitle: "Cheap Flower Delivery | Beautiful Flowers Under $50",
    seoDescription: "Affordable flowers, never cheap-looking. Beautiful bouquets under $50 with same-day flower delivery nationwide.",
    intro: "Beautiful, budget-friendly bouquets that still arrive fresh, full and florist-arranged.",
    image: "cat/tulips",
    body: [{ heading: "Affordable without compromise", text: "Our under-$50 bouquets use the same fresh flowers and expert florists as every other design—just in a smaller, perfectly-proportioned size." }],
  },
  {
    slug: "flower-gifts",
    name: "Gifts & Gift Boxes",
    group: "collection",
    h1: "Flower Gifts & Gift Boxes",
    seoTitle: "Flower Gifts Delivery | Flowers in a Box & Gift Sets",
    seoDescription: "Flowers in a box, bouquet gift sets and blooming gift crates—delivered same day. The perfect flower gift for any occasion.",
    intro: "Flowers plus a little something extra—beautifully boxed and ready to give.",
    image: "cat/gifts",
    body: [{ heading: "Make it a gift set", text: "Pair any bouquet with chocolates, a balloon or a plush bear at checkout, or choose a ready-made flower box for an unforgettable unboxing moment." }],
  },
];

export const categoryMap = new Map(categories.map((c) => [c.slug, c]));
export const occasions = categories.filter((c) => c.group === "occasion");
export const flowerTypes = categories.filter((c) => c.group === "flower");
export const collections = categories.filter((c) => c.group === "collection");
