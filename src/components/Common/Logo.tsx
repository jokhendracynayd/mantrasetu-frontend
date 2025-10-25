import React from 'react';
import styled from 'styled-components';
import image2 from '../../assets/image2.png';

interface LogoProps {
  size?: 'small' | 'medium' | 'large' | 'extra-large';
  color?: string;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'medium', 
  color = '#ff6b35',
  className 
}) => {
  const sizes = {
    small: { width: '150px', height: '50px' },
    medium: { width: '220px', height: '75px' },
    large: { width: '300px', height: '100px' },
    'extra-large': { width: '400px', height: '140px' },
  };

  return (
    <LogoContainer className={className} size={sizes[size]} color={color}>
      <LogoImage src={image2} alt="MantraSetu Logo" />
    </LogoContainer>
  );
};

const LogoContainer = styled.div<{ size: { width: string; height: string }; color: string }>`
  position: relative;
  width: ${({ size }) => size.width};
  height: ${({ size }) => size.height};
  color: ${({ color }) => color};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const LogoImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const LogoText = styled.h1`
  font-family: ${({ theme }) => theme.fonts.secondary};
  font-size: 1.2em;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: currentColor;
  margin: 0;
  letter-spacing: 1px;
`;

const OrnamentalBorder = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

const RadiatingDots = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120%;
  height: 120%;
  pointer-events: none;
`;

const Dot = styled.div<{ angle: number; delay: number }>`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 4px;
  height: 4px;
  background: currentColor;
  border-radius: 50%;
  transform: translate(-50%, -50%) rotate(${({ angle }) => angle}deg) translateY(-60px);
  opacity: 0.6;
  animation: pulse 2s ease-in-out infinite;
  animation-delay: ${({ delay }) => delay}s;

  @keyframes pulse {
    0%, 100% {
      opacity: 0.3;
      transform: translate(-50%, -50%) rotate(${({ angle }) => angle}deg) translateY(-60px) scale(1);
    }
    50% {
      opacity: 0.8;
      transform: translate(-50%, -50%) rotate(${({ angle }) => angle}deg) translateY(-60px) scale(1.2);
    }
  }
`;

export default Logo;
