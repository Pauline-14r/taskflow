import {useParams} from "react-router-dom";
import {useAuth} from "../../context/useAuth.ts";
import {useEffect, useState} from "react";
import type {Project} from "../../types/project.ts"
import type {Task} from "../../types/task.ts"
import {getProject} from "../../api/projects.ts";
import {ApiError} from "../../errors/ApiError.ts";
import {Alert, Spin} from "antd";
import {getProjectTasks} from "../../api/tasks.ts";
import {TaskCard} from "../../components/TaskCard/TaskCard.tsx";

function ProjectPage() {
    const { projectId } = useParams();
    const { accessToken } = useAuth();
    const [project, setProject] = useState<Project | null>(null);
    const [projectError, setProjectError] = useState<string | null>(null);
    const [tasksError, setTasksError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [tasksLoading, setTasksLoading] = useState<boolean>(false);
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
      async function loadProject() {
          try {
              if (accessToken === null || typeof projectId !== "string") {
                  return;
              }
              setLoading(true);
              setProjectError(null);
              const data = await getProject(accessToken, projectId);
              setProject(data);
          } catch (e) {
              if (e instanceof ApiError) {
                  setProjectError("Failed to get project")
              }
          } finally {
              setLoading(false);
          }
      }
      loadProject();
    }, [accessToken, projectId]);

    useEffect(() => {
        async function loadTasks() {
            try {
                if (accessToken === null || typeof projectId !== "string") {
                    return;
                }
                setTasksLoading(true);
                setTasksError(null);
                const data = await getProjectTasks(accessToken, projectId);
                setTasks(data)
            } catch (e) {
                if (e instanceof ApiError) {
                    setTasksError("Failed to get tasks")
                }
            } finally {
                setTasksLoading(false);
            }
        }
        loadTasks();
    }, [accessToken, projectId]);

    return (
        <div>
            {loading ? <Spin /> : null}
            {projectError !== null && (
                <Alert type="error" title={projectError} />
            )}
            {project !== null && (
                <div>
                    <div>
                        <h1>{project.name}</h1>
                        {project.description !== null && (
                            <div>{project.description}</div>
                        )}
                        <span>{project.taskCount}</span>
                        <span>{project.createdAt}</span>
                    </div>
                    <div>
                        {tasksLoading ? <Spin /> : null}
                        {tasksError !== null && (
                            <Alert type="error" title={tasksError} />
                        )}
                        <div>
                            <h2>TODO</h2>
                            {tasks
                                .filter((task) => task.status === "TODO")
                                .map((task) => (
                                    <TaskCard key={task.id} task={task} />
                                ))}
                        </div>
                        <div>
                            <h2>IN PROGRESS</h2>
                            {tasks
                                .filter((task) => task.status === "IN_PROGRESS")
                                .map((task) => (
                                    <TaskCard key={task.id} task={task} />
                                ))}
                        </div>
                        <div>
                            <h2>DONE</h2>
                            {tasks
                                .filter((task) => task.status === "DONE")
                                .map((task) => (
                                    <TaskCard key={task.id} task={task} />
                                ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProjectPage;