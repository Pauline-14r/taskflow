import {useParams} from "react-router-dom";

function TaskDetailsPage() {
    const {projectId, taskId} = useParams();
    return <h1>{projectId} {taskId}</h1>;
}

export default TaskDetailsPage;