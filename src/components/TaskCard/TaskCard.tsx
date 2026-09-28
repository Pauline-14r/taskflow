import type {Task} from "../../types/task.ts"
import {Link} from "react-router-dom";

export function TaskCard({task}: {task: Task}) {
    return (
        <Link to={`/projects/${task.projectId}/tasks/${task.id}`}>
            <div>
                <span>{task.key}</span>
                <span>{task.title}</span>
                <span>{task.priority}</span>
                {task.assignee ? (<span>{task.assignee.name}</span>) : <span>Unassigned</span>}
            </div>
        </Link>
    )
}