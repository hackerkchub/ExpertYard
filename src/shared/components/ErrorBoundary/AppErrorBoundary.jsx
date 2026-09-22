import React from "react";
import styled from "styled-components";
import { updateRecovery, getCurrentBuildId } from "../../../utils/updateRecovery";

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
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error(`${this.props.label || "App"} component error caught:`, error, info);

    const errorMessage = String(error?.message || error || "").toLowerCase();
    const isChunkError =
      error?.name === "ChunkLoadError" ||
      errorMessage.includes("failed to fetch dynamically imported module") ||
      errorMessage.includes("importing a module script failed") ||
      errorMessage.includes("loading chunk") ||
      errorMessage.includes("unexpected token") ||
      errorMessage.includes("404");

    if (isChunkError && typeof window !== "undefined") {
      const buildId = getCurrentBuildId();
      // Shares centralized lock with lazyWithRetry so duplicate reloads are prevented
      updateRecovery.performControlledReload("chunk", buildId);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
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
          <Copy>
            This page section could not load correctly. Try clicking below to refresh.
          </Copy>
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
