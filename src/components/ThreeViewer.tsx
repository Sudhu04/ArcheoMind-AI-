import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stage, PerspectiveCamera, Float, Sparkles, Grid } from '@react-three/drei';
import { Suspense, useRef } from 'react';
import * as THREE from 'three';
import { Sparkles as SparklesIcon } from 'lucide-react';

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
      <meshBasicMaterial color="#6366f1" transparent opacity={0.4} side={THREE.DoubleSide} />
    </mesh>
  );
}

interface ThreeViewerProps {
  mode?: 'default' | 'reconstruct' | 'explore';
}

function ReconstructMesh() {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y += 0.01;
      ref.current.rotation.z += 0.005;
    }
  });

  return (
    <group ref={ref}>
      <mesh>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#6366f1" wireframe transparent opacity={0.3} />
      </mesh>
      <mesh scale={0.9}>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#818cf8" transparent opacity={0.6} />
      </mesh>
      <Sparkles count={50} scale={2} size={2} speed={0.2} color="#a855f7" />
    </group>
  );
}

export default function ThreeViewer({ mode = 'default' }: ThreeViewerProps) {
  return (
    <div className={`w-full h-full bg-slate-50/50 relative overflow-hidden ${mode === 'default' ? 'rounded-[3rem]' : 'rounded-none'}`}>
      {/* Integrated Meta Info Overlay */}
      {mode !== 'reconstruct' && (
        <div className="absolute top-8 inset-x-8 z-10 flex justify-between items-start pointer-events-none">
          <div className="flex flex-col gap-3">
            <div className="radiant-gradient px-4 py-2 rounded-2xl shadow-xl shadow-indigo-100/50 border border-white/40 w-fit backdrop-blur-md">
              <div className="flex flex-col">
                <span className="text-indigo-100 text-[8px] font-black uppercase tracking-[0.3em] mb-1 leading-none opacity-80">
                  {mode === 'explore' ? 'Spatial Exploration' : 'Neural Scan Active'}
                </span>
                <span className="text-white text-[13px] font-black uppercase tracking-wider leading-none">
                  {mode === 'explore' ? 'Global Archive' : 'Spatial Reconstruction'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <Canvas shadows dpr={[1, 2]}>
        <Suspense fallback={null}>
          <Stage environment="city" intensity={0.5} shadows={{ type: 'contact', opacity: 0.2, blur: 2 }}>
            <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
              {mode === 'reconstruct' ? (
                <ReconstructMesh />
              ) : (
                <mesh castShadow receiveShadow>
                  <dodecahedronGeometry args={[1, 0]} />
                  <meshStandardMaterial color="#e0e7ff" roughness={0.1} metalness={0.8} />
                </mesh>
              )}
              {mode !== 'explore' && <ScanningLaser />}
            </Float>
          </Stage>
          <Sparkles count={40} scale={6} size={1.5} speed={0.4} color="#6366f1" />
          <Grid 
            infiniteGrid 
            fadeDistance={25} 
            fadeStrength={4} 
            cellSize={0.5} 
            sectionSize={2} 
            sectionThickness={1} 
            sectionColor="#e0e7ff" 
            cellColor="#f8fafc" 
          />
        </Suspense>
        <OrbitControls makeDefault autoRotate autoRotateSpeed={mode === 'reconstruct' ? 2 : 0.5} enableZoom={false} />
        <PerspectiveCamera makeDefault position={[0, 2, 6]} fov={35} />
      </Canvas>

      {mode !== 'reconstruct' && (
        <div className="absolute bottom-8 right-8 z-10 text-right">
          <div className="flex items-center gap-2 justify-end mb-1">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <p className="text-slate-800 text-[11px] font-bold uppercase tracking-wider">Lidar Uplink Active</p>
          </div>
          <p className="text-slate-400 text-[9px] uppercase tracking-widest">Resolution: 0.2mm Precision</p>
        </div>
      )}
    </div>
  );
}
