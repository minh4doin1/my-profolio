// src/components/Scene3D.tsx
"use client";
import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Icosahedron } from '@react-three/drei';
import * as THREE from 'three';

// Component con để xử lý animation
function AnimatedShape() {
  const meshRef = useRef<THREE.Mesh>(null!);

  // useFrame là một hook chạy trên mỗi frame (khoảng 60 lần/giây)
  useFrame((state, delta) => {
    // Quay vật thể một cách mượt mà
    meshRef.current.rotation.x += delta * 0.1;
    meshRef.current.rotation.y += delta * 0.2;
  });

  return (
    // Icosahedron là một khối đa diện 20 mặt, trông rất "techy"
    <Icosahedron ref={meshRef} args={[2, 0]}>
      {/* meshStandardMaterial cho phép vật thể phản ứng với ánh sáng */}
      <meshStandardMaterial color="#60a5fa" wireframe />
    </Icosahedron>
  );
}

// Component chính chứa toàn bộ cảnh 3D
const Scene3D = () => {
  return (
    <div className="absolute top-0 left-0 w-full h-full -z-10">
      <Canvas>
        {/* Ánh sáng môi trường, chiếu sáng đều mọi thứ */}
        <ambientLight intensity={0.5} />
        {/* Ánh sáng điểm, giống như một bóng đèn */}
        <pointLight position={[10, 10, 10]} />
        
        <AnimatedShape />
        
        {/* OrbitControls cho phép người dùng dùng chuột để xoay, zoom vật thể */}
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
};

export default Scene3D;