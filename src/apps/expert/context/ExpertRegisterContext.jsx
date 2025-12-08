import React, { createContext, useContext, useState } from "react";

const ExpertRegisterContext = createContext(null);

export const useExpertRegister = () => useContext(ExpertRegisterContext);

export const ExpertRegisterProvider = ({ children }) => {
  const [data, setData] = useState({
    // Step 1
    name: "",
    email: "",
    phone: "",
    password: "",

    // Step 2 / 3
    category_id: "",
    subcategory_id: "",
    position: "",

    // Step 4
    description: "",
    education: "",
    location: "",
    profile_photo: null,
    experience_certificate: null,
    marksheet: null,
    aadhar_card: null,

    // Step 5
    price_per_minute: "",
  });

  const updateField = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const reset = () => setData({
    name: "",
    email: "",
    phone: "",
    password: "",
    category_id: "",
    subcategory_id: "",
    position: "",
    description: "",
    education: "",
    location: "",
    profile_photo: null,
    experience_certificate: null,
    marksheet: null,
    aadhar_card: null,
    price_per_minute: "",
  });

  return (
    <ExpertRegisterContext.Provider value={{ data, updateField, reset }}>
      {children}
    </ExpertRegisterContext.Provider>
  );
};
