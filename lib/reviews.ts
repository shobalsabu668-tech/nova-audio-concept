/**
 * REVIEWS — illustrative sample content written for this concept.
 * They are not real customers, and the UI labels them that way wherever they
 * appear. Averages are computed from these samples only.
 */

export type Review = { handle: string; name: string; city: string; rating: number; title: string; body: string; finish: string };

export const REVIEWS_DISCLAIMER = "Sample reviews written for this concept. They are not from real customers.";

export const reviews: Review[] = [
  { handle: "nova-one", name: "Sample reviewer", city: "Bengaluru", rating: 5, title: "Fills the room without trying", body: "Placed it in a corner and the sound still felt centred. The status ring is subtle at night.", finish: "Graphite" },
  { handle: "nova-one", name: "Sample reviewer", city: "Pune", rating: 5, title: "An object first", body: "The Bone finish looks like it belongs on a bookshelf, not in a tech drawer.", finish: "Bone" },
  { handle: "nova-one", name: "Sample reviewer", city: "Kochi", rating: 4, title: "Big sound, bigger than I needed", body: "Wonderful in the living room. For the bedroom I'd pick the ORB.", finish: "Ember" },
  { handle: "nova-mini", name: "Sample reviewer", city: "Goa", rating: 5, title: "Survived the monsoon", body: "Left it on the balcony through a downpour. Still plays, still sounds full.", finish: "Ember" },
  { handle: "nova-mini", name: "Sample reviewer", city: "Chennai", rating: 4, title: "Great on the dock", body: "Portable during the day, a desk speaker at night. Wish it came with the dock.", finish: "Bone" },
  { handle: "nova-mini", name: "Sample reviewer", city: "Mumbai", rating: 5, title: "Twenty hours is real", body: "Three days of evenings on one charge.", finish: "Ion" },
  { handle: "nova-arc", name: "Sample reviewer", city: "Hyderabad", rating: 5, title: "Replaced a soundbar and two speakers", body: "One box under the TV, and the room sounds wider than the wall.", finish: "Graphite" },
  { handle: "nova-arc", name: "Sample reviewer", city: "Delhi", rating: 4, title: "Heavy, in a good way", body: "Feels like furniture. Setup took two minutes.", finish: "Bone" },
  { handle: "nova-orb", name: "Sample reviewer", city: "Mysuru", rating: 5, title: "The sunrise light is the feature", body: "I wake up before the alarm now. The crown is lovely to turn.", finish: "Bone" },
  { handle: "nova-orb", name: "Sample reviewer", city: "Bengaluru", rating: 4, title: "Perfect bedside size", body: "Night mode means I can watch a film without waking anyone.", finish: "Graphite" },
  { handle: "nova-sub", name: "Sample reviewer", city: "Chandigarh", rating: 5, title: "Felt more than heard", body: "Paired with two ONEs. Tuned itself; I didn't touch a setting.", finish: "Graphite" },
];

export function reviewsFor(handle: string) {
  const list = reviews.filter((r) => r.handle === handle);
  const average = list.length ? list.reduce((n, r) => n + r.rating, 0) / list.length : 0;
  const distribution = [5, 4, 3, 2, 1].map((stars) => ({ stars, count: list.filter((r) => r.rating === stars).length }));
  return { list, average, distribution };
}
