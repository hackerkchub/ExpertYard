// src/services/expertService.js
import { v4 as uuid } from "uuid";

/* ----------------------------------------------
   1. Helper: Random element selector
---------------------------------------------- */
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

/* ----------------------------------------------
   2. Base arrays for random generation
---------------------------------------------- */
const firstNames = ["Riya", "Karan", "Ayesha", "Raghav", "Neha", "Siddharth", "Meera", "Arjun", "Rahul", "Kabir"];
const lastNames  = ["Desai", "Sharma", "Kapoor", "Verma", "Nair", "Patil", "Mehta", "Rao", "Gill", "Fernandes"];
const languages  = ["English", "Hindi", "Marathi", "Gujarati", "Tamil", "Kannada"];
const skillsBase = ["Communication", "Leadership", "Time Management", "Problem Solving", "Critical Thinking"];

const randomImg = [
  "https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg",
  "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
  "https://images.pexels.com/photos/4937227/pexels-photo-4937227.jpeg",
  "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg",
  "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg",
  "https://images.pexels.com/photos/7643745/pexels-photo-7643745.jpeg"
];

/* ----------------------------------------------
   3. EXPERT GENERATOR (MAIN FUNCTION)
---------------------------------------------- */
const generateExpert = (professionId, specialityId, specialityLabel) => {
  const name = `${pick(firstNames)} ${pick(lastNames)}`;

  return {
    id: uuid(),
    professionId,
    specialityId,

    name,
    role: `${specialityLabel} Specialist`,
    rating: (Math.random() * 1.5 + 3.5).toFixed(1),
    experienceYears: Math.floor(Math.random() * 10) + 2,
    reviews: Math.floor(Math.random() * 300) + 20,
    online: Math.random() > 0.3,
    img: pick(randomImg),

    callPrice: Math.floor(Math.random() * 40) + 20,
    chatPrice: Math.floor(Math.random() * 10) + 5,

    about: `Hi, I am ${name}, a professional ${specialityLabel} expert with hands-on experience and a strong track record of delivering results.`,

    education: [
      "B.Tech in Computer Science",
      "Master Certification in Specialisation Field"
    ],

    mainExpertise: specialityLabel,

    otherExpertise: [
      "Advanced Strategy",
      "Problem Solving",
      "Client Communication",
      "Professional Guidance"
    ],

    languages: [pick(languages), pick(languages)],

    skills: [
      pick(skillsBase),
      pick(skillsBase),
      pick(skillsBase),
      specialityLabel
    ],

    reviewsList: [
      { name: "Arjun M.", text: "Very helpful and knowledgeable." },
      { name: "Sneha P.", text: "Great communication and expertise." }
    ]
  };
};

/* ----------------------------------------------
   4. SUBCATEGORY MAP
---------------------------------------------- */
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
    techlead: "Tech Lead Mentor"
  },

  lawyers: {
    civil: "Civil Lawyer",
    criminal: "Criminal Lawyer",
    corporate: "Corporate Lawyer",
    family: "Family Lawyer",
    ip: "IP / Trademark Lawyer"
  },

  therapists: {
    stress: "Stress Therapist",
    anxiety: "Anxiety Specialist",
    relationship: "Relationship Coach",
    mindfulness: "Mindfulness Coach",
    career: "Career Stress Coach"
  },

  fitness: {
    weightloss: "Weight Loss Coach",
    strength: "Strength Trainer",
    yoga: "Yoga Coach",
    nutrition: "Nutrition Expert",
    sports: "Sports Fitness Trainer"
  },

  business: {
    startup: "Startup Mentor",
    marketing: "Marketing Strategist",
    sales: "Sales Coach",
    finance: "Finance Advisor",
    ops: "Operations Consultant"
  },

  global: {
    product: "Product Strategist",
    design: "UX/UI Designer",
    ai: "AI/ML Architect",
    cloud: "Cloud Architect",
    strategy: "Business Strategist"
  }
};

/* --------------------------------------------------
   5. MAIN FUNCTION — RETURNS ALL EXPERTS
-------------------------------------------------- */
export const getAllExperts = async () => {
  let all = [];

  Object.entries(SUBCATEGORIES).forEach(([professionId, subs]) => {
    Object.entries(subs).forEach(([specialityId, specialityLabel]) => {

      // Generate 10 experts for each subcategory
      for (let i = 0; i < 10; i++) {
        all.push(generateExpert(professionId, specialityId, specialityLabel));
      }

    });
  });

  return new Promise((resolve) => {
    setTimeout(() => resolve(all), 300);
  });
};
