import * as THREE from "three";
import { useMemo, useRef } from "react";
import { LatheGeometry, Vector2, Color } from "three";
import { useFrame } from "@react-three/fiber";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils";
import { MeshPhysicalMaterial, IcosahedronGeometry, EllipseCurve, MeshStandardMaterial } from "three";
import CustomShaderMaterial from "three-custom-shader-material";
// TODO add ?raw to the module.export on vite config
import vertexShader from "../shaders/vertex.glsl?raw";
import fragmentShader from "./../shaders/fragment.glsl?raw";

const Component = () => {
  const materialEggRef = useRef<typeof CustomShaderMaterial>(null);

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    // TODO types
    if (materialEggRef?.current && materialEggRef.current?.uniforms) {
      materialEggRef.current.uniforms.uTime.value = elapsedTime;
    }
  });

  const eggPoints: THREE.Vector2[] = [];
  for (let deg = 0; deg <= 180; deg += 1) {
    const sizeFactor = 0.3;
    const rad = (Math.PI * deg) / 180;
    const point = new THREE.Vector2(
      ((0.72 + 0.008 * Math.cos(rad)) * Math.sin(rad)) * sizeFactor,
      (-Math.cos(rad)) * sizeFactor
    );
    eggPoints.push(point);
  }

  const geometry = useMemo(() => {
    const geometry = mergeVertices(new LatheGeometry(eggPoints, 1000));
    geometry.computeTangents();
    return geometry;
  }, []);

  const uniforms = {
    uTime: { value: 0 },
    uColor: { value: new Color("#fdf221") },
    uGradientStrength: { value: 0 },
    uSpeed: { value: 0 },
    uNoiseStrength: { value: 1 },
    uDisplacementStrength: { value: 0.5 },
    uFractAmount: { value: 3 },
  };

  return (
    <>
      <mesh rotation={[0, 10, 0]} geometry={geometry}>
        <CustomShaderMaterial
          ref={materialEggRef}
          baseMaterial={MeshPhysicalMaterial}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          silent
          roughness={0.5}
          metalness={0.3}
          reflectivity={0.46}
          clearcoat={0}
          ior={2.81}
          iridescence={2.81}
          uniforms={uniforms}
        />
      </mesh>
      <ambientLight color="#fff" intensity={2} />
      <directionalLight color="#fff" intensity={4} position={[0, 5, 2]} />
    </>
  );
};

export default Component;
