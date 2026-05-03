"use client";

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Particles({ count = 1000 }) {
  const points = useRef<THREE.Points>(null);

  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return positions;
  }, [count]);

  useFrame((state, delta) => {
    if (points.current) {
      // Respect Reduced Motion settings for accessibility
      const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const rotationSpeed = isReducedMotion ? 0 : delta;
      
      points.current.rotation.y += rotationSpeed * 0.05;
      points.current.rotation.x += rotationSpeed * 0.02;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particlesPosition, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#3b82f6"
        transparent
        opacity={0.4}
        sizeAttenuation={true}
      />
    </points>
  );
}

export default function Scene() {
  return (
    <Canvas 
      camera={{ position: [0, 0, 5] }}
    >
      <Particles />
    </Canvas>
  );
}
