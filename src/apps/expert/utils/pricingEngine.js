export function getSmartPricing(data) {
  // base depending on category
  const BASE = {
    engineers: 40,
    doctors: 70,
    mentors: 35,
    lawyers: 65,
    therapists: 45,
    fitness: 30,
    business: 55,
    global: 90,
  };

  // category base price
  let call = BASE[data.category_id] || 40;

  // experience factor
  const exp = Number(data.experienceYears || data.experience_years || 2);

  if (exp >= 10) call *= 1.5;
  else if (exp >= 8) call *= 1.35;
  else if (exp >= 5) call *= 1.20;
  else if (exp >= 3) call *= 1.10;

  // subcategory high demand
  const HIGH_DEMAND = [
    "ai", "neuro", "cardio", "startup", "cloud", "finance", "product"
  ];

  if (HIGH_DEMAND.includes(data.subcategory_id)) {
    call *= 1.20;
  }

  // round like real pricing
  call = Math.round(call / 5) * 5;

  const chat = Math.max(5, Math.round(call * 0.4));

  return {
    call,
    chat,
    range: {
      min: Math.round(call * 0.9),
      max: Math.round(call * 1.1),
    }
  };
}
