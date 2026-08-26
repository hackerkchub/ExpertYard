import {
  ArcSvg,
  CardContainer,
  CenterLogoWrap,
  Dot,
  DotsContainer,
  GlassCard,
  GraphicContainer,
  OverlayWrapper,
} from "./PremiumCenterLoader.styles";

export default function PremiumCenterLoader({ exiting = false }) {
  return (
    <OverlayWrapper role="status" aria-live="polite">
      <CardContainer $exiting={exiting}>
        <GlassCard>
          <GraphicContainer>
            {/* Layer 1: Outer Static Ring */}
            <svg
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", color: "rgba(15, 23, 42, 0.10)" }}
              viewBox="0 0 64 64"
              fill="none"
            >
              <circle cx="32" cy="32" r="27" stroke="currentColor" strokeWidth="2" />
            </svg>

            {/* Layer 2: Thicker Traveling Royal Blue Arc */}
            <ArcSvg viewBox="0 0 64 64" fill="none">
              <defs>
                <linearGradient id="g9ArcGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2563eb" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
              <circle
                cx="32"
                cy="32"
                r="27"
                stroke="url(#g9ArcGradient)"
                strokeWidth="3.8"
                strokeDasharray="46 125"
                strokeLinecap="round"
              />
            </ArcSvg>

            {/* Layer 3: Center Static G9 Logo */}
            <CenterLogoWrap>
              <img src="/logo-192.png" alt="G9" />
            </CenterLogoWrap>
          </GraphicContainer>

          {/* Bottom 3 Animated Dots */}
          <DotsContainer>
            <Dot $delay="0s" />
            <Dot $delay="0.2s" />
            <Dot $delay="0.4s" />
          </DotsContainer>
        </GlassCard>
      </CardContainer>
    </OverlayWrapper>
  );
}
