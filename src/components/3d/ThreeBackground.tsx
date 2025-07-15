import { useRef, useEffect, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, useTexture, PerformanceMonitor, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import promoVideo from '@/assets/Create_a_sleek_second_K_v.mp4';

interface ThreeBackgroundProps {
  isDark: boolean;
}

// Animated floating particles
const Particles = ({ count = 2000, isDark }: { count: number; isDark: boolean }) => {
  const mesh = useRef<THREE.Points>(null);
  
  // Create particles with random positions
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    
    return positions;
  }, [count]);

  // Create particle sizes for visual interest
  const particleSizes = useMemo(() => {
    const sizes = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      sizes[i] = Math.random() * 0.03 + 0.01; // Random sizes between 0.01 and 0.04
    }
    
    return sizes;
  }, [count]);

  // Animation loop
  useFrame((state) => {
    if (!mesh.current) return;
    
    // Rotate the entire particle system
    mesh.current.rotation.x = state.clock.getElapsedTime() * 0.05;
    mesh.current.rotation.y = state.clock.getElapsedTime() * 0.075;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesPosition.length / 3}
          array={particlesPosition}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={particleSizes.length}
          array={particleSizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.015} 
        color={isDark ? '#8b5cf6' : '#6366f1'} 
        sizeAttenuation 
        transparent 
        depthWrite={false}
        vertexColors={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// Animated gradient sphere
const GradientSphere = ({ isDark }: { isDark: boolean }) => {
  const mesh = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!mesh.current) return;
    
    // Gentle pulsing animation
    mesh.current.scale.x = 1 + Math.sin(state.clock.getElapsedTime() * 0.3) * 0.05;
    mesh.current.scale.y = 1 + Math.sin(state.clock.getElapsedTime() * 0.3) * 0.05;
    mesh.current.scale.z = 1 + Math.sin(state.clock.getElapsedTime() * 0.3) * 0.05;
    
    // Slow rotation
    mesh.current.rotation.y = state.clock.getElapsedTime() * 0.1;
  });

  return (
    <mesh ref={mesh} position={[0, 0, 0]}>
      <sphereGeometry args={[1.5, 64, 64]} />
      <meshPhongMaterial 
        color={isDark ? '#4c1d95' : '#4338ca'}
        emissive={isDark ? '#7c3aed' : '#818cf8'}
        emissiveIntensity={0.5}
        transparent
        opacity={0.6}
        wireframe
      />
    </mesh>
  );
};

// Animated floating rings
const FloatingRings = ({ isDark }: { isDark: boolean }) => {
  const group = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!group.current) return;
    
    // Gentle floating animation
    group.current.rotation.y = state.clock.getElapsedTime() * 0.1;
    group.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.2;
  });

  return (
    <group ref={group}>
      {[1, 2, 3].map((i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <torusGeometry args={[i * 0.8, 0.04, 16, 100]} />
          <meshPhongMaterial 
            color={isDark ? '#7c3aed' : '#818cf8'}
            emissive={isDark ? '#4c1d95' : '#4338ca'}
            emissiveIntensity={0.3}
            transparent
            opacity={0.7 - (i * 0.1)}
            wireframe
          />
        </mesh>
      ))}
    </group>
  );
};

