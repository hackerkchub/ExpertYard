import React, { useState, useEffect } from "react";
import styled from "styled-components";

const slides = [
  {
    title: "Talk to Verified Experts",
    subtitle: "Engineers • Doctors • Lawyers • Mentors",
    img: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1600"
  },
  {
    title: "Instant Expert Advice",
    subtitle: "Reliable solutions for your real problems",
    img: "https://images.pexels.com/photos/3182811/pexels-photo-3182811.jpeg?auto=compress&cs=tinysrgb&w=1600"
  },
  {
    title: "Get Answers in Minutes",
    subtitle: "Chat • Call • Video Consultation",
    img: "https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg?auto=compress&cs=tinysrgb&w=1600"
  }
];

const HomeSlider = () => {
  const [index, setIndex] = useState(0);

  // Auto slide every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  return (
    <SliderWrapper>
      <Slides style={{ transform: `translateX(-${index * 100}%)` }}>
        {slides.map((s, i) => (
          <Slide key={i} bg={s.img}>
            <Overlay />
            <Content>
              <Title>{s.title}</Title>
              <Subtitle>{s.subtitle}</Subtitle>
            </Content>
          </Slide>
        ))}
      </Slides>

      {/* Dots */}
      <Dots>
        {slides.map((_, i) => (
          <Dot
            key={i}
            active={i === index}
            onClick={() => setIndex(i)}
          />
        ))}
      </Dots>
    </SliderWrapper>
  );
};

export default HomeSlider;


// ---------------------------------------
// STYLED COMPONENTS
// ---------------------------------------

const SliderWrapper = styled.div`
  width: 100%;
  height: 320px;
  overflow: hidden;
  position: relative;

  @media (max-width: 600px) {
    height: 220px;
  }
`;

const Slides = styled.div`
  display: flex;
  transition: all 0.7s ease;
  height: 100%;
`;

const Slide = styled.div`
  min-width: 100%;
  height: 100%;
  background: url(${(p) => p.bg}) center/cover no-repeat;
  position: relative;
  filter: brightness(0.55); /* dim image */
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  backdrop-filter: blur(2px); /* soft blur */
  background: rgba(0, 0, 0, 0.15);
`;

const Content = styled.div`
  position: absolute;
  bottom: 40px;
  left: 40px;
  color: white;
  z-index: 2;
  max-width: 80%;
  text-shadow: 0px 2px 6px rgba(0,0,0,0.8);

  @media (max-width: 600px) {
    bottom: 20px;
    left: 20px;
  }
`;

const Title = styled.h2`
  font-size: 32px;
  font-weight: 800;

  @media (max-width: 600px) {
    font-size: 22px;
  }
`;

const Subtitle = styled.p`
  font-size: 18px;
  margin-top: 6px;
  opacity: 0.95;

  @media (max-width: 600px) {
    font-size: 14px;
  }
`;

const Dots = styled.div`
  position: absolute;
  bottom: 10px;
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 8px;
  z-index: 10;
`;

const Dot = styled.div`
  width: ${(p) => (p.active ? "10px" : "8px")};
  height: ${(p) => (p.active ? "10px" : "8px")};
  background: ${(p) => (p.active ? "#ffffff" : "rgba(255,255,255,0.5)")};
  border-radius: 50%;
  cursor: pointer;
  transition: 0.3s;
`;
