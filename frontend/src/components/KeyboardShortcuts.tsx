import { useEffect } from 'react';

interface KeyboardShortcutsProps {
  onQuickAddFocus: () => void;
  onToggleDone: () => void;
  onOpenDrawer: () => void;
  onMoveToTrash: () => void;
  onPriorityCycle: () => void;
}

const KeyboardShortcuts: React.FC<KeyboardShortcutsProps> = ({
  onQuickAddFocus,
  onToggleDone,
  onOpenDrawer,
  onMoveToTrash,
  onPriorityCycle,
}) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        onQuickAddFocus();
      }
      if (e.key === ' ' && document.activeElement?.getAttribute('role') === 'checkbox') {
        e.preventDefault();
        onToggleDone();
      }
      if (e.key.toLowerCase() === 'e') {
        e.preventDefault();
        onOpenDrawer();
      }
      if (e.key === 'Delete') {
        e.preventDefault();
        onMoveToTrash();
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === '.') {
        e.preventDefault();
        onPriorityCycle();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onQuickAddFocus, onToggleDone, onOpenDrawer, onMoveToTrash, onPriorityCycle]);
  return null;
};

export default KeyboardShortcuts;
