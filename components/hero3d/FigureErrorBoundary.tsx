"use client";

import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

// The rotating glass-figure scene is a nice-to-have layered on top of the
// hero video, not the hero itself — if WebGL/the GLB fails for any reason,
// just render nothing and let the video underneath carry the section
// instead of taking the whole hero down with it.
export default class FigureErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    // eslint-disable-next-line no-console
    console.error("Hero glass-figure scene failed, falling back to video:", error);
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}
