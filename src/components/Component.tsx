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
let rotationDefaultSpeedEgg = 0.005;
const maxSpeedEgg = 8;
let coeffOfSpeedEgg = 1;

const Component = () => {
  const materialYolkRef = useRef<THREE.ShaderMaterial>(null);
  const eggRef = useRef<THREE.Mesh>(null);
  const clickTimeoutRef = useRef<number | null>(null);
  const [firstClick, setFirstClick] = useState(false);
  const [timestamps, setTimestamps] = useState<{
    prevClick: null | number;
    lastClick: null | number;
    timeDifference: null | number;
  }>({ prevClick: null, lastClick: null, timeDifference: null });

  const widhtEgg = 0.72;
  const shapeEgg = 0.03;
  const sizeEgg = 1;
  const sizeYolk = 0.3;
  const widhtYolk = 0.62;
  const shapeYolk = 0.08;
  const speedYolk = 1000;
  const timeClikedDelay = 2500;

  function getEaseInOutQuad(t: number) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  const handleTouchStart = () => {
    const now = Date.now();
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

    setTimestamps((prevState) => {
      const timeDifference = prevState.lastClick
        ? now - prevState.lastClick
        : 0;
      return {
        prevClick: prevState.lastClick,
        lastClick: now,
        timeDifference: timeDifference,
      };
    });
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
    const timeDependence = delta * 50;

    // Counter for constant sine animation, 0 - stop, 100 - max
    if (counterSine > 100) incrementCounter = false;
    if (counterSine < 0) incrementCounter = true;
    if (counterSine > -3 && counterSine < 100 && incrementCounter) {
      counterSine = counterSine + timeDependence;
    } else if (counterSine <= 103 && !incrementCounter) {
      counterSine = counterSine - timeDependence;
    }

    // Fraction amount speed, 8 - fast, 70 - slow
    if (
      firstClick &&
      fractAmountYolk > 8 &&
      timestamps.timeDifference &&
      timestamps.timeDifference < 200
    )
    if (
      firstClick &&
      fractAmountYolk > 14 &&
      timestamps.timeDifference &&
      timestamps.timeDifference < 800
    )
      fractAmountYolk = fractAmountYolk - timeDependence;
    if (firstClick && fractAmountYolk > 20)
      fractAmountYolk = fractAmountYolk - timeDependence;
    if (!firstClick && fractAmountYolk < 70)
      fractAmountYolk = fractAmountYolk + timeDependence;


    // // Speed coefficient
    if (!firstClick && coeffOfSpeedEgg > 1)
      coeffOfSpeedEgg = coeffOfSpeedEgg - delta;
    if (
      firstClick &&
      timestamps.timeDifference &&
      timestamps.timeDifference < 1000 &&
      coeffOfSpeedEgg < maxSpeedEgg
    )
      coeffOfSpeedEgg = coeffOfSpeedEgg + delta;

  
    // Rotation Egg
    if (eggRef.current) {
      eggRef.current.rotation.y += rotationDefaultSpeedEgg * timeDependence * coeffOfSpeedEgg;
    }
  
    // Yolk animation
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
          geometry={getEggShapeGeometry(widhtYolk, shapeYolk, sizeYolk, 10)}
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
          geometry={getEggShapeGeometry(widhtEgg, shapeEgg, sizeEgg, 30)}
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
