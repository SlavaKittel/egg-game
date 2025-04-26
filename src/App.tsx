import React, { useEffect, useState } from 'react';
import { Suspense } from 'react';
// import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import Component from './components/Component';
import TextComponent from './components/TextComponent';

import styled from 'styled-components';

const App = () => {
  // TODO ?
  const [isLoaded, setIsLoaded] = useState(false);
  // const [onSpeedChange, setSpeedChange] = useState<number>(0);
  const [displaySpeed, setDisplayedSpeed] = useState<number>(0);
  const [displayMaxSpeed, setDisplayedMaxpeed] = useState<number>(0);

  useEffect(() => {
    if (isLoaded) {
      document.body.classList.remove('loading');
    }
  }, [isLoaded]);

  // TODO ?
  // const handleLoad = () => {
  //   setIsLoaded(true);
  // };

  return (
    <AppStyled>
      {/* <LevaWrapper /> */}
      <Canvas
        camera={{
          position: [0, 0, 6],
          fov: 45,
          near: 0.1,
          far: 1000,
        }}
        gl={{ alpha: false }}
      >
        <TextComponent
          displaySpeed={displaySpeed}
          displayMaxSpeed={displayMaxSpeed}
        />
        <color attach="background" args={['#000']} />
        <Suspense fallback={null}>
          <Component
            setDisplayedSpeed={setDisplayedSpeed}
            setDisplayedMaxpeed={setDisplayedMaxpeed}
            displaySpeed={displaySpeed}
          />
        </Suspense>
        {/* TODO delete */}
        {/* <OrbitControls /> */}
      </Canvas>
    </AppStyled>
  );
};

export default App;

export const AppStyled = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;
