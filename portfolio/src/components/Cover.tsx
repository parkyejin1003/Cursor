import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const CoverSection = styled.section`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
  position: relative;
`;

const CoverContent = styled.div`
  text-align: center;
`;

const Title = styled(motion.h1)`
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #000;
`;

const Year = styled(motion.p)`
  font-size: 1.5rem;
  margin-bottom: 2rem;
  color: #666;
`;

const Role = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
  h2 {
    font-size: 2rem;
    color: #333;
  }
`;

const Cover = () => {
  return (
    <CoverSection>
      <CoverContent>
        <Title
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          portfolio
        </Title>
        <Year
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          year
        </Year>
        <Role>
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            publisher
          </motion.h2>
          <motion.h2
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            designer
          </motion.h2>
        </Role>
      </CoverContent>
    </CoverSection>
  );
};

export default Cover; 