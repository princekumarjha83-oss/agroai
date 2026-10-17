import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Activity, Droplets, Thermometer, Radio, Compass } from 'lucide-react';

interface ThreeFarmVisualizerProps {
  interactive?: boolean;
  className?: string;
}

export const ThreeFarmVisualizer: React.FC<ThreeFarmVisualizerProps> = ({
  interactive = true,
  className = ''
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeNode, setActiveNode] = useState<{
    id: string;
    title: string;
    value: string;
    status: string;
  } | null>({
    id: 'node-1',
    title: 'Soil Moisture & Depth Sensor',
    value: '38% (Optimal Loam)',
    status: 'Healthy'
  });
  const [webGLSupported, setWebGLSupported] = useState(true);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check WebGL availability
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGLSupported(false);
        return;
      }
    } catch (e) {
      setWebGLSupported(false);
      return;
    }

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 400;

    // Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x123b2a, 0.04);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 5, 8.5);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xd9eed3, 1.2);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffc107, 2.4);
    sunLight.position.set(6, 12, 6);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    scene.add(sunLight);

    const greenFill = new THREE.DirectionalLight(0x66bb6a, 1.0);
    greenFill.position.set(-6, 4, -4);
    scene.add(greenFill);

    // Terrain: Agricultural Furrows
    const terrainGeo = new THREE.PlaneGeometry(12, 10, 48, 40);
    terrainGeo.rotateX(-Math.PI / 2);

    const pos = terrainGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      // Create crop ridges/furrows with sine wave
      const ridge = Math.sin(x * 3.5) * 0.18 + Math.cos(z * 2.0) * 0.12;
      pos.setY(i, ridge);
    }
    terrainGeo.computeVertexNormals();

    const terrainMat = new THREE.MeshStandardMaterial({
      color: 0x1a4531,
      roughness: 0.85,
      metalness: 0.1,
      flatShading: true
    });
    const terrain = new THREE.Mesh(terrainGeo, terrainMat);
    terrain.receiveShadow = true;
    scene.add(terrain);

    // Crop Rows: Instanced Mesh for Wheat / Crop Stalks
    const cropCount = 180;
    const cropGeo = new THREE.ConeGeometry(0.08, 0.5, 4);
    cropGeo.translate(0, 0.25, 0);
    const cropMat = new THREE.MeshStandardMaterial({
      color: 0x66bb6a,
      roughness: 0.6
    });

    const cropInstanced = new THREE.InstancedMesh(cropGeo, cropMat, cropCount);
    const dummy = new THREE.Object3D();
    let idx = 0;
    for (let r = -4; r <= 4; r += 0.8) {
      for (let c = -4.5; c <= 4.5; c += 0.5) {
        if (idx < cropCount) {
          const y = Math.sin(c * 3.5) * 0.18 + Math.cos(r * 2.0) * 0.12;
          dummy.position.set(c + (Math.random() - 0.5) * 0.1, y, r + (Math.random() - 0.5) * 0.1);
          dummy.scale.set(0.8 + Math.random() * 0.4, 0.8 + Math.random() * 0.6, 0.8 + Math.random() * 0.4);
          dummy.rotation.y = Math.random() * Math.PI;
          dummy.rotation.z = (Math.random() - 0.5) * 0.2;
          dummy.updateMatrix();
          cropInstanced.setMatrixAt(idx, dummy.matrix);
          idx++;
        }
      }
    }
    cropInstanced.castShadow = true;
    cropInstanced.receiveShadow = true;
    scene.add(cropInstanced);

    // Sensor Nodes (Glowing 3D beacons)
    const sensorNodes: { mesh: THREE.Group; id: string; title: string; value: string; status: string }[] = [];
    const nodeLocations = [
      { x: -2.5, z: -1, title: 'Soil Moisture Node #1', value: '38% (Optimal)', status: 'Healthy' },
      { x: 1.8, z: 1.5, title: 'NPK Telemetry Node #2', value: 'N:140 P:48 K:210 kg/ha', status: 'Optimal' },
      { x: -1.0, z: 2.2, title: 'Canopy Temp & Humidity', value: '26.4°C / 58% RH', status: 'Favorable' }
    ];

    nodeLocations.forEach((loc, i) => {
      const group = new THREE.Group();
      const poleGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.2, 8);
      const poleMat = new THREE.MeshStandardMaterial({ color: 0xdde5db, metalness: 0.8, roughness: 0.2 });
      const pole = new THREE.Mesh(poleGeo, poleMat);
      pole.position.y = 0.6;
      group.add(pole);

      const beaconGeo = new THREE.SphereGeometry(0.18, 16, 16);
      const beaconMat = new THREE.MeshStandardMaterial({
        color: i === 0 ? 0xffc107 : 0x66bb6a,
        emissive: i === 0 ? 0xffa000 : 0x2e7d32,
        emissiveIntensity: 0.9,
        roughness: 0.2
      });
      const beacon = new THREE.Mesh(beaconGeo, beaconMat);
      beacon.position.y = 1.25;
      group.add(beacon);

      // Light ring
      const ringGeo = new THREE.RingGeometry(0.2, 0.35, 24);
      ringGeo.rotateX(-Math.PI / 2);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x66bb6a,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.y = 0.05;
      group.add(ring);

      group.position.set(loc.x, 0, loc.z);
      scene.add(group);
      sensorNodes.push({ mesh: group, id: `node-${i + 1}`, title: loc.title, value: loc.value, status: loc.status });
    });

    // Scanning Drone / Telemetry Plane Indicator
    const scanRingGeo = new THREE.RingGeometry(0.8, 0.85, 32);
    scanRingGeo.rotateX(-Math.PI / 2);
    const scanRingMat = new THREE.MeshBasicMaterial({
      color: 0xffc107,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.75
    });
    const scanRing = new THREE.Mesh(scanRingGeo, scanRingMat);
    scanRing.position.set(0, 0.2, 0);
    scene.add(scanRing);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationY = 0;
    let targetRotationX = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseX = x;
      mouseY = y;
      targetRotationY = x * 0.4;
      targetRotationX = y * 0.25;
    };

    if (interactive) {
      container.addEventListener('mousemove', handleMouseMove);
    }

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Gentle terrain oscillation & rotation
      scene.rotation.y += (targetRotationY - scene.rotation.y) * 0.05;
      scene.rotation.x += (targetRotationX - scene.rotation.x) * 0.05;

      // Pulse beacon rings
      sensorNodes.forEach((node, i) => {
        const ring = node.mesh.children[2] as THREE.Mesh;
        if (ring) {
          const s = 1 + Math.sin(elapsed * 2.5 + i) * 0.25;
          ring.scale.set(s, s, s);
        }
      });

      // Expand scan ring
      const scanScale = (elapsed % 3.0) / 3.0;
      scanRing.scale.set(1 + scanScale * 4, 1 + scanScale * 4, 1);
      (scanRing.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 1 - scanScale);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (interactive) {
        container.removeEventListener('mousemove', handleMouseMove);
      }
      renderer.dispose();
      terrainGeo.dispose();
      terrainMat.dispose();
      cropGeo.dispose();
      cropMat.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [interactive]);

  return (
    <div className={`relative overflow-hidden rounded-2xl agri-card border border-white/20 shadow-xl ${className}`} style={{ minHeight: '380px', height: '100%', background: 'linear-gradient(145deg, #123B2A 0%, #0A2218 100%)' }}>
      {/* 3D Canvas Mount */}
      {webGLSupported ? (
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" style={{ minHeight: '380px' }} />
      ) : (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center text-white/90">
          <Compass className="w-12 h-12 text-[#66BB6A] mb-3 animate-spin" />
          <h4 className="text-lg font-semibold text-white">3D Precision Farm Grid</h4>
          <p className="text-sm text-white/70 max-w-sm mt-1">
            Displaying simulated agricultural topography and active IoT sensor telemetry.
          </p>
        </div>
      )}

      {/* Floating HUD Telemetry Overlay */}
      <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        <div className="flex items-center gap-2 bg-[#123B2A]/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 text-xs font-semibold text-white pointer-events-auto shadow-md">
          <span className="w-2 h-2 rounded-full bg-[#66BB6A] animate-pulse"></span>
          <span>3D Precision Farm Mesh (Live Field Simulation)</span>
        </div>

        <div className="flex items-center gap-2 bg-[#0A2218]/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-amber-400/30 text-xs text-amber-300 pointer-events-auto">
          <Radio className="w-3.5 h-3.5 text-amber-400" />
          <span>IoT Sensors: 3 Active Nodes</span>
        </div>
      </div>

      {/* Interactive Sensor Node Callout Card at Bottom */}
      {activeNode && (
        <div className="absolute bottom-4 left-4 right-4 bg-[#123B2A]/90 backdrop-blur-xl border border-white/20 p-3.5 rounded-xl text-white shadow-2xl flex flex-wrap items-center justify-between gap-3 transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#2E7D32]/80 flex items-center justify-center text-[#FFC107] border border-white/15">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-medium text-white/70 flex items-center gap-1.5">
                <span>Field Sensor Telemetry</span>
                <span className="text-[10px] bg-[#66BB6A]/20 text-[#66BB6A] px-1.5 py-0.5 rounded font-mono">
                  {activeNode.status}
                </span>
              </div>
              <div className="text-sm font-bold text-white tracking-wide">{activeNode.title}</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs text-white/60">Live Reading</div>
              <div className="text-sm font-semibold text-[#FFC107]">{activeNode.value}</div>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-white/70 bg-white/10 px-2.5 py-1 rounded-md">
              <Activity className="w-3 h-3 text-[#66BB6A]" />
              <span>NDVI 0.82 High</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
