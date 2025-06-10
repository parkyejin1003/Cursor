import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const ProjectsSection = styled.section`
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

const ProjectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const ProjectCard = styled(motion.div)`
  background-color: #f8f9fa;
  border-radius: 10px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }
`;

const ProjectContent = styled.div`
  padding: 2rem;
  
  h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
  
  p {
    color: #666;
    margin-bottom: 1rem;
  }
`;

const ProjectButton = styled.a`
  display: inline-block;
  padding: 0.8rem 1.5rem;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #0056b3;
  }
`;

const Projects = () => {
  const projects = [
    {
      id: 1,
      title: "어반런드렛 클론코딩",
      description: "메인페이지 | 반응형",
      image: "urban-launderette.jpg",
      link: "#"
    },
    {
      id: 2,
      title: "프라이탁 웹 디자인",
      description: "코딩 | 메인+서브페이지 | 반응형",
      image: "freitag.jpg",
      link: "#"
    },
    {
      id: 3,
      title: "매일유업 웹디자인",
      description: "메인페이지 | 코딩",
      image: "maeil.jpg",
      link: "#"
    }
  ];

  return (
    <ProjectsSection id="projects">
      <Container>
        <Title>PROJECT</Title>
        <ProjectGrid>
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <img src={project.image} alt={project.title} />
              <ProjectContent>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <ProjectButton href={project.link}>사이트 보러가기</ProjectButton>
              </ProjectContent>
            </ProjectCard>
          ))}
        </ProjectGrid>
      </Container>
    </ProjectsSection>
  );
};

export default Projects; 