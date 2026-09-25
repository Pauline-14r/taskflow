import type { Project } from '../../types/project';

interface ProjectCardProps {
    project: Project;
}

function ProjectCard({ project }: ProjectCardProps) {
    return (
        <>
            <h3>{project.name}</h3>
            <p>{project.description}</p>
            <span>{project.taskCount}</span>
        </>
    )
}

export default ProjectCard;