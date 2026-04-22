import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stage, PerspectiveCamera, Float, Sparkles, Grid } from '@react-three/drei';
import { Suspense, useRef } from 'react';
import * as THREE from 'three';

function ScanningLaser() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 1.5;
    }
  });

  return (
    <mesh ref={ref} rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[1.5, 1.6, 64]} />
      <meshBasicMaterial color="#D4AF37" transparent opacity={0.5} side={THREE.DoubleSide} />
    </mesh>
  );
}

export default function ThreeViewer() {
  return (
    <div className="w-full h-[400px] bg-[#0C0B0A] rounded-[2.5rem] overflow-hidden border border-[#D4AF37]/10 relative neural-glow">
      <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
        <span className="px-3 py-1 bg-[#D4AF37]/10 text-[#D4AF37] text-[10px] font-black uppercase tracking-widest rounded-full border border-[#D4AF37]/20 w-fit">
          Neural Reconstruction: Active
        </span>
        <span className="text-[8px] text-white/20 uppercase tracking-[0.2em] font-bold">
          Site: Giza Plateau / Sector 7
        </span>
      </div>

      {/* Field Notes Overlay */}
      <div className="absolute top-6 right-6 z-10 text-right pointer-events-none">
        <div className="space-y-4">
          <div className="border-r-2 border-[#D4AF37]/20 pr-4">
            <p className="text-[8px] text-[#D4AF37]/40 uppercase tracking-widest font-black mb-1">Observation Log</p>
            <p className="text-[10px] text-white/60 font-medium italic max-w-[150px] leading-tight">
              "Surface erosion suggests exposure to desert winds for ~2000 years. Neural patterns indicate high ritual significance."
            </p>
          </div>
          <div className="border-r-2 border-[#D4AF37]/20 pr-4">
            <p className="text-[8px] text-[#D4AF37]/40 uppercase tracking-widest font-black mb-1">Material Analysis</p>
            <p className="text-[10px] text-white/60 font-medium italic">Basalt / High Carbon Content</p>
          </div>
        </div>
      </div>
      
      <Canvas shadows dpr={[1, 2]}>
        <Suspense fallback={null}>
          <Stage environment="night" intensity={0.2} shadows={{ type: 'contact', opacity: 0.4, blur: 2 }}>
            <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
              <mesh castShadow receiveShadow>
                <dodecahedronGeometry args={[1, 0]} />
                <meshStandardMaterial
                  color="#4A4A4A"
                  roughness={0.8}
                  metalness={0.2}
                  flatShading
                />
              </mesh>
              <ScanningLaser />
            </Float>
          </Stage>
          <Sparkles count={50} scale={5} size={2} speed={0.5} color="#D4AF37" />
          <Grid 
            infiniteGrid 
            fadeDistance={20} 
            fadeStrength={5} 
            cellSize={0.5} 
            sectionSize={2.5} 
            sectionThickness={1} 
            sectionColor="#D4AF37" 
            cellColor="#2C1E12" 
          />
        </Suspense>
        <OrbitControls makeDefault autoRotate autoRotateSpeed={0.3} enableZoom={false} />
        <PerspectiveCamera makeDefault position={[0, 2, 5]} fov={40} />
      </Canvas>

      <div className="absolute bottom-6 right-6 z-10 text-right">
        <div className="flex items-center gap-2 justify-end mb-1">
          <div className="w-1 h-1 bg-[#D4AF37] rounded-full animate-ping" />
          <p className="text-[#D4AF37] text-[10px] font-black uppercase tracking-widest">Quantum Scan v9.0</p>
        </div>
        <p className="text-white/20 text-[8px] uppercase tracking-widest">Point Cloud: 4.8M Vertices</p>
      </div>
    </div>
  );
}
