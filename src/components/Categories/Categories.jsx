// src/components/Categories/Categories.jsx
import React, { useState, useEffect, useMemo } from "react";

import {
  Wrap,
  SectionHeader,
  Title,
  Subtitle,
  ActionsRow,
  ActionCard,
  ActionIcon,
  ActionTitle,
  TabsRow,
  TabButton,
  FiltersRow,
  FilterChip,
  ExpertsStrip,
  ExpertCard,
  Avatar,
  ExpertName,
  ExpertProfession,
  ExpertSpeciality,
  ExpertTag,
  SkeletonCard,
  SkeletonAvatar,
  SkeletonLine,
} from "./Categories.styles";

// ICONS
import {
  FiUserCheck,
  FiMessageCircle,
  FiCpu,
  FiHeart,
  FiBriefcase,
  FiTrendingUp,
  FiActivity,
  FiGlobe,
} from "react-icons/fi";
import { FaUserTie } from "react-icons/fa";

// ----------------------------
// Profession Tabs
// ----------------------------
const PROFESSION_TABS = [
  { id: "doctors", label: "Doctors", icon: FiHeart },
  { id: "engineers", label: "Engineers", icon: FiCpu },
  { id: "mentors", label: "Career Mentors", icon: FiTrendingUp },
  { id: "lawyers", label: "Lawyers", icon: FaUserTie },
  { id: "therapists", label: "Therapists", icon: FiActivity },
  { id: "fitness", label: "Fitness Coaches", icon: FiActivity },
  { id: "business", label: "Business Advisors", icon: FiBriefcase },
  { id: "global", label: "Global Experts", icon: FiGlobe },
];

// ----------------------------
// Speciality Filters
// ----------------------------
const SPECIALITIES = {
  doctors: [
    { id: "all", label: "All" },
    { id: "cardio", label: "Heart Specialist" },
    { id: "dentist", label: "Dentist" },
    { id: "neuro", label: "Neurologist" },
    { id: "derma", label: "Skin Specialist" },
    { id: "general", label: "General Physician" },
  ],
  engineers: [
    { id: "all", label: "All" },
    { id: "frontend", label: "Frontend" },
    { id: "backend", label: "Backend" },
    { id: "fullstack", label: "Full-Stack" },
    { id: "devops", label: "DevOps" },
    { id: "data", label: "Data / ML" },
  ],
  mentors: [
    { id: "all", label: "All" },
    { id: "career", label: "Career Mentor" },
    { id: "interview", label: "Interview Coach" },
    { id: "resume", label: "Resume Expert" },
    { id: "product", label: "Product Mentor" },
    { id: "techlead", label: "Tech Lead Mentor" },
  ],
  lawyers: [
    { id: "all", label: "All" },
    { id: "civil", label: "Civil" },
    { id: "criminal", label: "Criminal" },
    { id: "corporate", label: "Corporate" },
    { id: "ip", label: "IP / Trademark" },
    { id: "family", label: "Family" },
  ],
  therapists: [
    { id: "all", label: "All" },
    { id: "stress", label: "Stress" },
    { id: "relationship", label: "Relationship" },
    { id: "anxiety", label: "Anxiety" },
    { id: "career", label: "Career Stress" },
    { id: "mindfulness", label: "Mindfulness" },
  ],
  fitness: [
    { id: "all", label: "All" },
    { id: "weightloss", label: "Weight Loss" },
    { id: "strength", label: "Strength" },
    { id: "yoga", label: "Yoga" },
    { id: "nutrition", label: "Nutrition" },
    { id: "sports", label: "Sports Fitness" },
  ],
  business: [
    { id: "all", label: "All" },
    { id: "startup", label: "Startup" },
    { id: "marketing", label: "Marketing" },
    { id: "sales", label: "Sales" },
    { id: "finance", label: "Finance" },
    { id: "ops", label: "Operations" },
  ],
  global: [
    { id: "all", label: "All" },
    { id: "product", label: "Product" },
    { id: "design", label: "Design" },
    { id: "ai", label: "AI / ML" },
    { id: "cloud", label: "Cloud" },
    { id: "strategy", label: "Strategy" },
  ],
};

// ----------------------------
// Dummy Avatars
// ----------------------------
const AVATARS = [
  "https://images.pexels.com/photos/4937227/pexels-photo-4937227.jpeg",
  "https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg",
  "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
  "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg",
  "https://images.pexels.com/photos/7643745/pexels-photo-7643745.jpeg",
  "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg",
  "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg",
  "https://images.pexels.com/photos/3760852/pexels-photo-3760852.jpeg",
];

