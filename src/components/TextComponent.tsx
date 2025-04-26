import React from 'react';
import { Html } from '@react-three/drei';
import styled from 'styled-components';

const TextComponent = ({
  displaySpeed,
  displayMaxSpeed,
}: {
  displaySpeed: number;
  displayMaxSpeed: number;
}) => {
  const text = `Speed: ${displaySpeed.toFixed(1)} rpm`;
  const textMaxSpeed = `Max Speed: ${displayMaxSpeed.toFixed(1)} rpm`;
  const width = window.innerWidth;

  return (
    <>
      <Html position={[0, 1.5, 0]} center>
        <TextStyled $width={width}>TAP TO ACCELERATE</TextStyled>
        <TextStyled $width={width}>TRY TO REACH MAX SPEED</TextStyled>
        <TextStyled $width={width}>{text}</TextStyled>
        <TextStyled $width={width}>{textMaxSpeed}</TextStyled>
      </Html>
      <Html position={[0, -1.5, 0]} center>
        <TextStyled $width={width}>
          Ready to accelerate your brand with interactive 3D?
        </TextStyled>
        <TextBtnStyled $width={width}>
          <div className="btn">
            <a href="mailto:hello@skitstudio.com">Contact SKIT</a>
          </div>
        </TextBtnStyled>
      </Html>
    </>
  );
};

export default TextComponent;

const TextStyled = styled.div<{ $width: number }>`
  color: white;
  font-size: 25px;
  width: ${({ $width }) => $width}px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TextBtnStyled = styled.div<{ $width: number }>`
  color: white;
  font-size: 25px;
  width: ${({ $width }) => $width}px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  .btn {
    cursor: pointer;
    border: 2px solid white;
    padding: 10px 20px;
    a {
      text-decoration: none;
      color: white;
    }
  }
`;
