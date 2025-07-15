import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import vvitacmLogo from '@/assets/vvitacm_logo.png';
import promoVideo from '@/assets/Create_a_sleek_second_K_v.mp4';

interface VanillaThreeBackgroundProps {
  isDark: boolean;
}

export const VanillaThreeBackground = ({ isDark }: VanillaThreeBackgroundProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const frameRef = useRef<number>(0);
  const clockRef = useRef(new THREE.Clock());
  const [isMobile, setIsMobile] = useState(false);
  
  // Animation objects refs
  const particlesRef = useRef<THREE.Points | null>(null);
  const sphereRef = useRef<THREE.Mesh | null>(null);
  const ringsGroupRef = useRef<THREE.Group | null>(null);
  const waterRef = useRef<THREE.Mesh | null>(null);
  const logoRef = useRef<THREE.Mesh | null>(null);
  const vortexRef = useRef<THREE.Mesh | null>(null);
  const energyParticlesRef = useRef<THREE.Points[]>([]);

  // Check if device is mobile for performance optimization
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      antialias: !isMobile, 
      alpha: true,
      powerPreference: 'high-performance',
      stencil: false
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 1.5));
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    // Store refs
    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;

    // Camera position
    camera.position.set(0, 0, 5);
    camera.lookAt(0, 0, 0);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(10, 10, 5);
    scene.add(directionalLight);

    // Create particle system
    const createParticles = () => {
      const count = isMobile ? 500 : 1000;
      const positions = new Float32Array(count * 3);
      const sizes = new Float32Array(count);
      
      for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 10;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
        sizes[i] = Math.random() * 0.03 + 0.01;
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

      const material = new THREE.PointsMaterial({
        size: 0.015,
        color: isDark ? '#8b5cf6' : '#6366f1',
        sizeAttenuation: true,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      });

      const particles = new THREE.Points(geometry, material);
      scene.add(particles);
      particlesRef.current = particles;
    };

    // Create central vortex effect
    const createVortex = () => {
      const geometry = new THREE.RingGeometry(0.5, 2, 64, 8);
      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          color: { value: new THREE.Color(isDark ? '#4c1d95' : '#4338ca') },
          accent: { value: new THREE.Color(isDark ? '#7c3aed' : '#818cf8') }
        },
        vertexShader: `
          varying vec2 vUv;
          varying vec3 vPosition;
          uniform float time;
          
          void main() {
            vUv = uv;
            vPosition = position;
            
            // Add spiral distortion
            float angle = atan(position.y, position.x) + time * 0.5;
            float radius = length(position.xy);
            
            vec3 newPosition = position;
            newPosition.z += sin(angle * 8.0 + time * 2.0) * 0.1 * radius;
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
          }
        `,
        fragmentShader: `
          uniform float time;
          uniform vec3 color;
          uniform vec3 accent;
          varying vec2 vUv;
          varying vec3 vPosition;
          
          void main() {
            float angle = atan(vPosition.y, vPosition.x);
            float radius = length(vPosition.xy);
            
            // Create swirling pattern
            float spiral = sin(angle * 12.0 + time * 2.0 - radius * 4.0) * 0.5 + 0.5;
            float vortex = sin(radius * 8.0 - time * 3.0) * 0.5 + 0.5;
            
            vec3 finalColor = mix(color, accent, spiral * vortex);
            float alpha = (1.0 - radius * 0.5) * 0.8;
            
            gl_FragColor = vec4(finalColor, alpha);
          }
        `,
        transparent: true,
        side: THREE.DoubleSide
      });

      const vortex = new THREE.Mesh(geometry, material);
      vortex.position.z = -1;
      scene.add(vortex);
      vortexRef.current = vortex;
    };

    // Create gradient sphere
    const createSphere = () => {
      const geometry = new THREE.SphereGeometry(1.5, 64, 64);
      const material = new THREE.MeshPhongMaterial({
        color: isDark ? '#4c1d95' : '#4338ca',
        emissive: isDark ? '#7c3aed' : '#818cf8',
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.6,
        wireframe: true
      });

      const sphere = new THREE.Mesh(geometry, material);
      scene.add(sphere);
      sphereRef.current = sphere;
    };

    // Create orbital rings
    const createRings = () => {
      const group = new THREE.Group();
      
      for (let i = 1; i <= 3; i++) {
        const geometry = new THREE.TorusGeometry(i * 0.8, 0.04, 16, 100);
        const material = new THREE.MeshPhongMaterial({
          color: isDark ? '#7c3aed' : '#818cf8',
          emissive: isDark ? '#4c1d95' : '#4338ca',
          emissiveIntensity: 0.3,
          transparent: true,
          opacity: 0.7 - (i * 0.1),
          wireframe: true
        });

        const ring = new THREE.Mesh(geometry, material);
        ring.rotation.x = Math.PI / 2;
        group.add(ring);
      }

      scene.add(group);
      ringsGroupRef.current = group;
    };

    // Create energy particles
    const createEnergyParticles = () => {
      if (isMobile) return; // Skip on mobile for performance
      
      for (let stream = 0; stream < 3; stream++) {
        const count = 200;
        const positions = new Float32Array(count * 3);
        
        for (let i = 0; i < count; i++) {
          const t = i / count;
          const angle = stream * (Math.PI * 2 / 3) + t * Math.PI * 4;
          const radius = 3 - t * 2;
          
          positions[i * 3] = Math.cos(angle) * radius;
          positions[i * 3 + 1] = Math.sin(angle) * radius;
          positions[i * 3 + 2] = (t - 0.5) * 2;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const material = new THREE.PointsMaterial({
          size: 0.02,
          color: isDark ? '#a855f7' : '#7c3aed',
          transparent: true,
          opacity: 0.8,
          blending: THREE.AdditiveBlending
        });

        const energyParticles = new THREE.Points(geometry, material);
        scene.add(energyParticles);
        energyParticlesRef.current.push(energyParticles);
      }
    };

    // Load and create logo
    const createLogo = () => {
      const textureLoader = new THREE.TextureLoader();
      textureLoader.load(vvitacmLogo, (texture) => {
        const geometry = new THREE.PlaneGeometry(1, 1);
        const material = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          alphaTest: 0.1
        });

        const logo = new THREE.Mesh(geometry, material);
        logo.position.set(0, 0, 0.1);
        
        // Add glow effect around logo
        const glowGeometry = new THREE.PlaneGeometry(1.2, 1.2);
        const glowMaterial = new THREE.MeshBasicMaterial({
          color: isDark ? '#7c3aed' : '#818cf8',
          transparent: true,
          opacity: 0.3,
          blending: THREE.AdditiveBlending
        });
        
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.position.z = -0.1;
        logo.add(glow);

        scene.add(logo);
        logoRef.current = logo;
      });
    };

    // Initialize all elements
    createParticles();
    createVortex();
    createSphere();
    if (!isMobile) {
      createRings();
      createEnergyParticles();
    }
    createLogo();

    // Animation loop
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      const elapsedTime = clockRef.current.getElapsedTime();

      // Animate particles
      if (particlesRef.current) {
        particlesRef.current.rotation.x = elapsedTime * 0.05;
        particlesRef.current.rotation.y = elapsedTime * 0.075;
      }

      // Animate vortex
      if (vortexRef.current) {
        const material = vortexRef.current.material as THREE.ShaderMaterial;
        material.uniforms.time.value = elapsedTime;
        vortexRef.current.rotation.z = elapsedTime * 0.3;
      }

      // Animate sphere
      if (sphereRef.current) {
        const scale = 1 + Math.sin(elapsedTime * 0.3) * 0.05;
        sphereRef.current.scale.setScalar(scale);
        sphereRef.current.rotation.y = elapsedTime * 0.1;
      }

      // Animate rings
      if (ringsGroupRef.current) {
        ringsGroupRef.current.rotation.y = elapsedTime * 0.1;
        ringsGroupRef.current.position.y = Math.sin(elapsedTime * 0.2) * 0.2;
      }

      // Animate energy particles
      energyParticlesRef.current.forEach((particles, index) => {
        particles.rotation.z = elapsedTime * (0.5 + index * 0.2);
        particles.rotation.y = elapsedTime * 0.3;
      });

      // Animate logo
      if (logoRef.current) {
        logoRef.current.rotation.z = Math.sin(elapsedTime * 0.5) * 0.1;
        const scale = 1 + Math.sin(elapsedTime * 0.8) * 0.05;
        logoRef.current.scale.setScalar(scale);
      }

      // Subtle camera movement
      if (cameraRef.current) {
        const x = Math.sin(elapsedTime * 0.1) * 0.2;
        const y = Math.cos(elapsedTime * 0.1) * 0.1;
        
        cameraRef.current.position.x += (x - cameraRef.current.position.x) * 0.01;
        cameraRef.current.position.y += (y - cameraRef.current.position.y) * 0.01;
        cameraRef.current.lookAt(0, 0, 0);
      }

      renderer.render(scene, camera);
    };

    // Handle resize
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;
      
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    animate();

    // Cleanup
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      window.removeEventListener('resize', handleResize);
      
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      // Dispose of geometries and materials
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
      
      renderer.dispose();
    };
  }, [isDark, isMobile]);

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
      
      {/* Three.js Canvas */}
      <div 
        ref={mountRef} 
        className="absolute inset-0"
        style={{ pointerEvents: 'none' }}
      />
      
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-black/40" />
    </div>
  );
};