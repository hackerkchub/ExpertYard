import React, { useState, useEffect } from "react";
import {
  SliderWrapper,
  Slides,
  Slide,
  Overlay,
  Content,
  Title,
  Subtitle,
  Dots,
  Dot
} from "./HomeSlider.styles";

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

      <Dots>
        {slides.map((_, i) => (
          <Dot key={i} active={i === index} onClick={() => setIndex(i)} />
        ))}
      </Dots>
    </SliderWrapper>
  );
};

export default HomeSlider;
