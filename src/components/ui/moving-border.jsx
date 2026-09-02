import { useRef } from 'react';
import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'motion/react';
import { cn } from '../../lib/utils';

export const MovingBorder = ({
  children,
  duration = 4500,
  rx,
  ry,
  className,
  ...props
}) => {
  const pathRef = useRef(null);
  const progress = useMotionValue(0);
  const reduce = useReducedMotion();

  useAnimationFrame((time) => {
    if (reduce) return;
    const path = pathRef.current;
    const length = path?.getTotalLength();
    if (length) {
      progress.set((time * (length / duration)) % length);
    }
  });

  const pointAt = (val) => {
    const path = pathRef.current;
    const length = path?.getTotalLength();
    if (!length) return { x: 0, y: 0 };
    return path.getPointAtLength(val);
  };

  const x = useTransform(progress, (val) => pointAt(val).x);
  const y = useTransform(progress, (val) => pointAt(val).y);

  const transform =
    useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`;

  return (
    <>
      <svg
        className={cn('pointer-events-none absolute inset-0 h-full w-full', className)}
        width="100%"
        height="100%"
        preserveAspectRatio="none"
        aria-hidden="true"
        {...props}
      >
        <rect ref={pathRef} fill="none" width="100%" height="100%" rx={rx} ry={ry} />
      </svg>
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          display: 'inline-block',
          transform,
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      >
        {children}
      </motion.div>
    </>
  );
};

export const MovingBorderOutline = ({
  duration = 4500,
  rx = 12,
  ry = 12,
  strokeWidth = 2,
  dashLength = 0.22,
  className,
  ...props
}) => {
  const reduce = useReducedMotion();
  const dash = useMotionValue(-dashLength / 2);

  useAnimationFrame((time) => {
    if (reduce) return;
    dash.set(-((time / duration) % 1));
  });

  const rect = {
    x: 0.5,
    y: 0.5,
    width: 'calc(100% - 1px)',
    height: 'calc(100% - 1px)',
    rx,
    ry,
    fill: 'none',
    strokeWidth,
  };

  return (
    <svg
      className={cn('pointer-events-none absolute inset-0 h-full w-full', className)}
      width="100%"
      height="100%"
      preserveAspectRatio="none"
      aria-hidden="true"
      {...props}
    >
      {!reduce && (
        <motion.rect
          {...rect}
          stroke="#fbbf24"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={`${dashLength} ${1 - dashLength}`}
          style={{
            strokeDashoffset: dash,
            filter: 'drop-shadow(0 0 3px rgba(245, 158, 11, 0.55))',
          }}
        />
      )}
    </svg>
  );
};