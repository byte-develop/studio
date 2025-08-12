import { motion } from 'framer-motion';
import { useMousePosition } from '@/hooks/use-mouse-position';

interface FloatingGeometryProps {
  position: { x: string; y: string };
  geometry: 'box' | 'sphere' | 'torus' | 'octahedron';
  scale?: number;
  delay?: number;
}

export function FloatingGeometry({ position, geometry, scale = 1, delay = 0 }: FloatingGeometryProps) {
  const mousePosition = useMousePosition();

  const getGeometryShape = () => {
    switch (geometry) {
      case 'box':
        return 'rounded-lg';
      case 'sphere':
        return 'rounded-full';
      case 'torus':
        return 'rounded-full border-4 border-neon-cyan/30';
      case 'octahedron':
        return 'rounded-lg rotate-45';
      default:
        return 'rounded-lg';
    }
  };

  const getSize = () => {
    const baseSize = 60 * scale;
    return {
      width: baseSize,
      height: baseSize,
    };
  };

  return (
    <motion.div
      className={`absolute bg-neon-cyan/10 border border-neon-cyan/30 ${getGeometryShape()}`}
      style={{
        left: position.x,
        top: position.y,
        ...getSize(),
      }}
      animate={{
        y: [0, -20, 0],
        rotateX: [0, 360],
        rotateY: [0, 180, 360],
        scale: [scale, scale * 1.1, scale],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
      whileHover={{
        scale: scale * 1.2,
        rotateZ: 45,
        boxShadow: '0 0 30px rgba(0, 255, 255, 0.5)',
      }}
    />
  );
}
