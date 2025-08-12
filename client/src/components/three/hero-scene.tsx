import { ParticleSystem } from './particle-system';
import { FloatingGeometry } from './floating-geometry';

export function HeroScene() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <ParticleSystem count={100} />
      
      {/* Floating geometric shapes */}
      <FloatingGeometry 
        position={{ x: '15%', y: '20%' }} 
        geometry="octahedron" 
        scale={0.8} 
        delay={0} 
      />
      <FloatingGeometry 
        position={{ x: '80%', y: '60%' }} 
        geometry="torus" 
        scale={0.6} 
        delay={1} 
      />
      <FloatingGeometry 
        position={{ x: '50%', y: '15%' }} 
        geometry="sphere" 
        scale={0.4} 
        delay={2} 
      />
      <FloatingGeometry 
        position={{ x: '20%', y: '75%' }} 
        geometry="box" 
        scale={0.5} 
        delay={3} 
      />
      <FloatingGeometry 
        position={{ x: '75%', y: '30%' }} 
        geometry="octahedron" 
        scale={0.7} 
        delay={1.5} 
      />
      
      {/* Additional background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/5 via-transparent to-neon-cyan/5 animate-pulse" />
      
      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-neon-cyan/20 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-neon-cyan/15 rounded-full blur-xl animate-float" style={{ animationDelay: '4s' }} />
    </div>
  );
}
