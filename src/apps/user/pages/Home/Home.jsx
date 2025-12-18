// src/apps/user/pages/Home/HomePage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

import Slider from "../../components/HomeSlider/HomeSlider";
import Categories from "../../components/Categories/Categories";

import {
  Wrapper,
  HomeActionsSection,
  HomeActionsTitle,
  HomeActionsSubTitle,
  HomeActions,
  HomeActionCard,
  HomeActionIcon,
  HomeActionTitle,
} from "./Home.styles";

import { FiUserCheck, FiMessageCircle } from "react-icons/fi";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <Wrapper>
      {/* Banner Slider */}
      <Slider />

      {/* ===== BEST EXPERTS SECTION ===== */}
      <HomeActionsSection>
        <HomeActionsTitle>Best Experts for You</HomeActionsTitle>
        <HomeActionsSubTitle>
          Talk or chat instantly with verified professionals
        </HomeActionsSubTitle>

        <HomeActions>
          <HomeActionCard
  onClick={() => navigate("/user/call-chat?mode=call")}
>
  <HomeActionIcon>
    <FiUserCheck size={26} />
  </HomeActionIcon>
  <HomeActionTitle>Talk to Experts</HomeActionTitle>
</HomeActionCard>

<HomeActionCard
  onClick={() => navigate("/user/call-chat?mode=chat")}
>
  <HomeActionIcon>
    <FiMessageCircle size={26} />
  </HomeActionIcon>
  <HomeActionTitle>Chat with Experts</HomeActionTitle>
</HomeActionCard>

        </HomeActions>
      </HomeActionsSection>

      {/* Categories */}
      <Categories />
    </Wrapper>
  );
};

export default HomePage;
