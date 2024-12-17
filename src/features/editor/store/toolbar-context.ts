import type { ElementFormatType } from 'lexical';
import { create } from 'zustand';

type State = {
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  isStrikethrough: boolean;
  isCode: boolean;
  textAlign: ElementFormatType;
  canUndo: boolean;
  canRedo: boolean;
};

type Action = {
  updateToolbar: (key: keyof State, value: State[keyof State]) => void;
};

export const useToolbarStore = create<State & Action>((set) => ({
  isBold: false,
  isItalic: false,
  isUnderline: false,
  isStrikethrough: false,
  isCode: false,
  textAlign: 'left',
  canUndo: false,
  canRedo: false,
  updateToolbar: (key, value) => set(() => ({ [key]: value })),
}));
