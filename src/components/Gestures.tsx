import {
  useEffect,
  useRef,
  type HTMLAttributes,
  type PointerEvent as ReactPointerEvent,
} from "react";

export interface GesturesProps extends HTMLAttributes<HTMLDivElement> {
  onTap?: () => void;
  onDoubleTap?: () => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  /** Minimum distance in px for a movement to count as a swipe. */
  swipeThreshold?: number;
  /** Max time in ms between two taps to count as a double tap. */
  doubleTapDelay?: number;
  /** Max distance in px a pointer can move and still count as a tap. */
  tapMaxMove?: number;
}

export function Gestures({
  onTap,
  onDoubleTap,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  swipeThreshold = 50,
  doubleTapDelay = 300,
  tapMaxMove = 10,
  style,
  children,
  onPointerDown,
  onPointerUp,
  onPointerCancel,
  ...props
}: GesturesProps) {
  const start = useRef<{ x: number; y: number } | null>(null);
  const tapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTapTimer = () => {
    if (tapTimer.current) clearTimeout(tapTimer.current);
    tapTimer.current = null;
  };
  useEffect(() => clearTapTimer, []);

  const hasSwipe = onSwipeLeft || onSwipeRight || onSwipeUp || onSwipeDown;

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    start.current = { x: event.clientX, y: event.clientY };
    onPointerDown?.(event);
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    onPointerUp?.(event);
    if (!start.current) return;
    const dx = event.clientX - start.current.x;
    const dy = event.clientY - start.current.y;
    start.current = null;

    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    if (Math.max(absX, absY) >= swipeThreshold) {
      clearTapTimer();
      if (absX >= absY) (dx > 0 ? onSwipeRight : onSwipeLeft)?.();
      else (dy > 0 ? onSwipeDown : onSwipeUp)?.();
      return;
    }
    if (Math.max(absX, absY) > tapMaxMove) return;

    if (!onDoubleTap) {
      onTap?.();
    } else if (tapTimer.current) {
      clearTapTimer();
      onDoubleTap();
    } else {
      tapTimer.current = setTimeout(() => {
        tapTimer.current = null;
        onTap?.();
      }, doubleTapDelay);
    }
  };

  const handlePointerCancel = (event: ReactPointerEvent<HTMLDivElement>) => {
    start.current = null;
    onPointerCancel?.(event);
  };

  return (
    <div
      {...props}
      style={{ touchAction: hasSwipe ? "none" : undefined, ...style }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
    >
      {children}
    </div>
  );
}

export default Gestures;
