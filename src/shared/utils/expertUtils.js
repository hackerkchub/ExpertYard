// src/utils/expertUtils.js

/* ------------------------------------------------------------------
   1. SUBCATEGORY MAP (Used across the app)
-------------------------------------------------------------------*/
export const SUBCATEGORIES = {
  engineers: {
    frontend: "Frontend Engineer",
    backend: "Backend Engineer",
    fullstack: "Full-Stack Engineer",
    devops: "DevOps Engineer",
    data: "Data / ML Engineer",
  },
  doctors: {
    cardio: "Heart Specialist",
    dentist: "Dentist",
    neuro: "Neurologist",
    derma: "Dermatologist",
    general: "General Physician",
  },
  mentors: {
    resume: "Resume Expert",
    interview: "Interview Coach",
    career: "Career Mentor",
    product: "Product Mentor",
    techlead: "Tech Lead Mentor",
  },
  lawyers: {
    civil: "Civil Lawyer",
    criminal: "Criminal Lawyer",
    corporate: "Corporate Lawyer",
    family: "Family Lawyer",
    ip: "IP / Trademark Lawyer",
  },
  therapists: {
    stress: "Stress Therapist",
    anxiety: "Anxiety Specialist",
    relationship: "Relationship Coach",
    mindfulness: "Mindfulness Coach",
    career: "Career Stress Coach",
  },
  fitness: {
    weightloss: "Weight Loss Coach",
    strength: "Strength Trainer",
    yoga: "Yoga Coach",
    nutrition: "Nutrition Expert",
    sports: "Sports Fitness Trainer",
  },
  business: {
    startup: "Startup Mentor",
    marketing: "Marketing Strategist",
    sales: "Sales Coach",
    finance: "Finance Advisor",
    ops: "Operations Consultant",
  },
  global: {
    product: "Product Strategist",
    design: "UX/UI Designer",
    ai: "AI/ML Architect",
    cloud: "Cloud Architect",
    strategy: "Business Strategist",
  }
};


/* ------------------------------------------------------------------
   2. PROFESSION LIST  
-------------------------------------------------------------------*/
export const getProfessionList = () => {
  return Object.keys(SUBCATEGORIES);
};


/* ------------------------------------------------------------------
   3. SUBCATEGORY LIST FOR A PROFESSION  
-------------------------------------------------------------------*/
export const getSubcategoriesForProfession = (professionId) => {
  return SUBCATEGORIES[professionId] || {};
};


/* ------------------------------------------------------------------
   4. GET EXPERTS BY PROFESSION  
-------------------------------------------------------------------*/
export const getExpertsByProfession = (experts, professionId) => {
  return experts.filter(e => e.professionId === professionId);
};


/* ------------------------------------------------------------------
   5. GET EXPERTS BY SPECIALITY  
-------------------------------------------------------------------*/
export const getExpertsBySpeciality = (experts, professionId, specialityId) => {
  return experts.filter(
    e => e.professionId === professionId && e.specialityId === specialityId
  );
};


/* ------------------------------------------------------------------
   6. SEARCH FILTER  
-------------------------------------------------------------------*/
export const filterExperts = (experts, searchText) => {
  if (!searchText.trim()) return experts;

  const q = searchText.toLowerCase();

  return experts.filter((e) =>
    e.name.toLowerCase().includes(q) ||
    e.role.toLowerCase().includes(q) ||
    e.mainExpertise.toLowerCase().includes(q)
  );
};


/* ------------------------------------------------------------------
   7. SORTERS  
-------------------------------------------------------------------*/
export const sortExperts = (experts, sortBy) => {
  const sorted = [...experts];

  switch (sortBy) {
    case "rating-high":
      return sorted.sort((a, b) => b.rating - a.rating);

    case "rating-low":
      return sorted.sort((a, b) => a.rating - b.rating);

    case "experience-high":
      return sorted.sort((a, b) => b.experienceYears - a.experienceYears);

    case "budget-low":
      return sorted.sort((a, b) => a.callPrice - b.callPrice);

    case "budget-high":
      return sorted.sort((a, b) => b.callPrice - a.callPrice);

    default:
      return sorted;
  }
};
