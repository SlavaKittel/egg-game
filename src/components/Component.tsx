import * as THREE from "three";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils";
import { MeshPhysicalMaterial } from "three";
import CustomShaderMaterial from "three-custom-shader-material";
import vertexYolkShader from "./../shaders/vertexYolk.glsl?raw";
import fragmentYolkShader from "./../shaders/fragmentYolk.glsl?raw";

const Component = () => {
  const materialYolkRef = useRef<THREE.ShaderMaterial>(null);
  const meashYolkRef = useRef<THREE.Mesh>(null);

  let increment = true;
  let counter = 0;

  const sizeYolk = 0.3;
  const widhtYolk = 0.62;
  const shapeYolk = 0.08;
  const rotationSpeedYolk = 0.9;
  const speedYolk = 1000;
  const fractAmountYolk = 20;

  function easeInOutQuad(t: number) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  window.addEventListener("click", (e) => {
    if (counter === 0) {
      const intervalId = setInterval(() => {
        if (counter <= 0 && !increment) {
          increment = true;
          return clearInterval(intervalId);
        }
        if (counter > 100) increment = false;
        if (!increment) return counter--;
        return counter++;
      }, 20);
    }
  });

  useFrame(({ clock }, delta) => {
    const elapsedTime = clock.getElapsedTime() - delta;
    if (meashYolkRef.current) {
      meashYolkRef.current.rotation.y = elapsedTime * rotationSpeedYolk;
    }
    if (materialYolkRef?.current && materialYolkRef.current?.uniforms) {
      materialYolkRef.current.uniforms.uTime.value = elapsedTime;
    }
    if (materialYolkRef?.current && materialYolkRef.current?.uniforms) {
      materialYolkRef.current.uniforms.uSpeed.value =
        (easeInOutQuad(counter / 100) * 100) / speedYolk;
      materialYolkRef.current.uniforms.uFractAmount.value =
        (easeInOutQuad(counter / 100) * 100) / fractAmountYolk;
    }
  });

  const yolkPoints: THREE.Vector2[] = [];
  for (let deg = 0; deg <= 180; deg += 1) {
    const rad = (Math.PI * deg) / 180;
    const point = new THREE.Vector2(
      (widhtYolk + shapeYolk * Math.cos(rad)) * Math.sin(rad) * sizeYolk,
      -Math.cos(rad) * sizeYolk
    );
    yolkPoints.push(point);
  }

  const yolkGeometry = useMemo(() => {
    const geometry = mergeVertices(new THREE.LatheGeometry(yolkPoints, 1000));
    geometry.computeTangents();
    return geometry;
  }, []);

  const yolkUniforms = {
    uTime: { value: 0 },
    uColor: { value: new THREE.Color("#fdf221") },
    uSpeed: { value: 0 },
    uNoiseStrength: { value: 0.5 },
    uDisplacementStrength: { value: 0.5 },
    uFractAmount: { value: 0 },
  };

  return (
    <>
      <mesh rotation={[0, 10, 0]} geometry={yolkGeometry} ref={meashYolkRef}>
        <CustomShaderMaterial
          ref={materialYolkRef}
          baseMaterial={MeshPhysicalMaterial}
          vertexShader={vertexYolkShader}
          fragmentShader={fragmentYolkShader}
          silent
          roughness={0.5}
          metalness={0.3}
          reflectivity={0.46}
          clearcoat={0}
          ior={2.81}
          iridescence={2.81}
          uniforms={yolkUniforms}
        />
      </mesh>
      <ambientLight color="#fff" intensity={2} />
      <directionalLight color="#fff" intensity={4} position={[0, 5, 2]} />
    </>
  );
};

export default Component;