// ----------------------------
// Dummy Experts
// ----------------------------
const EXPERTS = {
  doctors: [
    { name: "Dr. Ananya Rao", specialityId: "cardio", speciality: "Heart Specialist" },
    { name: "Dr. Karan Mehta", specialityId: "dentist", speciality: "Dentist" },
    { name: "Dr. Nisha Kapoor", specialityId: "neuro", speciality: "Neurologist" },
    { name: "Dr. Raghav Shah", specialityId: "derma", speciality: "Skin Specialist" },
    { name: "Dr. Aditi Singh", specialityId: "general", speciality: "General Physician" },
    { name: "Dr. Mohit Verma", specialityId: "cardio", speciality: "Heart Specialist" },
    { name: "Dr. Sneha Iyer", specialityId: "derma", speciality: "Skin Specialist" },
    { name: "Dr. Arjun Bose", specialityId: "general", speciality: "General Physician" },
  ],
  engineers: [
    { name: "Riya Desai", specialityId: "frontend", speciality: "Frontend Engineer" },
    { name: "Arnav Kulkarni", specialityId: "backend", speciality: "Backend Engineer" },
    { name: "Neha Sharma", specialityId: "fullstack", speciality: "Full-Stack Engineer" },
    { name: "Siddharth Jain", specialityId: "devops", speciality: "DevOps Engineer" },
    { name: "Priya Nair", specialityId: "data", speciality: "Data / ML Engineer" },
    { name: "Vikram Patil", specialityId: "backend", speciality: "Backend Engineer" },
    { name: "Anjali Bansal", specialityId: "frontend", speciality: "Frontend Engineer" },
    { name: "Kabir Khanna", specialityId: "fullstack", speciality: "Full-Stack Engineer" },
  ],
  mentors: [
    { name: "Sonia Kapoor", specialityId: "career", speciality: "Career Mentor" },
    { name: "Aditya Rao", specialityId: "interview", speciality: "Interview Coach" },
    { name: "Meera Joshi", specialityId: "resume", speciality: "Resume Expert" },
    { name: "Nikhil Singh", specialityId: "product", speciality: "Product Mentor" },
    { name: "Tanvi Yadav", specialityId: "techlead", speciality: "Tech Lead Mentor" },
    { name: "Rohan Pillai", specialityId: "career", speciality: "Career Mentor" },
    { name: "Kriti Malhotra", specialityId: "interview", speciality: "Interview Coach" },
    { name: "Dev Gupta", specialityId: "product", speciality: "Product Mentor" },
  ],
  lawyers: [
    { name: "Adv. Ishan Verma", specialityId: "civil", speciality: "Civil Lawyer" },
    { name: "Adv. Ritu Bansal", specialityId: "family", speciality: "Family Lawyer" },
    { name: "Adv. Yash Arora", specialityId: "criminal", speciality: "Criminal Lawyer" },
    { name: "Adv. Kavya Joshi", specialityId: "corporate", speciality: "Corporate Lawyer" },
    { name: "Adv. Manish Rao", specialityId: "ip", speciality: "IP / Trademark" },
    { name: "Adv. Sanya Kapoor", specialityId: "civil", speciality: "Civil Lawyer" },
    { name: "Adv. Raghav Menon", specialityId: "corporate", speciality: "Corporate Lawyer" },
    { name: "Adv. Neha Dube", specialityId: "family", speciality: "Family Lawyer" },
  ],
  therapists: [
    { name: "Dr. Kavita Iyer", specialityId: "stress", speciality: "Stress Therapist" },
    { name: "Dr. Rohan Nair", specialityId: "relationship", speciality: "Relationship Coach" },
    { name: "Dr. Ayesha Khan", specialityId: "anxiety", speciality: "Anxiety Therapist" },
    { name: "Dr. Vedant Mehta", specialityId: "career", speciality: "Career Stress" },
    { name: "Dr. Nidhi Sinha", specialityId: "mindfulness", speciality: "Mindfulness Coach" },
    { name: "Dr. Aarav Jain", specialityId: "stress", speciality: "Stress Therapist" },
    { name: "Dr. Sania Gill", specialityId: "relationship", speciality: "Relationship Coach" },
    { name: "Dr. Ronit Chawla", specialityId: "anxiety", speciality: "Anxiety Therapist" },
  ],
  fitness: [
    { name: "Akash Singh", specialityId: "weightloss", speciality: "Weight Loss Coach" },
    { name: "Rhea Malhotra", specialityId: "strength", speciality: "Strength Trainer" },
    { name: "Yogita Deshpande", specialityId: "yoga", speciality: "Yoga Coach" },
    { name: "Kunal Patil", specialityId: "nutrition", speciality: "Nutrition Coach" },
    { name: "Simran Kaur", specialityId: "sports", speciality: "Sports Fitness" },
    { name: "Manav Kapoor", specialityId: "weightloss", speciality: "Weight Loss Coach" },
    { name: "Alia Fernandes", specialityId: "yoga", speciality: "Yoga Coach" },
    { name: "Tushar Bedi", specialityId: "strength", speciality: "Strength Trainer" },
  ],
  business: [
    { name: "Rajiv Sethi", specialityId: "startup", speciality: "Startup Mentor" },
    { name: "Deepa Patel", specialityId: "marketing", speciality: "Marketing Strategist" },
    { name: "Karan Choudhary", specialityId: "sales", speciality: "Sales Coach" },
    { name: "Mitali Rao", specialityId: "finance", speciality: "Finance Advisor" },
    { name: "Sagar Deshmukh", specialityId: "ops", speciality: "Operations Expert" },
    { name: "Isha Bhandari", specialityId: "marketing", speciality: "Growth Marketer" },
    { name: "Rohit Sen", specialityId: "startup", speciality: "Startup Mentor" },
    { name: "Pooja Kulkarni", specialityId: "finance", speciality: "Finance Advisor" },
  ],
  global: [
    { name: "Liam Parker", specialityId: "product", speciality: "Product Strategist" },
    { name: "Emma Johnson", specialityId: "design", speciality: "UX / UI Designer" },
    { name: "Noah Lee", specialityId: "ai", speciality: "AI / ML Architect" },
    { name: "Sophia Kim", specialityId: "cloud", speciality: "Cloud Architect" },
    { name: "Oliver Smith", specialityId: "strategy", speciality: "Business Strategist" },
    { name: "Ava Brown", specialityId: "product", speciality: "Product Manager" },
    { name: "Ethan Davis", specialityId: "ai", speciality: "ML Engineer" },
    { name: "Mia Wilson", specialityId: "design", speciality: "Product Designer" },
  ],
};

