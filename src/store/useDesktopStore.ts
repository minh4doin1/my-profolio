import { create } from 'zustand';

type WindowApp = { id: string; title: string; content: React.ReactNode; pageUrl?: string; action?: never; };
type ActionApp = { id: string; title: string; content?: never; action: () => void; };
export type App = WindowApp | ActionApp;
export type OpenWindow = WindowApp & { zIndex: number; };

type DesktopState = {
  windows: OpenWindow[];
  minimized: string[];
  activeWindowId: string | null;
  nextZIndex: number;
  openWindow: (app: App) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
};

export const useDesktopStore = create<DesktopState>((set, get) => ({
  windows: [],
  minimized: [],
  activeWindowId: null,
  nextZIndex: 1,

  openWindow: (app) => {
    if (app.action) { app.action(); return; }
    
    const { windows, minimized, focusWindow } = get();
    if (minimized.includes(app.id)) { focusWindow(app.id); return; }
    if (windows.find(w => w.id === app.id)) { focusWindow(app.id); return; }

    if (app.content) {
      const newWindow = { ...app, zIndex: get().nextZIndex };
      set(state => ({
        windows: [...state.windows, newWindow],
        activeWindowId: app.id,
        nextZIndex: state.nextZIndex + 1,
      }));
    }
  },

  closeWindow: (id) => set(state => {
    const remainingWindows = state.windows.filter(w => w.id !== id);
    let newActiveId = state.activeWindowId;
    if (newActiveId === id) {
      newActiveId = remainingWindows.length > 0 ? remainingWindows[remainingWindows.length - 1].id : null;
    }
    return { windows: remainingWindows, activeWindowId: newActiveId };
  }),

  focusWindow: (id) => set(state => {
    const isMinimized = state.minimized.includes(id);
    return {
      minimized: isMinimized ? state.minimized.filter(mId => mId !== id) : state.minimized,
      windows: state.windows.map(w => w.id === id ? { ...w, zIndex: state.nextZIndex } : w),
      activeWindowId: id,
      nextZIndex: state.nextZIndex + 1,
    };
  }),

  minimizeWindow: (id) => set(state => {
    const otherWindows = state.windows.filter(w => w.id !== id && !state.minimized.includes(w.id));
    return {
      minimized: [...new Set([...state.minimized, id])],
      activeWindowId: state.activeWindowId === id 
        ? (otherWindows.length > 0 ? otherWindows[otherWindows.length - 1].id : null)
        : state.activeWindowId,
    };
  }),
}));