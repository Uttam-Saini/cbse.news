'use client';

/**
 * Light-only ThemeProvider
 *
 * Dark mode has been fully removed from the project.
 * This provider now simply renders its children without
 * applying any theme logic or CSS class manipulation.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

