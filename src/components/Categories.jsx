import React from "react";
import styled from "styled-components";
import { FiUserCheck, FiGithub, FiTool, FiPenTool } from "react-icons/fi";

const mainCategories = [
  { title: "Talk to Experts", icon: <FiUserCheck size={38} /> },
  { title: "Chat with Experts", icon: <FiPenTool size={38} /> },
  { title: "ExpertYard Store", icon: <FiTool size={38} /> },
];

const subcategories = [
  "Doctors", "Engineers", "Lawyers", "Psychologists",
  "Fitness Coaches", "Career Mentors", "Business Advisors"
];

const Categories = () => {
  return (
    <Wrap>
      <Heading>India's Best Experts</Heading>

      <Row>
        {mainCategories.map((c, i) => (
          <Card key={i}>
            <Icon>{c.icon}</Icon>
            <CardTitle>{c.title}</CardTitle>
          </Card>
        ))}
      </Row>

      <SubHeading>Choose Your Expert Category</SubHeading>
      <SubList>
        {subcategories.map((s, i) => (
          <SubItem key={i}>{s}</SubItem>
        ))}
      </SubList>
    </Wrap>
  );
};

export default Categories;


// styled
const Wrap = styled.div`
  max-width: 1250px;
  margin: 40px auto;
  padding: 0 20px;
`;

const Heading = styled.h2`
  text-align: center;
  font-size: 26px;
  margin-bottom: 25px;
`;

const Row = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
`;

const Card = styled.div`
  width: 260px;
  height: 140px;
  background: #ffe8d6;
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    transform: translateY(-4px);
    background: #ffd8b6;
  }
`;

const Icon = styled.div`
  color: #ff6f00;
`;

const CardTitle = styled.h4`
  font-weight: 600;
`;

const SubHeading = styled.h3`
  margin: 35px 0 15px 0;
  font-size: 20px;
`;

const SubList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px 18px;
`;

const SubItem = styled.div`
  background: #f1f5f9;
  padding: 8px 18px;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background: #e2e8f0;
  }
`;
