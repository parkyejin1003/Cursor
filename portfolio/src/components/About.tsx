import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const AboutSection = styled.section`
  padding: 100px 20px;
  background-color: #fff;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 3rem;
  text-align: center;
`;

const Content = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const InfoBlock = styled(motion.div)`
  padding: 2rem;
  background-color: #f8f9fa;
  border-radius: 10px;
  
  h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
  
  p {
    color: #666;
    line-height: 1.6;
  }
`;

const About = () => {
  return (
    <AboutSection id="about">
      <Container>
        <Title>ABOUT</Title>
        <Content>
          <InfoBlock
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3>name</h3>
            <p>홍길동</p>
          </InfoBlock>
          
          <InfoBlock
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3>contact</h3>
            <p>010-0000-0000</p>
            <p>example@email.com</p>
          </InfoBlock>
          
          <InfoBlock
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <h3>license</h3>
            <p>2020.02 GTQ그래픽기술자격 2급</p>
            <p>2020.08 컴퓨터활용능력 2급</p>
          </InfoBlock>
        </Content>
      </Container>
    </AboutSection>
  );
};

export default About; 