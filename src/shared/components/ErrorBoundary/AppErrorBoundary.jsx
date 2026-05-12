import React from "react";
import styled from "styled-components";

const Wrapper = styled.main`
  min-height: 60vh;
  display: grid;
  place-items: center;
  padding: 32px 16px;
  background: #f8fafc;
`;

const Panel = styled.section`
  width: min(100%, 420px);
  padding: 24px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: #ffffff;
  text-align: center;
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.08);
`;

const Title = styled.h1`
  margin: 0 0 8px;
  font-size: 22px;
  color: #0f172a;
`;

const Copy = styled.p`
  margin: 0 0 20px;
  color: #475569;
  line-height: 1.55;
`;

const Actions = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const Button = styled.button`
  min-height: 42px;
  padding: 0 16px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background: ${({ $primary }) => ($primary ? "#0f172a" : "#ffffff")};
  color: ${({ $primary }) => ($primary ? "#ffffff" : "#334155")};
  font-weight: 600;
  cursor: pointer;
`;

export default class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error(`${this.props.label || "App"} crashed`, error, info);
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <Wrapper role="alert">
        <Panel>
          <Title>Something went wrong</Title>
          <Copy>This section could not load correctly. Try again or reload the page.</Copy>
          <Actions>
            <Button type="button" onClick={this.handleRetry}>
              Try again
            </Button>
            <Button type="button" $primary onClick={this.handleReload}>
              Reload
            </Button>
          </Actions>
        </Panel>
      </Wrapper>
    );
  }
}
