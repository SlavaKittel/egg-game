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
  const text = displaySpeed.toFixed(1);
  const textMaxSpeed = displayMaxSpeed.toFixed(1);
  const width = window.innerWidth;
  const smallWidth = window.innerWidth < 550;

  return (
    <>
      <Html position={[0, 1.5, 0]} center>
        <MainPropStyled $smallWidth={smallWidth}>
          <TextStyled $width={width}>Tap To Accelerate</TextStyled>
          <TextStyled $width={width}>Try To Reach Max Speed!!</TextStyled>
          <TextStyled $width={width}>
            Speed:<SpeedStyled $smallWidth={smallWidth}>{text}</SpeedStyled>rpm
          </TextStyled>
          <TextStyled $width={width}>
            Max Speed:
            <SpeedStyled $smallWidth={smallWidth} $bold>
              {textMaxSpeed}
            </SpeedStyled>
            rpm
          </TextStyled>
        </MainPropStyled>
      </Html>
      <Html position={[0, -1.5, 0]} center>
        <MainPropStyled $smallWidth={smallWidth}>
          <TextStyled $width={width}>Ready to accelerate your brand</TextStyled>
          <TextStyled $width={width}>with interactive 3D?</TextStyled>
          <TextBtnStyled $width={width}>
            <div className="btn">
              <a href="mailto:hello@skitstudio.com">Contact SKIT</a>
            </div>
          </TextBtnStyled>
        </MainPropStyled>
      </Html>
    </>
  );
};

export default TextComponent;

const MainPropStyled = styled.div<{ $smallWidth: boolean }>`
  font-size: ${({ $smallWidth }) => ($smallWidth ? '16px' : '20px')};
  font-weight: ${({ $smallWidth }) => ($smallWidth ? '200' : '100')};
`;

const TextStyled = styled.div<{ $width: number }>`
  color: #fffcdcac;
  width: ${({ $width }) => $width}px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: flex-end;
`;

const TextBtnStyled = styled.div<{ $width: number }>`
  color: #fffef4ad;
  width: ${({ $width }) => $width}px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  .btn {
    cursor: pointer;
    border: 1px solid #fffef4ad;
    box-sizing: border-box;
    border-radius: 30px;
    padding: 10px 20px;
    a {
      text-decoration: none;
      color: #f2e8879d;
    }
    &:hover {
      border: 1px solid #f2e8879d;
      background-color: #f2e8879d;
      a {
        color: black;
      }
    }
  }
`;

const SpeedStyled = styled.span<{ $bold?: boolean; $smallWidth?: boolean }>`
  color: #f2e8879d;
  width: ${({ $smallWidth }) => ($smallWidth ? '36px' : '45px')};
  display: flex;
  justify-content: center;
  font-weight: ${({ $bold }) => ($bold ? '400' : '200')};
  border-radius: 30px;
`;
