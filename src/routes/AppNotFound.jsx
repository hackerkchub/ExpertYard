import { Link } from "react-router-dom";
import styled from "styled-components";

const Wrapper = styled.main`
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 32px 20px;
  background: #f8fafc;
`;

const Card = styled.section`
  width: min(100%, 520px);
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 32px 24px;
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.08);
  text-align: center;
`;

const Code = styled.p`
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #2563eb;
  margin-bottom: 12px;
`;

const Title = styled.h1`
  font-size: clamp(28px, 4vw, 40px);
  color: #0f172a;
  margin-bottom: 12px;
`;

const Description = styled.p`
  font-size: 15px;
  line-height: 1.6;
  color: #475569;
  margin-bottom: 24px;
`;

const Action = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 160px;
  min-height: 44px;
  padding: 0 18px;
  border-radius: 999px;
  background: #0f172a;
  color: #ffffff;
  font-weight: 600;
`;

export default function AppNotFound({
  title = "Page not found",
  description = "The page you requested is not available.",
  homePath = "/",
  actionLabel = "Go home",
}) {
  return (
    <Wrapper>
      <Card>
        <Code>404</Code>
        <Title>{title}</Title>
        <Description>{description}</Description>
        <Action to={homePath}>{actionLabel}</Action>
      </Card>
    </Wrapper>
  );
}
