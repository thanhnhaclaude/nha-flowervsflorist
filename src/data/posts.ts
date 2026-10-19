/** Starting blog articles (Markdown). Inserted on first setup, then managed in /admin/posts. */
export type SeedPost = {
  slug: string;
  title: string;
  excerpt: string;
  cover: string;
  category: string;
  publishedAt: string;
  seoTitle: string;
  seoDescription: string;
  content: string;
};

export const seedPosts: SeedPost[] = [
  {
    slug: "flower-meanings-guide",
    title: "Flower Meanings: The Complete Guide to What Every Bloom Says",
    excerpt: "Roses, tulips, lilies, sunflowers and more—discover the meaning behind the world's most popular flowers so your bouquet says exactly what you mean.",
    cover: "blog/flower-meanings",
    category: "Flower Guides",
    publishedAt: "2026-09-02",
    seoTitle: "Flower Meanings Guide: What Every Flower Symbolizes",
    seoDescription: "A complete guide to flower meanings and symbolism—roses, lilies, tulips, sunflowers, orchids, peonies and more. Choose the perfect bouquet for any message.",
    content: `For centuries, people have used flowers to send messages that are hard to put into words. In the Victorian era, an entire language of flowers—called *floriography*—let admirers communicate through carefully chosen bouquets. Today, knowing a few flower meanings can help you choose a gift that feels truly intentional.

## Roses: love in every color

Roses are the most popular flower in the world, and their meaning changes with color:

- **Red roses** – deep love, passion and romance
- **Pink roses** – admiration, gratitude and joy
- **Yellow roses** – friendship and happiness
- **White roses** – new beginnings, purity and remembrance
- **Orange roses** – enthusiasm and desire

Not sure which to choose? Explore our [rose collection](/roses) or read our guide to [rose color meanings](/blog/rose-color-meanings).

## Tulips: perfect love

Tulips are the flower of spring and symbolize perfect, deep love. Red tulips declare true love, pink tulips express affection, and white tulips are used to ask for forgiveness. Their graceful, curving stems make them a favorite for [Mother's Day](/mothers-day-flowers).

## Sunflowers: adoration and loyalty

Sunflowers turn to follow the sun, which is why they've come to represent loyalty and adoration. Their bright yellow petals radiate happiness, making [sunflower bouquets](/sunflowers) perfect for get well wishes and birthdays.

## Lilies: purity and renewal

White lilies are associated with purity and the restored innocence of the soul, which is why they're one of the most common [sympathy flowers](/sympathy-flowers). Pink lilies symbolize prosperity and abundance.

## Orchids: luxury and strength

Orchids are exotic and long-lasting, symbolizing luxury, beauty and strength. An [orchid plant](/orchids) makes a thoughtful gift because it can bloom for months.

## Peonies: a happy life

In many cultures, peonies represent good fortune, prosperity and a happy marriage. They're traditional for 12th wedding anniversaries and are a beloved choice for brides.

## Choosing the right message

When in doubt, think about the person rather than the rulebook. Their favorite color, the space where the flowers will live and the occasion all matter more than any single meaning. And remember—every FlowerVsFlorist order includes a free card message so you can say it in your own words, too.`,
  },
  {
    slug: "rose-color-meanings",
    title: "Rose Color Meanings: Which Roses Should You Send?",
    excerpt: "Red for romance, yellow for friendship, pink for gratitude—here's how to pick the perfect rose color for every relationship and occasion.",
    cover: "blog/rose-colors",
    category: "Flower Guides",
    publishedAt: "2026-09-09",
    seoTitle: "Rose Color Meanings: What Each Rose Color Means",
    seoDescription: "What do red, pink, yellow, white, orange and lavender roses mean? Learn rose color meanings and how many roses to send for each occasion.",
    content: `Roses are the ultimate gift flower—but sending the wrong color can send the wrong message. Use this quick guide before you order.

## Red roses

The classic symbol of romantic love. A [dozen red roses](/product/crimson-classic-dozen-red-roses) is the most iconic Valentine's Day and anniversary gift there is.

## Pink roses

Pink roses express admiration, gratitude and gentle affection. Light pink conveys sweetness and grace; hot pink says “thank you” with enthusiasm. They're perfect for mothers, friends and colleagues.

## Yellow roses

Bright and cheerful, yellow roses celebrate friendship and joy. They're a safe, happy choice for birthdays and congratulations—with no romantic undertones.

## White roses

White roses represent new beginnings, purity and remembrance. They're popular for weddings, as well as for sympathy and memorial arrangements.

## Orange, coral and peach roses

These warm tones signal enthusiasm, energy and desire—a great choice when a relationship is moving from friendship to something more.

## Lavender roses

Rare and enchanting, lavender roses symbolize love at first sight.

## How many roses should you send?

- **1 rose** – love at first sight
- **6 roses** – “I want to be yours”
- **12 roses** – “Be mine,” a declaration of love
- **24 roses** – “I'm yours forever”
- **50+ roses** – unconditional, boundless love

Ready to send? [Rose bouquets](/roses) marked Next-Day arrive tomorrow with [next-day delivery](/next-day-flower-delivery) when you order by 2 PM Eastern, Monday–Friday.`,
  },
  {
    slug: "best-birthday-flowers",
    title: "The 10 Best Birthday Flowers (and What They Say)",
    excerpt: "From sunflowers to birth-month blooms, these are the birthday flowers that always make someone's day.",
    cover: "blog/birthday-flowers",
    category: "Occasions",
    publishedAt: "2026-09-16",
    seoTitle: "Best Birthday Flowers: 10 Ideas Everyone Loves",
    seoDescription: "The best flowers for a birthday, plus birth month flowers for every month. Find the perfect birthday bouquet with next-day delivery.",
    content: `Birthday flowers should feel like a celebration. Here are our top picks.

## 1. Sunflowers

Nothing says “happy birthday” like a burst of sunshine. [Sunflowers](/sunflowers) are cheerful, long-lasting and loved by all ages.

## 2. Gerbera daisies

Big, bold and available in every color, gerberas bring instant party energy.

## 3. Pink roses

Elegant yet joyful, pink roses express admiration—ideal for mothers, sisters and best friends.

## 4. Tulips

Graceful tulips are perfect for spring birthdays and anyone who loves a clean, modern look.

## 5. Mixed bright bouquets

Can't decide? A [vibrant mixed bouquet](/product/vibrant-birthday-bash-bouquet) gives you every color of the rainbow.

## 6–10. Lilies, orchids, peonies, hydrangeas and plants

For milestone birthdays, consider luxurious [peonies](/peonies) or an [orchid plant](/orchids) that lasts for months.

## Birth month flowers

- **January** – Carnation · **February** – Violet · **March** – Daffodil
- **April** – Daisy · **May** – Lily of the valley · **June** – Rose
- **July** – Larkspur · **August** – Gladiolus · **September** – Aster
- **October** – Marigold · **November** – Chrysanthemum · **December** – Narcissus

## Make it extra special

Add a balloon, chocolates or a plush bear on the product page, and write a heartfelt card message—it's always free. Shop all [birthday flowers](/birthday-flowers).`,
  },
  {
    slug: "how-to-make-flowers-last-longer",
    title: "How to Make Fresh Flowers Last Longer: 9 Florist Tips",
    excerpt: "Simple, florist-approved tricks to keep your bouquet fresh for a week or more.",
    cover: "blog/flower-care",
    category: "Flower Care",
    publishedAt: "2026-09-23",
    seoTitle: "How to Make Flowers Last Longer: 9 Florist Tips",
    seoDescription: "Keep cut flowers fresh longer with these 9 florist tips—trimming stems, water temperature, flower food, placement and more.",
    content: `A beautiful bouquet deserves a long life. Follow these steps the moment your flowers arrive.

## 1. Trim the stems

Cut 1–2 inches off each stem at a 45° angle with sharp scissors. This opens up the stem so it can drink.

## 2. Use clean, cool water

Fill a clean vase with cool water. Bacteria are the biggest enemy of fresh flowers.

## 3. Add flower food

The packet included with your order contains sugar for energy and an antibacterial agent. Use it!

## 4. Remove low leaves

Strip any leaves that would sit below the waterline—they rot and cloud the water.

## 5. Change the water every 2 days

Re-trim the stems each time for best results.

## 6. Keep away from heat and sun

Direct sunlight, radiators and electronics speed up wilting.

## 7. Keep away from fruit

Ripening fruit releases ethylene gas, which causes flowers to age faster.

## 8. Remove fading blooms

Pull out spent flowers so they don't affect the rest of the bouquet.

## 9. Mist delicate flowers

Hydrangeas and peonies love a gentle daily mist.

## Plant care

For [succulents and orchids](/plants), less is more: water only when the soil is dry, and keep them in bright, indirect light.`,
  },
  {
    slug: "sympathy-flower-etiquette",
    title: "Sympathy Flower Etiquette: What to Send and What to Write",
    excerpt: "A compassionate guide to choosing funeral and sympathy flowers, where to send them, and what to write on the card.",
    cover: "blog/sympathy-etiquette",
    category: "Occasions",
    publishedAt: "2026-09-30",
    seoTitle: "Sympathy Flower Etiquette: Funeral Flowers & Card Messages",
    seoDescription: "Learn sympathy flower etiquette: when to send funeral flowers vs. home arrangements, appropriate colors and what to write on a sympathy card.",
    content: `Sending flowers is one of the most meaningful ways to show support during a time of loss. Here's how to do it thoughtfully.

## Funeral service vs. family home

**For the service**, standing sprays, wreaths, hearts and crosses are displayed near the casket or memorial. These are usually sent by immediate family, close friends or organizations.

**For the family home**, smaller vase arrangements, white bouquets or plants are more appropriate. They offer comfort for days or weeks after the service.

## Appropriate flowers and colors

White lilies, roses, orchids and chrysanthemums are traditional. Soft pastels are also appropriate, especially when celebrating a life well lived. Some families prefer bright colors that reflect their loved one's personality—follow their lead if they've shared preferences.

## Timing

Flowers for a service should arrive a few hours before it begins. Flowers for the home can be sent anytime—many people appreciate them in the weeks after the funeral, when support often fades.

## What to write on a sympathy card

- “With deepest sympathy.”
- “Holding you close in our thoughts and prayers.”
- “Celebrating a beautiful life and sharing in your sorrow.”
- “Forever in our hearts.”

Always sign with your full name, and your relationship if the family may not know you.

## We're here to help

Browse our [sympathy and funeral flowers](/sympathy-flowers), or call us at (478) 219-8398 and we'll help you choose with care.`,
  },
  {
    slug: "next-day-flower-delivery-guide",
    title: "Next-Day Flower Delivery: How It Works & How to Get Flowers Tomorrow",
    excerpt: "Forgot a birthday? Here's exactly how next-day flower delivery works, the order cut-off, delivery days and tips to make sure your flowers arrive on time.",
    cover: "blog/same-day-tips",
    category: "Delivery",
    publishedAt: "2026-10-05",
    seoTitle: "Next Day Flower Delivery Guide: Cut-off Times & Tips",
    seoDescription: "How next-day flower delivery works: the 2 PM ET order cut-off, Tuesday–Saturday delivery days, shipping costs and tips for last-minute flowers.",
    content: `We've all been there—an anniversary sneaks up, or you just heard a friend isn't feeling well. Next-day flower delivery is made for exactly those moments.

## How it works

1. Choose a bouquet marked **Next-Day** on our site.
2. Pick tomorrow's date at checkout (or any Tuesday–Saturday up to 90 days ahead) and add the recipient's address.
3. We pack your flowers in a protective box with a water source and ship them overnight by FedEx or UPS. You'll get a tracking link by email.

## Cut-off times and delivery days

- **Monday–Thursday:** order by 2 PM Eastern Time for delivery the next day
- **Friday:** order by 2 PM Eastern Time for Saturday delivery
- **Weekends and holidays:** orders ship the next business day
- Carriers don't deliver flowers on **Sundays or Mondays**

## Tips for on-time delivery

- Double-check the address and include an apartment or suite number.
- Add a working phone number for the recipient—the carrier may need it.
- Sending to an office? Make sure someone will be there during business hours.
- Carriers deliver by end of day and can't promise a specific time, so for events choose a date one day early.

## When your flowers arrive

Many stems ship in bud so they last longer. Trim the stems, place them in cool water with the flower food included, and they'll open beautifully over the next day or two. See our [flower care tips](/blog/how-to-make-flowers-last-longer).

Ready? Browse [next-day flowers](/next-day-flower-delivery).`,
  },
  {
    slug: "anniversary-flowers-by-year",
    title: "Anniversary Flowers by Year: A Year-by-Year Guide",
    excerpt: "From carnations for year one to roses for year fifteen, here's the traditional anniversary flower for every milestone.",
    cover: "blog/anniversary-flowers",
    category: "Occasions",
    publishedAt: "2026-10-09",
    seoTitle: "Anniversary Flowers by Year: Traditional Flower Guide",
    seoDescription: "Find the traditional anniversary flower for every year—carnations, lily of the valley, sunflowers, daisies, roses and more.",
    content: `Just like traditional anniversary gifts, each year of marriage has its own flower.

## Year-by-year anniversary flowers

- **1st** – Carnation: young, passionate love
- **2nd** – Lily of the valley: humility and sweetness
- **3rd** – Sunflower: adoration and loyalty
- **4th** – Hydrangea: gratitude and heartfelt emotion
- **5th** – Daisy: faithful love
- **6th** – Calla lily: magnificent beauty
- **7th** – Freesia: trust
- **8th** – Lilac: first love
- **9th** – Bird of paradise: joy
- **10th** – Daffodil: happiness
- **12th** – Peony: a happy marriage
- **15th** – Rose: true love
- **20th** – Aster: patience
- **25th** – Iris: faith and hope
- **50th** – Yellow rose & violet: golden memories

## Make it personal

Recreate your wedding bouquet, choose your partner's favorite color, or go grand with a [luxury rose box](/product/luxe-signature-rose-box). Browse all [anniversary flowers](/anniversary-flowers).`,
  },
  {
    slug: "seasonal-flowers-guide",
    title: "Seasonal Flowers: What's Blooming in Spring, Summer, Fall & Winter",
    excerpt: "Choosing in-season flowers means fresher blooms and better value. Here's what's at its best each season.",
    cover: "blog/seasonal-flowers",
    category: "Flower Guides",
    publishedAt: "2026-10-14",
    seoTitle: "Seasonal Flowers Guide: Best Flowers for Every Season",
    seoDescription: "Discover which flowers are in season in spring, summer, fall and winter for the freshest, most beautiful bouquets.",
    content: `In-season flowers are fresher, last longer and often cost less. Here's what we love each season.

## Spring

[Tulips](/tulips), daffodils, hyacinths, ranunculus, lilacs and [peonies](/peonies) (late spring). Soft pastels dominate—perfect for Easter and Mother's Day.

## Summer

[Sunflowers](/sunflowers), dahlias, zinnias, [hydrangeas](/hydrangeas), lavender and garden roses. Think bright, abundant and joyful.

## Fall

Chrysanthemums, dahlias, marigolds, asters and warm-toned roses. Rich oranges, burgundies and golds with textured greenery.

## Winter

Amaryllis, paperwhites, anemones, red roses, [orchids](/orchids) and evergreens. Deep reds and crisp whites for the holidays.

## Year-round favorites

Roses, lilies, carnations, alstroemeria and orchids are available all year thanks to growers around the world.`,
  },
];
