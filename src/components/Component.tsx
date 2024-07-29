import * as THREE from "three";
import React, { useMemo, useRef, useState, useEffect } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils";
import { Perf } from "r3f-perf";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import vertexYolkShader from "./../shaders/vertex.glsl?raw";
import fragmentYolkShader from "./../shaders/fragment.glsl?raw";
// TODO delete
import vertexYolkShader2 from "./../shaders/vertexYolk.glsl?raw";
import fragmentYolkShader2 from "./../shaders/fragmentYolk.glsl?raw";

let fractAmountYolk = 70;
let counterSine = 0;
let incrementCounter = true;
let rotationDefaultSpeedEgg = 0.005;
const maxSpeedEgg = 8;
let coeffOfSpeedEgg = 1;

const Component = () => {
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
      timestamps.timeDifference < 100
    )
      fractAmountYolk = fractAmountYolk - timeDependence;
    if (
      firstClick &&
      fractAmountYolk > 10 &&
      timestamps.timeDifference &&
      timestamps.timeDifference < 130
    )
      fractAmountYolk = fractAmountYolk - timeDependence;
    if (
      firstClick &&
      fractAmountYolk > 14 &&
      timestamps.timeDifference &&
      timestamps.timeDifference < 200
    )
      fractAmountYolk = fractAmountYolk - timeDependence;
    if (firstClick && fractAmountYolk > 30)
      fractAmountYolk = fractAmountYolk - timeDependence;
    if (!firstClick && fractAmountYolk < 70)
      fractAmountYolk = fractAmountYolk + timeDependence;

    // Speed coefficient
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
      eggRef.current.rotation.y +=
        rotationDefaultSpeedEgg * timeDependence * coeffOfSpeedEgg;
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

  const YolkShaderMaterial = React.forwardRef((props, ref) => {
    const yolkUniforms = {
      uColor: { value: new THREE.Color("#fdeb75") },
      uSpeed: { value: 0 },
      uNoiseStrength: { value: 0.5 },
      uDisplacementStrength: { value: 0.5 },
      uFractAmount: { value: 0 },
      lightDirection: { value: new THREE.Vector3(5, 2, 1).normalize() },
      ambientColor: { value: new THREE.Vector3(1, 1, 1).normalize() },
      lightIntensity: { value: 0.5 },
    };

    const shaderMaterial = useMemo(
      () =>
        new THREE.ShaderMaterial({
          vertexShader: vertexYolkShader,
          fragmentShader: fragmentYolkShader,
          uniforms: yolkUniforms,
        }),
      []
    );

    useFrame((state) => {
      // Yolk animation
      if (shaderMaterial.uniforms) {
        shaderMaterial.uniforms.uSpeed.value =
          (getEaseInOutQuad(counterSine / 100) * 100) / speedYolk;
        shaderMaterial.uniforms.uFractAmount.value =
          (getEaseInOutQuad(counterSine / 100) * 100) / fractAmountYolk;
      }
    });

    return (
      <primitive
        object={shaderMaterial}
        ref={ref}
        attach="material"
        {...props}
      />
    );
  });

  return (
    <>
      <Perf position="top-left" />
      <mesh ref={eggRef}>
        <mesh
          position={[0, 0, 0]}
          rotation={[0, 10, 0]}
          geometry={getEggShapeGeometry(widhtYolk, shapeYolk, sizeYolk, 10)}
        >
          <YolkShaderMaterial />
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
            thickness={0.95}
            transparent={true}
            opacity={0.6}
          />
        </mesh>
      </mesh>
      {/* TODO ambient don't used? */}
      <ambientLight color="#fff" intensity={0.2} />
      <directionalLight color="#fff" intensity={4} position={[20, 10, 2]} />
    </>
  );
};

export default Component;
