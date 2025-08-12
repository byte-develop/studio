import { ParticleSystem } from './particle-system';
import { FloatingGeometry } from './floating-geometry';

export function HeroScene() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <ParticleSystem count={100} />
      
      {/* Floating geometric shapes */}
      {/* Removed octahedron that might appear as white ring */}
      {/* Removed torus geometry - white rings */}
      {/* Removed sphere that might appear as white ring */}
      <FloatingGeometry 
        position={{ x: '20%', y: '75%' }} 
        geometry="box" 
        scale={0.5} 
        delay={3} 
      />
      {/* Removed octahedron that might appear as white ring */}
      
      {/* Additional background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/5 via-transparent to-neon-cyan/5 animate-pulse" />
      
      {/* Removed glowing orbs that might look like rings */}
    </div>
  );
}
