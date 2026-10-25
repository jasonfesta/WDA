declare namespace React {
  export type ReactNode = any;
  export type FC<P = {}> = (props: P) => any;
  export type ChangeEvent<T = any> = { target: { value: string; checked: boolean } };
  export type MouseEvent<T = any> = any;
  export type FormEvent<T = any> = any;
  export function useState<T>(initialState: T | (() => T)): [T, (newState: T | ((prev: T) => T)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: readonly any[]): void;
  export function useMemo<T>(factory: () => T, deps: readonly any[] | undefined): T;
  export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: readonly any[]): T;
  export function useRef<T>(initialValue: T): { current: T };
  export function createContext<T>(defaultValue: T): any;
  export function useContext<T>(context: any): T;
  export const Fragment: any;
}

declare module 'react' {
  export = React;
}

declare module 'react-dom' {
  export const render: any;
  export const createRoot: any;
  const ReactDOM: any;
  export default ReactDOM;
}

declare module 'react-dom/client' {
  export function createRoot(container: Element | DocumentFragment): {
    render(children: any): void;
    unmount(): void;
  };
  const ReactDOMClient: {
    createRoot: (container: Element | DocumentFragment) => {
      render(children: any): void;
      unmount(): void;
    };
  };
  export default ReactDOMClient;
}

declare module 'react/jsx-runtime' {
  export const jsx: any;
  export const jsxs: any;
  export const Fragment: any;
}
