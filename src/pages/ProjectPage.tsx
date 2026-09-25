import {Link, useParams} from "react-router-dom";

function ProjectPage() {
    const {projectId} = useParams();
    return (
        <>
            <h1>{projectId}</h1>
            <Link to={`/projects/${projectId}/tasks/17`}>Task 17</Link>
        </>
    )
}

export default ProjectPage;