// ----------------------------
// Component Start
// ----------------------------
const Categories = () => {
  const [activeProfession, setActiveProfession] = useState("doctors");
  const [activeSpeciality, setActiveSpeciality] = useState("all");
  const [loading, setLoading] = useState(false);

  // shimmer when switching
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(t);
  }, [activeProfession, activeSpeciality]);

  const specialityOptions = SPECIALITIES[activeProfession];

  const experts = useMemo(() => {
    const all = EXPERTS[activeProfession];
    if (activeSpeciality === "all") return all;
    return all.filter((e) => e.specialityId === activeSpeciality);
  }, [activeProfession, activeSpeciality]);

  return (
    <Wrap>
      {/* HEADER */}
      <SectionHeader>
        <Title>India&apos;s Best Experts on ExpertYard</Title>
        <Subtitle>
          Choose a profession, filter by speciality and instantly connect with verified experts.
        </Subtitle>
      </SectionHeader>

      {/* QUICK ACTION */}
      <ActionsRow>
        <ActionCard>
          <ActionIcon><FiUserCheck size={28} /></ActionIcon>
          <ActionTitle>Talk to Experts</ActionTitle>
        </ActionCard>

        <ActionCard>
          <ActionIcon><FiMessageCircle size={28} /></ActionIcon>
          <ActionTitle>Chat with Experts</ActionTitle>
        </ActionCard>
      </ActionsRow>

      {/* TABS */}
      <TabsRow>
        {PROFESSION_TABS.map((tab) => {
          const IconComp = tab.icon;
          return (
            <TabButton
              key={tab.id}
              $active={tab.id === activeProfession}
              onClick={() => {
                setActiveProfession(tab.id);
                setActiveSpeciality("all");
              }}
            >
              <IconComp size={18} />
              {tab.label}
            </TabButton>
          );
        })}
      </TabsRow>

      {/* FILTERS */}
      <FiltersRow>
        {specialityOptions.map((sp) => (
          <FilterChip
            key={sp.id}
            $active={sp.id === activeSpeciality}
            onClick={() => setActiveSpeciality(sp.id)}
          >
            {sp.label}
          </FilterChip>
        ))}
      </FiltersRow>

      {/* EXPERT STRIP */}
      {loading ? (
        <ExpertsStrip>
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i}>
              <SkeletonAvatar />
              <SkeletonLine style={{ width: "70%" }} />
              <SkeletonLine style={{ width: "55%" }} />
            </SkeletonCard>
          ))}
        </ExpertsStrip>
      ) : (
        <ExpertsStrip>
          {experts.map((exp, i) => (
            <ExpertCard key={i}>
              <Avatar src={AVATARS[i % AVATARS.length]} />
              <ExpertName>{exp.name}</ExpertName>
              <ExpertProfession>
                {PROFESSION_TABS.find((tab) => tab.id === activeProfession)?.label}
              </ExpertProfession>
              <ExpertSpeciality>{exp.speciality}</ExpertSpeciality>
              <ExpertTag>Online • Verified</ExpertTag>
            </ExpertCard>
          ))}
        </ExpertsStrip>
      )}
    </Wrap>
  );
};

export default Categories;
