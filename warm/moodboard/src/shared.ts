export type Knobs = { hue: number; warmth: number; depth: number };
export type Typeface = 'original' | 'sans' | 'serif' | 'mono';
export type ExampleState = Record<string, string | number | boolean | string[]>;
export type AreaProps = {
  id: string;
  focused: boolean;
  state: ExampleState;
  onState: (patch: ExampleState) => void;
  knobs: Knobs;
};
// Every example inherits these semantic CSS variables from its wrapper:
// --surface, --surface-raised, --ink, --muted, --accent, --accent-alt,
// --on-accent, --border, --photo-filter. Image grading can be toggled independently.
export const asset = (path: string) => `/assets/${path}`;
