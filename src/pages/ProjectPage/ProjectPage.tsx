import {useParams} from "react-router-dom";
import {useAuth} from "../../context/useAuth.ts";
import {useEffect, useState} from "react";
import type {Project} from "../../types/project.ts"
import type {Task, TaskPriority, TaskStatus} from "../../types/task.ts"
import {getProject} from "../../api/projects.ts";
import {ApiError} from "../../errors/ApiError.ts";
import {Alert, Input, Select, Spin} from "antd";
import { SearchOutlined } from '@ant-design/icons'
import {getProjectTasks} from "../../api/tasks.ts";
import {TaskCard} from "../../components/TaskCard/TaskCard.tsx";
import type {User} from "../../types/user.ts";
import {getUsers} from "../../api/users.ts";

function ProjectPage() {
    const { projectId } = useParams();
    const { accessToken } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [usersError, setUsersError] = useState<string | null>(null);
    const [project, setProject] = useState<Project | null>(null);
    const [projectError, setProjectError] = useState<string | null>(null);
    const [tasksError, setTasksError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [tasksLoading, setTasksLoading] = useState<boolean>(false);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<TaskStatus | "ALL">("ALL");
    const [priority, setPriority] = useState<TaskPriority | "ALL">("ALL");
    const [assignee, setAssignee] = useState<string | "ALL" | "UNASSIGNED">("ALL");

    const normalizedSearch = search.trim().toLowerCase();
    const filteredTasks = tasks.filter((task) =>
        (task.status === status || status === "ALL")
        && (task.title.toLowerCase().includes(normalizedSearch)
            || task.key.toLowerCase().includes(normalizedSearch))
        && (priority === "ALL" || task.priority === priority)
        && (assignee === "ALL" || task.assignee === null || task.assignee.id === assignee)
    );

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

    useEffect(() => {
        async function loadUsers() {
            try {
                if (accessToken === null || typeof projectId !== "string") {
                    return;
                }
                const data = await getUsers(accessToken, projectId);
                setUsers(data);
                console.log(data);
            } catch (e) {
                if (e instanceof ApiError) {
                    setUsersError("Failed to get users")
                }
            }
        }
        loadUsers();
    }, [accessToken]);

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
                        <Input.Search
                            placeholder="Search tasks..."
                            searchIcon={<SearchOutlined />}
                            onChange={(e) => setSearch(e.target.value)}
                        ></Input.Search>
                        <Select
                            value={status}
                            onChange={(value) => setStatus(value)}
                            options={[
                                { value: "ALL", label: "All" },
                                { value: "TODO", label: "Todo" },
                                { value: "IN_PROGRESS", label: "In Progress" },
                                { value: "DONE", label: "Done" },
                            ]} />
                        <Select
                            value={priority}
                            onChange={(value) => setPriority(value)}
                            options={[
                                { value: "ALL", label: "All" },
                                { value: "LOW", label: "Low"},
                                { value: "MEDIUM", label: "Medium" },
                                { value: "HIGH", label: "High" },
                                { value: "CRITICAL", label: "Critical" },
                            ]} />
                        <Select
                            value={assignee}
                            onChange={(value) => setAssignee(value)}
                            options={[
                                { value: "ALL", label: "All" },
                                { value: "UNASSIGNED", label: "Unassigned" },
                                ...users.map((user) => ({
                                    value: user.id,
                                    label: user.name,
                                }))
                            ]} />
                        {usersError && <Alert title={usersError} type="error" />}
                    </div>
                    <div>
                        {tasksLoading ? <Spin /> : null}
                        {tasksError !== null && (
                            <Alert type="error" title={tasksError} />
                        )}
                        <div>
                            <h2>TODO</h2>
                            {filteredTasks
                                .filter((task) => task.status === "TODO")
                                .map((task) => (
                                    <TaskCard key={task.id} task={task} />
                                ))}
                        </div>
                        <div>
                            <h2>IN PROGRESS</h2>
                            {filteredTasks
                                .filter((task) => task.status === "IN_PROGRESS")
                                .map((task) => (
                                    <TaskCard key={task.id} task={task} />
                                ))}
                        </div>
                        <div>
                            <h2>DONE</h2>
                            {filteredTasks
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