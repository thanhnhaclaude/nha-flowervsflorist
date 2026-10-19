/** Policy & information pages (Markdown). Rendered by /[page] routes through lib/markdown. */
import { addressLine, commerce, site } from "@/lib/site";
import { usd } from "@/lib/format";

const company = `${site.company.displayName}, a ${site.company.state} limited liability company`;
const updated = "October 19, 2026";

export type InfoPage = { slug: string; title: string; seoTitle: string; description: string; updated?: string; content: string };

export const infoPages: Record<string, InfoPage> = {
  "delivery-information": {
    slug: "delivery-information",
    title: "Shipping & Delivery Information",
    seoTitle: "Flower Delivery Information: Next-Day Shipping, Fees & Cut-off Times",
    description: "Next-day flower delivery across the USA: 2 PM ET order cut-off, Tuesday–Saturday delivery days, overnight shipping fees, tracking and where we can deliver.",
    updated,
    content: `## How we deliver

Every bouquet is carefully packed in a protective box with a water source and shipped **overnight by FedEx or UPS**. Many stems are shipped in bud, so they open beautifully at home and last longer. You'll receive an email with a **tracking link** as soon as your order ships.

## Next-day delivery & cut-off times

- **Monday–Thursday:** order by **2 PM Eastern Time** and designs marked Next-Day arrive the following day.
- **Friday:** order by 2 PM ET for **Saturday** delivery.
- **After the cut-off, weekends and holidays:** your order ships on the next business day.
- **Delivery days are Tuesday through Saturday.** Carriers don't deliver flowers on Sundays or Mondays.
- Some designs (marked on the product page) need one extra day to prepare.

## Shipping fees

- **Overnight shipping:** ${usd(commerce.deliveryFee)} per order
- **Free shipping** on orders of ${usd(commerce.freeDeliveryThreshold)} or more (before taxes)
- No hidden service fees—you'll always see the exact total before you pay.

## Delivery time of day

Carriers deliver by end of day and can't guarantee a specific time. For an event or a specific occasion, we recommend choosing a delivery date one day early.

## Where we deliver

We ship to residential and business addresses throughout the continental United States. We can't deliver to P.O. boxes, military APO/FPO addresses, or outside the U.S. Some remote areas, Alaska and Hawaii may require an extra day.

- **Businesses:** include the company name and make sure the recipient will be there during business hours.
- **Hospitals:** many hospitals don't accept carrier deliveries to patient rooms—we recommend sending to the patient's home instead.
- **Funeral services:** because carrier delivery times can't be guaranteed, we recommend sending sympathy flowers to the family home rather than to a service.

## If the recipient isn't home

The carrier may leave the box at the door or in a safe place, or attempt delivery again the next business day. Please let the recipient know flowers are coming if you can, so they can be put in water promptly.

## Scheduling ahead

You can schedule delivery up to ${commerce.maxDaysAhead} days in advance—a great idea for birthdays, anniversaries and busy holidays like Valentine's Day and Mother's Day.

## Substitutions

Fresh flowers are seasonal. If a specific flower or container is unavailable, it may be replaced with one of equal or greater value while keeping the look, color palette and style of the design.

Questions? Call **${site.phoneDisplay}** or email **${site.email}**.`,
  },

  "refund-policy": {
    slug: "refund-policy",
    title: "100% Satisfaction Guarantee & Refund Policy",
    seoTitle: "100% Satisfaction Guarantee & Refund Policy",
    description: "Our 100% satisfaction guarantee: if your flowers aren't right, we'll send a replacement or refund your order.",
    updated,
    content: `We want every bouquet to make someone smile. If something isn't right, we'll make it right.

## Our guarantee

If your flowers arrive damaged, wilted, noticeably different from what you ordered, or arrive later than the delivery date you chose, contact us **within 7 days of the delivery date**. We'll offer a **free replacement** or a **full refund** of the affected item(s)—your choice.

## How to request help

1. Email **${site.email}** or call **${site.phoneDisplay}** with your order number.
2. If possible, include a photo of the arrangement.
3. We typically respond within one business day.

## Cancellations & changes

- Orders can be canceled or changed for a full refund **until they ship** (orders ship by 2 PM ET the business day before delivery).
- Once an order has shipped, it can't be canceled or redirected.

## When a refund may not apply

- An incorrect or incomplete address or phone number was provided, or the recipient refused delivery.
- The box was delivered as addressed and left unopened for an extended time, or was left outdoors in extreme weather at your request.
- Delays caused by severe weather or carrier disruptions outside our control (we'll still work with you to make it right).
- Natural variation in seasonal flowers or container substitutions of equal or greater value (see our [Delivery Information](/delivery-information)).

## Refund timing

Approved refunds are issued to your original payment method within 2 business days. Depending on your bank, they may take 5–10 business days to appear.`,
  },

  terms: {
    slug: "terms",
    title: "Terms of Use",
    seoTitle: "Terms of Use",
    description: `Terms of use for ${site.domain}, operated by ${site.company.displayName}.`,
    updated,
    content: `These Terms of Use ("Terms") govern your use of **${site.domain}** (the "Site") and purchases made through it. The Site is owned and operated by **${company}** ("we," "us," "our"), with its principal office at ${addressLine}. By using the Site or placing an order, you agree to these Terms.

## Orders & pricing

All prices are in U.S. dollars. We reserve the right to correct pricing errors and to refuse or cancel any order, including after it has been placed, in which case any payment will be refunded. Product photos are representative; arrangements are hand-crafted and may vary slightly as described in our [Delivery Information](/delivery-information).

## Payment

Payments are processed by Stripe, Inc. We do not store your full card number. By submitting payment, you represent that you are authorized to use the payment method.

## Delivery

Delivery dates and windows are estimates and are subject to our [Delivery Information](/delivery-information). Risk of loss passes upon delivery to the recipient's address.

## Satisfaction guarantee

Our refund and replacement commitments are described in our [Satisfaction Guarantee & Refund Policy](/refund-policy).

## Promo codes

Promo codes are limited to one per order, have no cash value, cannot be applied to past orders, and may be modified or withdrawn at any time.

## Accounts

You are responsible for keeping your account password confidential and for activity under your account. Notify us immediately of any unauthorized use.

## Reviews & content you submit

By submitting a review or other content, you grant us a non-exclusive, royalty-free license to display it on the Site. We moderate reviews and may decline content that is unlawful, offensive, or unrelated to the product.

## Intellectual property

The Site's design, text, logos and graphics are owned by or licensed to us and may not be copied without permission.

## Disclaimers & limitation of liability

The Site is provided "as is." To the fullest extent permitted by law, our liability for any claim arising from an order is limited to the amount you paid for that order.

## Governing law

These Terms are governed by the laws of the State of ${site.company.state}, without regard to conflict-of-law rules. Any dispute shall be brought in the state or federal courts located in Bibb County, Georgia.

## Contact

${site.company.displayName} · ${addressLine} · ${site.phoneDisplay} · ${site.email}`,
  },

  "privacy-policy": {
    slug: "privacy-policy",
    title: "Privacy Policy",
    seoTitle: "Privacy Policy",
    description: `How ${site.name} (${site.company.displayName}) collects, uses and protects your personal information.`,
    updated,
    content: `This Privacy Policy explains how **${company}** ("we," "us") collects, uses and shares information when you use **${site.domain}**.

## Information we collect

- **Order information:** your name, email, phone number; the recipient's name, phone and delivery address; card message and delivery instructions.
- **Account information:** name, email, phone and a securely hashed password if you create an account; saved addresses and wishlist.
- **Payment information:** processed directly by Stripe. We receive limited details (such as payment status) but never your full card number.
- **Communications:** messages you send us and newsletter subscriptions.
- **Technical data:** IP address, browser type and pages visited, used for security and to operate the Site.

## How we use information

- To process, deliver and support your orders, including sharing delivery details with our fulfillment partners and shipping carriers (FedEx, UPS).
- To send order confirmations and delivery updates.
- To send marketing emails if you subscribe (you can unsubscribe anytime).
- To prevent fraud and secure the Site, and to comply with legal obligations.

## How we share information

We share information only with service providers who help us operate—such as our payment processor (Stripe), email provider, hosting provider, fulfillment partners and shipping carriers—and when required by law. **We do not sell your personal information.**

## Cookies

We use essential cookies to keep your cart and sign-in session working. We do not use third-party advertising cookies.

## Data retention

We keep order records as long as needed for accounting, tax and legal purposes, and account data until you ask us to delete it.

## Your choices & rights

You may request access to, correction of, or deletion of your personal information by emailing ${site.email}. Depending on where you live (for example, California), you may have additional rights, which we will honor as required by law.

## Children

The Site is not directed to children under 13, and we do not knowingly collect their information.

## Security

We use encryption in transit (HTTPS), hashed passwords and access controls. No system is 100% secure, but we work hard to protect your data.

## Contact

${site.company.displayName} · ${addressLine} · ${site.email} · ${site.phoneDisplay}`,
  },
};
