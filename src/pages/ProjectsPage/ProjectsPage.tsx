import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import type {Project, CreateProjectInput} from "../../types/project.ts"
import {useAuth} from "../../context/useAuth.ts";
import {createProject, getProjects} from "../../api/projects.ts";
import ProjectCard from "../../components/ProjectCard/ProjectCard.tsx";
import {Alert, Button, Form, Input, Modal} from "antd";
import styles from './ProjectsPage.module.css';
import {ApiError} from "../../errors/ApiError.ts";

function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isModalOpened, setIsModalOpened] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [projectsError, setProjectsError] = useState<string | null>(null);
    const [form] = Form.useForm<CreateProjectInput>();
    const { accessToken, user } = useAuth();

    useEffect(() => {
        async function getAllProjects() {
            try {
                if (accessToken === null) {
                    return;
                }
                setProjectsError(null);
                const data = await getProjects(accessToken);
                setProjects(data);
            } catch (error) {
                if (error instanceof ApiError) {
                    setProjectsError('Failed to get projects');
                }
            }
        }
        getAllProjects();
    }, [accessToken]);

    return (
        <div>
            <h1>Projects</h1>
            <Input.Search></Input.Search>
            {
                user !== null && user.role === "ADMIN"
                ?
                <Button onClick={() => {
                    setError(null);
                    setIsModalOpened(true)}
                }>Create project</Button>
                : null
            }
            {projectsError !== null && (
                <Alert type="error" title={projectsError}></Alert>
            )}
            <Modal open={isModalOpened} onCancel={() => {
                setError(null);
                form.resetFields();
                setIsModalOpened(false)}
            }>
                <Form<CreateProjectInput>
                    form={form}
                    name="createProject"
                    onFinish={async (values) => {
                        if (accessToken !== null) {
                            try {
                                setError(null);
                                const createdProject = await createProject(accessToken, values)
                                setProjects((prev) => [
                                    ...prev,
                                    createdProject]);
                                form.resetFields();
                                setIsModalOpened(false)
                            } catch (error) {
                                if (error instanceof ApiError) {
                                    setError('Failed to create project');
                                }
                            }
                        }
                    }}>
                    <Form.Item label="Project name" rules={[{required: true}]} name="name">
                        <Input placeholder="Enter project name"></Input>
                    </Form.Item>
                    <Form.Item label="Description" name="description">
                        <Input.TextArea  placeholder="Enter description"></Input.TextArea>
                    </Form.Item>
                    {error !== null && (
                        <Alert type='error' title={error}></Alert>
                        )}
                    <Form.Item>
                        <Button type="primary" htmlType="submit">Submit</Button>
                        <Button type="dashed"
                                onClick={() => {
                                    setError(null);
                                    form.resetFields();
                                    setIsModalOpened(false)}}
                        >Cancel</Button>
                    </Form.Item>
                </Form>
            </Modal>
            <div className={styles.projectsList}>
                {
                    projects.map(project => (
                        <Link key={project.id} to={`/projects/${project.id}`}>
                            <ProjectCard project={project} />
                        </Link>
                    ))
                }
            </div>
        </div>
    )
}

export default ProjectsPage;