// Flowing water effect using custom shader material
const FlowingWater = ({ isDark }: { isDark: boolean }) => {
  const mesh = useRef<THREE.Mesh>(null);
  const [time, setTime] = useState(0);
  
  // Custom shader for water-like effect
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color(isDark ? '#4c1d95' : '#4338ca') },
        accent: { value: new THREE.Color(isDark ? '#7c3aed' : '#818cf8') }
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
          vUv = uv;
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color;
        uniform vec3 accent;
        varying vec2 vUv;
        varying vec3 vPosition;
        
        // Simple noise function
        float noise(vec2 p) {
          return sin(p.x * 10.0) * sin(p.y * 10.0);
        }
        
        void main() {
          // Create flowing water effect
          float n = noise(vUv * 2.0 + time * 0.1);
          
          // Add ripples
          float ripple1 = sin((vUv.x * 20.0) + time) * sin((vUv.y * 20.0) + time) * 0.1;
          float ripple2 = sin((vUv.x * 15.0) - time * 0.5) * sin((vUv.y * 15.0) - time * 0.5) * 0.1;
          
          float blend = n + ripple1 + ripple2;
          
          // Mix colors based on the noise
          vec3 finalColor = mix(color, accent, blend * 0.5 + 0.5);
          
          // Add transparency
          float alpha = 0.6 + 0.2 * sin(time + vUv.x * 5.0 + vUv.y * 5.0);
          
          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide
    });
  }, [isDark]);
  
  // Update time uniform for animation
  useFrame((state) => {
    if (!mesh.current) return;
    
    // Update time uniform
    shaderMaterial.uniforms.time.value = state.clock.getElapsedTime();
    
    // Gentle rotation
    mesh.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.1;
    mesh.current.rotation.z = Math.cos(state.clock.getElapsedTime() * 0.2) * 0.1;
  });
  
  return (
    <mesh ref={mesh} position={[0, 0, -2]} rotation={[0, 0, 0]}>
      <planeGeometry args={[10, 10, 32, 32]} />
      <primitive object={shaderMaterial} attach="material" />
    </mesh>
  );
};

// Scene manager for performance optimization
const SceneManager = ({ isDark, isMobile = false }: { isDark: boolean; isMobile?: boolean }) => {
  const [perfSetting, setPerfSetting] = useState(isMobile ? 0.5 : 1);
  
  // Adjust initial performance settings based on device
  useEffect(() => {
    setPerfSetting(isMobile ? 0.5 : 1);
  }, [isMobile]);
  
  return (
    <>
      <PerformanceMonitor
        onIncline={() => setPerfSetting(Math.min(perfSetting + 0.1, isMobile ? 0.7 : 1))}
        onDecline={() => setPerfSetting(Math.max(perfSetting - 0.2, 0.2))}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={0.5} />
        {perfSetting > 0.3 && !isMobile && <FlowingWater isDark={isDark} />}
        <Particles count={Math.floor((isMobile ? 500 : 1000) * perfSetting)} isDark={isDark} />
        <GradientSphere isDark={isDark} />
        {!isMobile && <FloatingRings isDark={isDark} />}
        {perfSetting > 0.6 && (
          <Stars radius={50} depth={50} count={Math.floor((isMobile ? 400 : 800) * perfSetting)} factor={4} fade speed={1} />
        )}
      </PerformanceMonitor>
    </>
  );
};

// Camera controller for subtle movement
const CameraController = () => {
  const { camera } = useThree();
  const cameraRef = useRef(camera);
  
  useFrame((state) => {
    if (!cameraRef.current) return;
    
    // Very subtle floating camera movement
    const time = state.clock.getElapsedTime();
    const x = Math.sin(time * 0.1) * 0.2;
    const y = Math.cos(time * 0.1) * 0.1;
    
    // Smoothly interpolate camera position
    cameraRef.current.position.x += (x - cameraRef.current.position.x) * 0.01;
    cameraRef.current.position.y += (y - cameraRef.current.position.y) * 0.01;
    
    // Always look at center
    cameraRef.current.lookAt(0, 0, 0);
  });
  
  return null;
};

export const ThreeBackground = ({ isDark }: ThreeBackgroundProps) => {
  // Use a ref to optimize performance by preventing unnecessary re-renders
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if device is mobile for performance optimization
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Video Background */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src={promoVideo} type="video/mp4" />
      </video>
      
      {/* Three.js Canvas - Only render on non-mobile or if specifically enabled */}
      <div ref={canvasRef} className="absolute inset-0">
        <Canvas 
          dpr={[1, isMobile ? 1 : 1.5]} // Lower DPR for mobile
          frameloop="demand" // Only render when needed
          gl={{ 
            antialias: false, 
            powerPreference: 'high-performance',
            alpha: true,
            stencil: false,
            depth: true
          }}
          style={{ pointerEvents: 'none' }} // Prevent interaction for better performance
        >
          <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={45} />
          {!isMobile && <CameraController />}
          <SceneManager isDark={isDark} isMobile={isMobile} />
        </Canvas>
      </div>
      
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-black/40" />
    </div>
  );
};