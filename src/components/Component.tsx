import * as THREE from "three";
import { useMemo, useRef, useState, useEffect } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils";
import { Perf } from "r3f-perf";
import { MeshPhysicalMaterial } from "three";
import CustomShaderMaterial from "three-custom-shader-material";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import vertexYolkShader from "./../shaders/vertexYolk.glsl?raw";
import fragmentYolkShader from "./../shaders/fragmentYolk.glsl?raw";

let fractAmountYolk = 70;
let counterSine = 0;
let incrementCounter = true;

const Component = () => {
  const materialYolkRef = useRef<THREE.ShaderMaterial>(null);
  const eggRef = useRef<THREE.Mesh>(null);

  const clickTimeoutRef = useRef<number | null>(null);
  const [firstClick, setFirstClick] = useState(false);

  const widhtEgg = 0.72;
  const shapeEgg = 0.03;
  const sizeEgg = 1;
  const rotationSpeedEgg = 0.2;

  const sizeYolk = 0.3;
  const widhtYolk = 0.62;
  const shapeYolk = 0.08;
  const speedYolk = 1000;

  const timeClikedDelay = 2500;

  function getEaseInOutQuad(t: number) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  const handleTouchStart = () => {
    if (!firstClick) {
      setFirstClick(true);
    }
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }
    clickTimeoutRef.current = setTimeout(() => {
      setFirstClick(false);
      clickTimeoutRef.current = null;
    }, timeClikedDelay);
  };
  useEffect(() => {
    return () => {
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    window.addEventListener("touchstart", handleTouchStart);
    return () => window.removeEventListener("touchstart", handleTouchStart);
  }, []);

  useFrame(({ clock }, delta) => {
    // Counter for constant sine animation, 0 - stop, 100 - max
    if (counterSine === 100) incrementCounter = false;
    if (counterSine === 0) incrementCounter = true;
    if (counterSine >= 0 && counterSine < 100 && incrementCounter) {
      counterSine++;
    } else if (counterSine <= 100 && !incrementCounter) {
      counterSine--;
    }

    // Fraction amount speed, 20 - fast, 70 - slow
    if (firstClick && fractAmountYolk > 20) {
      fractAmountYolk--;
    } else if (!firstClick && fractAmountYolk < 70) {
      fractAmountYolk++;
    }

    const elapsedTime = clock.getElapsedTime() - delta;
    if (eggRef.current) {
      eggRef.current.rotation.y = elapsedTime * rotationSpeedEgg;
    }
    if (materialYolkRef?.current && materialYolkRef.current?.uniforms) {
      materialYolkRef.current.uniforms.uTime.value = elapsedTime;
    }
    if (materialYolkRef?.current && materialYolkRef.current?.uniforms) {
      materialYolkRef.current.uniforms.uSpeed.value =
        (getEaseInOutQuad(counterSine / 100) * 100) / speedYolk;
      materialYolkRef.current.uniforms.uFractAmount.value =
        (getEaseInOutQuad(counterSine / 100) * 100) / fractAmountYolk;
    }
  });

  const getEggShapeGeometry = (
    widht: number,
    shape: number,
    size: number,
    segments: number
  ) => {
    const points: THREE.Vector2[] = [];
    for (let deg = 0; deg <= 180; deg += 1) {
      const rad = (Math.PI * deg) / 180;
      const point = new THREE.Vector2(
        (widht + shape * Math.cos(rad)) * Math.sin(rad) * size,
        -Math.cos(rad) * size
      );
      points.push(point);
    }

    const geometry = useMemo(() => {
      const geometry = mergeVertices(new THREE.LatheGeometry(points, segments));
      geometry.computeTangents();
      return geometry;
    }, []);

    return geometry;
  };

  // TODO move in one function
  // EggShell Texture
  const getNameEggShellTexture = (type: string) => `./texture/egg/${type}.png`;
  const [eggShellRoughnessMap] = useLoader(TextureLoader, [
    getNameEggShellTexture("roughness"),
  ]);
  const repeatEggTextures = (texture: {
    wrapS: number;
    wrapT: number;
    repeat: { x: number; y: number };
  }) => {
    const repeat = 0.1;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.x = repeat * 20;
    texture.repeat.y = repeat * 20;
  };
  repeatEggTextures(eggShellRoughnessMap);
  //

  // EggNoise Texture
  const getNameEggNoiseTexture = (type: string) =>
    `./texture/noise/${type}.png`;
  const [eggNoiseMetalnessMap] = useLoader(TextureLoader, [
    getNameEggNoiseTexture("noise"),
  ]);
  const repeatEggNoiseTextures = (texture: {
    wrapS: number;
    wrapT: number;
    repeat: { x: number; y: number };
  }) => {
    const repeat = 0.1;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.x = repeat * 20;
    texture.repeat.y = repeat * 20;
  };
  repeatEggNoiseTextures(eggNoiseMetalnessMap);
  //

  const yolkUniforms = {
    uTime: { value: 0 },
    uColor: { value: new THREE.Color("#fdeb75") },
    uSpeed: { value: 0 },
    uNoiseStrength: { value: 0.5 },
    uDisplacementStrength: { value: 0.5 },
    uFractAmount: { value: 0 },
  };

  return (
    <>
      <Perf position="top-left" />
      <mesh ref={eggRef}>
        <mesh
          position={[0, 0, 0]}
          rotation={[0, 10, 0]}
          geometry={getEggShapeGeometry(widhtYolk, shapeYolk, sizeYolk, 50)}
        >
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
        {/* START BLUR */}
        <mesh
          rotation={[0, 10, 0]}
          geometry={getEggShapeGeometry(widhtEgg, shapeEgg, sizeEgg, 10)}
        >
          <meshPhysicalMaterial
            color="#fdeb75"
            metalness={0.2}
            roughness={0.3}
            transparent={true}
            opacity={0.7}
            transmission={1}
          />
        </mesh>
        {/* END BLUR */}
        <mesh
          rotation={[0, 10, 0]}
          geometry={getEggShapeGeometry(widhtEgg, shapeEgg, sizeEgg, 50)}
        >
          <meshPhysicalMaterial
            displacementScale={0}
            displacementBias={0}
            metalnessMap={eggNoiseMetalnessMap}
            roughnessMap={eggShellRoughnessMap}
            color="#fdeb75"
            metalness={0.3}
            roughness={0.9}
            transmission={1}
            thickness={2}
            transparent={true}
            opacity={0.7}
          />
        </mesh>
      </mesh>
      <ambientLight color="#fff" intensity={1} />
      <directionalLight color="#fff" intensity={3} position={[20, 10, 2]} />
    </>
  );
};

export default Component;
