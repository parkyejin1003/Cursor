import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaHtml5, FaCss3Alt, FaJs, FaReact, FaGithub } from 'react-icons/fa';
import { SiAdobephotoshop, SiAdobeillustrator, SiAdobexd, SiAdobeindesign, SiBlender } from 'react-icons/si';

const SkillsSection = styled.section`
  padding: 100px 20px;
  background-color: #f8f9fa;
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

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

const SkillItem = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  
  svg {
    width: 50px;
    height: 50px;
    margin-bottom: 1rem;
    color: #333;
  }
  
  p {
    font-size: 0.9rem;
    color: #666;
  }
`;

const Skills = () => {
  const skillsData = [
    { Icon: FaHtml5, name: 'HTML' },
    { Icon: FaCss3Alt, name: 'CSS' },
    { Icon: FaJs, name: 'JavaScript' },
    { Icon: FaReact, name: 'React' },
    { Icon: SiAdobephotoshop, name: 'Photoshop' },
    { Icon: SiAdobeillustrator, name: 'Illustrator' },
    { Icon: SiAdobexd, name: 'XD' },
    { Icon: SiAdobeindesign, name: 'InDesign' },
    { Icon: SiBlender, name: 'Blender' },
    { Icon: FaGithub, name: 'GitHub' }
  ];

  return (
    <SkillsSection id="skills">
      <Container>
        <Title>SKILL</Title>
        <SkillsGrid>
          {skillsData.map((skill, index) => (
            <SkillItem
              key={skill.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <skill.Icon />
              <p>{skill.name}</p>
            </SkillItem>
          ))}
        </SkillsGrid>
      </Container>
    </SkillsSection>
  );
};

export default Skills; 