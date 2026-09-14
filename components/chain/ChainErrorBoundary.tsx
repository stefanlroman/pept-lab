"use client";

import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

// WebGL/postprocessing support varies enough across GPUs and browsers
// that a scroll-driven 3D scene should never be able to take the whole
// section down with it — if it throws, fall back to a plain message
// instead of leaving a blank hole in the page.
export default class ChainErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    // eslint-disable-next-line no-console
    console.error("PeptideChain 3D scene failed, falling back:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-full w-full flex-col items-center justify-center px-6 text-center">
          <span className="font-mono text-[11px] uppercase tracking-widest text-accent">
            Die Peptidkette
          </span>
          <p className="mt-3 max-w-sm font-sans text-sm text-fg-muted">
            Die 3D-Ansicht konnte auf diesem Gerät nicht geladen werden.
            Den Katalog findest du weiter unten.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}
