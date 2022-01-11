import React, { useState, useContext, useEffect } from 'react'
import { useAuth } from "./AuthContext";
import {
    allProjectsRequest,
    newProjectRequest,
    selectProjectRequest,
    updateProjectTitleRequest,
    deleteProjectRequest,
    inviteMemberRequest,
} from '../api/project';

import {
    getTasksRequest,
    newTaskRequest,
    updateTaskRequest,
    deleteTaskRequest,
} from '../api/task';

import {
    newStageRequest,
    renameStage,
    deleteStageRequest,
    deleteStageTasksRequest,
    moveStageTasksRequest,
    renameStageRequest,
} from '../api/stage';

import {
    getMembersRequest,
} from '../api/user';

// import {
//     pollRequest,
// } from '../api/polling';

const ProjectContext = React.createContext();

export const useProject = () => {
    return useContext(ProjectContext);
};

/**
 * Remember, the goal is:
 *
 * FAT PROVIDERS
 *
 * SLIM COMPONENTS
 *
 */
const ProjectProvider = ({ children }) => {
    const [project, setProject] = useState(undefined);
    const [tasks, setTasks] = useState([]);


    // PROJECTS
    // useEffect(() => {
    //     if(!project || tasks.length === 0) return;
    //     (async () => {
    //         while(true) {
    //             const response = await pollRequest();
    //             if (response.ok) {
    //                 console.log('got okay response');
    //                 const json = await response.json();
    //                 if (json.type === 'project') {
    //                     setProject(json.payload);
    //                 }
    //                 if (json.type === 'task') {
    //                     if (json.action === 'delete') {
    //                         console.log('deleting task');
    //                         setTasks(tasks.filter(task => task._id !== json.id))
    //                     }
    //                     if (json.action === 'update') {
    //                         console.log('updating tasks')
    //                         console.log(json.payload._id);
    //                         console.log(tasks);
    //                         setTasks(tasks.map(task => {
    //                             if (task._id === json.payload._id) {
    //                                 console.log('update the task!');
    //                                 return json.payload;
    //                             } else {
    //                                 console.log(task);
    //                                 return task;
    //                             }
    //                         }));
    //                     }
    //                     if (json.action === 'new') {
    //                         setTasks(...tasks, json.payload);
    //                     }
    //                 }
    //             }
    //         }
    //     })()
    // }, [project, tasks]);
    
    const clearProject = () => {
        setProject(undefined);
        setTasks([]);
    };

    const newProject = async (title) => {
        const response = await newProjectRequest(title);
        if(response.ok) {
            const json = await response.json();
            setProject(json);
            return json;
        } else {
            return "ERROR";
        }
    };

    const deleteProject = async () => {
        const response = await deleteProjectRequest();
        if (response.ok) {
            const json = await response.json();
            clearProject();
            return 'SUCCESS';
        } else {
            return 'ERROR';
        }
    };

    const updateProjectTitle = async (title) => {
        const response = await updateProjectTitleRequest(title);
        if (response.ok) {
            const json = await response.json();
            setProject(json);
            return json;
        } else {
            return "ERROR";
        }
    };

    const getProjects = async () => {
        const response = await allProjectsRequest();

        if (response.ok) {
            const json = await response.json();
            return json;
        }
        if(response.status === 401) {
            return 'UNAUTHORIZED';
        }
        if (response.status === 500) {
            return 'SERVER_ERROR';
        }
    };

    const selectProject = async (projectId) => {
        const projectResponse = await selectProjectRequest(projectId);

        if (projectResponse.ok) {
            let json = await projectResponse.json();
            setProject(json);
            const tasksResponse = await getTasksRequest();
            if (tasksResponse.ok) {
                json = await tasksResponse.json();
                setTasks(json);
                return 'SUCCESS';
            } else {
                return 'ERROR';
            }
        } else {
            return 'ERROR';
        }
    };

    const inviteMember = async (email) => {
        const inviteResponse = await inviteMemberRequest(email);
        if (inviteResponse.ok) {
            const json = await inviteResponse.json();
            return json;
        } else {
            return 'ERROR';
        }
    };

// STAGES
    const newStage = async (title) => {
        const response = await newStageRequest(title);
        if (response.ok) {
            const json = await response.json();
            setProject(json);
            return json;
        } else {
            return "ERROR";
        }
    };

    const renameStage = async (stageIndex, title) => {
        const response = await renameStageRequest(stageIndex, title);
        if (response.ok) {
            const json = await response.json();
            const update = { ...project};
            update.stages = update.stages.map((stage, i) => 
            {
                if (i === stageIndex) {
                    return title;
                } else {
                    return stage;
                }
            });
            setProject(update)
            return json;
        } else {
            return "ERROR";
        }
    };

    const deleteStage = async (stageIndex) => {
        const response = await deleteStageRequest(stageIndex);
        if (response.ok) {
            const json = await response.json();
            setTasks(tasks
                .filter(task => task.stageIndex !== stageIndex)
                .map(task => {
                    if(task.stageIndex > stageIndex) {
                        task.stageIndex -= 1;
                    }
                    return task;
                }));
            const update = {...project};
            update.stages = update.stages.filter((_, i) => i !== stageIndex);
            setProject(update);
            return json;
        } else {
            return "ERROR";
        }
    };

    const deleteStageTasks = async (stageIndex) => {
        const response = await deleteStageTasksRequest(stageIndex);
        if (response.ok) {
            const json = await response.json();
            setTasks(tasks.filter(task => task.stageIndex !== stageIndex));
            return json;
        } else {
            return "ERROR";
        }
    };

    const moveStageTasks = async (stageIndex, direction) => {
        const response = await moveStageTasksRequest(stageIndex, direction);
        if (response.ok) {
            const json = await response.json();
            setTasks(tasks.map(task => {
                if (task.stageIndex === stageIndex && direction === 'forward') {
                    task.stageIndex += 1;
                }
                if (task.stageIndex === stageIndex && direction === 'back') {
                    task.stageIndex -= 1;
                }
                return task}));
            return json;
        } else {
            return "ERROR";
        }
    };


    const newTask = async (title, stageIndex) => {
        const response = await newTaskRequest(title, stageIndex);
        if(response.ok) {
            const json = await response.json();
            console.log([...tasks, json])
            setTasks([...tasks, json]);
            return json;
        } else {
            return 'ERROR'
        }
    };


    const updateTask = async (taskId, update) => {
        const response = await updateTaskRequest(taskId, update);
        if (response.ok) {
            const json = await response.json();
            setTasks(tasks.map(task => {
                if(task._id === taskId) {
                    return json;
                } else {
                    return task;
                }
            }));
            return json;
        } else {
            return 'ERROR'
        }
    };

    const getMembers = async (memberIds) => {
        const response = await getMembersRequest(memberIds);
        if (response.ok) {
            const json = await response.json();
            return json;
        } else {
            return 'ERROR'
        }
    };
//     const moveStageLeft = async (stageIndex) => {
//         if (!currentProject || stageIndex === 0) return;
//         const projectRef = await doc(db, "projects", currentProject.id);
//         const update = Object.assign({}, currentProject);
//         update.stages.splice(stageIndex - 1, 0, update.stages[stageIndex]);
//         update.stages.splice(stageIndex+1, 1);
//         setCurrentProject(update);
//         return updateDoc(projectRef, {
//             stages: update.stages
//         });
//     }

//     const moveStageRight = async (stageIndex) => {
//         if (!currentProject || stageIndex >= currentProject.stages.length - 1) return;
//         const projectRef = await doc(db, "projects", currentProject.id);
//         const update = Object.assign({}, currentProject);
//         update.stages.splice(stageIndex + 2, 0, update.stages[stageIndex]);
//         update.stages.splice(stageIndex, 1);
//         setCurrentProject(update);
//         return updateDoc(projectRef, {
//             stages: update.stages
//         });
//     }


//     const setStageTitle = async (title, stageIndex) => {
//         if (!currentProject) return;
//         const projectRef = await doc(db, "projects", currentProject.id);
//         const update = Object.assign({}, currentProject);
//         update.stages[stageIndex] = title;
//         setCurrentProject(update);
//         await updateDoc(projectRef, {
//             stages: update.stages
//         });
//         setRefresh(!refresh);
//     }

// //################################################TASKS
// //################################################
//     const newTask = async (title, stage) => {
//         if (!currentProject) return;
//         return addDoc(collection(db, "tasks"), { points: 0, assigned: [], description: "", title, stage, pid: currentProject.id});
//     }

//     const getTasks = (stageIndex) => {
//         if (!currentProject) return;
//         const q = query(collection(db, "tasks"), where("pid", "==", currentProject.id), where("stage", "==", stageIndex));
//         return getDocs(q);
//     }

//     const moveTaskLeft = async (data) => {
//         if (!currentProject || data.stage === 0) return;
//         const taskRef = await doc(db, "tasks", data.id);
//         data.stage = data.stage - 1;
//         await updateDoc(taskRef, {
//             stage: data.stage
//         });
//         setRefresh(!refresh);
//     }

//     const moveTaskRight = async (data) => {
//         if (!currentProject || data.stage === currentProject.stages.length - 1) return;
//         const taskRef = await doc(db, "tasks", data.id);
//         data.stage = data.stage + 1;
//         await updateDoc(taskRef, {
//             stage: data.stage
//         });
//         setRefresh(!refresh);
//     }

    const deleteTask = async (taskId) => {
        const response = await deleteTaskRequest(taskId);
        if (response.ok) {
            setTasks(tasks.filter(task => task._id !== taskId));
            return 'SUCCESS';
        } else {
            return 'ERROR'
        }
    }


//     const updateTaskDescription = async (data) => {
//         if (!currentProject) return;
//         const taskRef = await doc(db, "tasks", data.id);
//         await updateDoc(taskRef, {
//             description: data.description
//         });
//     }

//     const updateTaskPoints = async (data, points) => {
//         if (!currentProject) return;
//         data.points = points;
//         const taskRef = await doc(db, "tasks", data.id);
//         await updateDoc(taskRef, {
//             points
//         });
//     }

//     const deleteAllTasks = async (stageIndex) => {
//         if (!currentProject) return;
//         const q = query(collection(db, "tasks"), where("pid", "==", currentProject.id), where("stage", "==", stageIndex));
//         getDocs(q).then(async (querySnapshot) => {
//             querySnapshot.forEach(async docRef => {
//                 await deleteDoc(doc(db, 'tasks', docRef.id));
//             })
//             await timeout(500);
//             setRefresh(!refresh);
//         })
//     }

//     const moveAllTasksRight = async (stageIndex) => {
//         if (!currentProject || currentProject.stages.length - 1 === stageIndex) return;
//         const q = query(collection(db, "tasks"), where("pid", "==", currentProject.id), where("stage", "==", stageIndex));
//         getDocs(q).then(async (querySnapshot) => {
//             querySnapshot.forEach(async docRef => {
//                 await updateDoc(doc(db, 'tasks', docRef.id), { stage: stageIndex + 1});
//             });
//             await timeout(500);
//             setRefresh(!refresh);
//         })
//     }

//     const moveAllTasksLeft = async (stageIndex) => {
//       if (!currentProject || 0 === stageIndex) return;
//       const q = query(collection(db, "tasks"), where("pid", "==", currentProject.id), where("stage", "==", stageIndex));
//       getDocs(q).then(async (querySnapshot) => {
//         querySnapshot.forEach(async docRef => {
//             await updateDoc(doc(db, 'tasks', docRef.id), { stage: stageIndex - 1 });
//         });
//         await timeout(500);
//         setRefresh(!refresh);
//       })
//     }

    // const editTaskTitle = (name) => {
    //     return addDoc(collection(db, "projects"), { name });
    // }

    // const assignTask = (name) => {
    //     return addDoc(collection(db, "projects"), { name });
    // }

    const value = {
        getProjects,
        newProject,
        updateProjectTitle,
        deleteProject,
        project,
        tasks,
        clearProject,
        selectProject,
        newStage,
        renameStage,
        moveStageTasks,
        deleteStage,
        deleteStageTasks,
        newTask,
        updateTask,
        deleteTask,
        getMembers,
        inviteMember,
    }

    return (
        <ProjectContext.Provider value={value}>
            {children}
        </ProjectContext.Provider>
    )
}

export default ProjectProvider;