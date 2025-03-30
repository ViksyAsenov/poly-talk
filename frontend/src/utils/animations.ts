import { AnimationProps } from "framer-motion";

type AnimationVariant = {
  opacity?: number;
  x?: number | string;
  y?: number | string;
  scale?: number;
};

interface MotionProps extends Omit<AnimationProps, "transition"> {
  initial?: AnimationVariant | false;
  animate?: AnimationVariant;
  exit?: AnimationVariant;
  transition?: {
    duration?: number;
    ease?: string;
    staggerChildren?: number;
    delay?: number;
  };
}

export const pageTransition: MotionProps = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 },
  transition: { duration: 0.2, ease: "easeOut" },
};
