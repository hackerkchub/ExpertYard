import logo from "../../../assets/logo.webp";
import {
  AppName,
  LoadingRow,
  LogoShell,
  ProgressTrack,
  ReviewLine,
  Spinner,
  SplashCard,
  SplashOverlay,
  TrustMessage,
} from "../SplashScreen.styles";

export default function G9LogoLoader({
  label = "Connecting you with trusted experts...",
  overlay = true,
  exiting = false,
}) {
  const content = (
    <SplashCard>
      <LogoShell>
        <img src={logo} alt="G9Expert" />
      </LogoShell>
      <AppName>G9Expert</AppName>
      <TrustMessage>
        Trusted Experts. Real Guidance. Secure Consultation.
      </TrustMessage>
      <ReviewLine>
        Verified professionals for chat, call, video call & services.
      </ReviewLine>

      <LoadingRow>
        <Spinner aria-hidden="true" />
        <span>{label}</span>
      </LoadingRow>
      <ProgressTrack aria-hidden="true" />
    </SplashCard>
  );

  if (overlay) {
    return (
      <SplashOverlay $exiting={exiting} role="status" aria-live="polite">
        {content}
      </SplashOverlay>
    );
  }

  return content;
}
