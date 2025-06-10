import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: 20px;
  background-color: transparent;
  z-index: 1000;
`;

const SkipNav = styled.div`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

const Header = () => {
  return (
    <HeaderContainer>
      <SkipNav>
        <a href="#header">헤더 바로가기</a>
        <a href="#menu">메뉴 바로가기</a>
        <a href="#content">내용 바로가기</a>
      </SkipNav>
    </HeaderContainer>
  );
};

export default Header; 