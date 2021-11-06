import React, { useState, useContext, useEffect } from 'react'
import { collection, addDoc, query, where, getDocs, doc, updateDoc, deleteDoc} from "firebase/firestore";
import { useAuth } from "./AuthContext";
import { db } from "../firebase";

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const ProjectContext = React.createContext();

export const useProject = () => {
    return useContext(ProjectContext);
}

const ProjectProvider = ({ children }) => {
    const { currentUser } = useAuth();
    const [loadingProject, setLoadingProject] = useState(true);
    const [currentProject, setCurrentProject] = useState();
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
      if(currentUser){
        setLoadingProject(true);
        const q = query(collection(db, "projects"), where("members", "array-contains", currentUser.uid));
        getDocs(q).then((docs) => setCurrentProject(docs[0]));
      }
      setLoadingProject(false);
    },[]);

//################################################PROJECTS
//################################################
    const newProject = (title, createdAt) => {
        return addDoc(collection(db, "projects"), { members: [currentUser.uid], title, stages: [], createdAt});
    }

    const getProjects = () => {
        const q = query(collection(db, "projects"), where("members", "array-contains", currentUser.uid));
        return getDocs(q);
    }

    const setProject = (projectDoc) => {
        setCurrentProject(projectDoc);
    }

    const newStage = async (title) => {
        if (!currentProject) return;
        const projectRef = await doc(db, "projects", currentProject.id);
        const update = Object.assign({}, currentProject);
        update.stages.push(title)
        setCurrentProject(update)
        return updateDoc(projectRef, {
            stages: update.stages
        });
    }

    const deleteStage = async (stageIndex) => {
        if (!currentProject) return;
        const projectRef = doc(db, "projects", currentProject.id);
        const update = Object.assign({}, currentProject);
        update.stages.splice(stageIndex, 1);
        setCurrentProject(update);
        return updateDoc(projectRef, {
            stages: update.stages
        });
    }

    const moveStageLeft = async (stageIndex) => {
        if (!currentProject || stageIndex === 0) return;
        const projectRef = await doc(db, "projects", currentProject.id);
        const update = Object.assign({}, currentProject);
        update.stages.splice(stageIndex - 1, 0, update.stages[stageIndex]);
        update.stages.splice(stageIndex+1, 1);
        setCurrentProject(update);
        return updateDoc(projectRef, {
            stages: update.stages
        });
    }

    const moveStageRight = async (stageIndex) => {
        if (!currentProject || stageIndex >= currentProject.stages.length - 1) return;
        const projectRef = await doc(db, "projects", currentProject.id);
        const update = Object.assign({}, currentProject);
        update.stages.splice(stageIndex + 2, 0, update.stages[stageIndex]);
        update.stages.splice(stageIndex, 1);
        setCurrentProject(update);
        return updateDoc(projectRef, {
            stages: update.stages
        });
    }


    const setStageTitle = async (title, stageIndex) => {
        console.log(title);
        console.log(stageIndex);
        if (!currentProject) return;
        const projectRef = await doc(db, "projects", currentProject.id);
        const update = Object.assign({}, currentProject);
        update.stages[stageIndex] = title;
        setCurrentProject(update);
        await updateDoc(projectRef, {
            stages: update.stages
        });
        setRefresh(!refresh);
    }

//################################################TASKS
//################################################
    const newTask = async (title, stage) => {
        if (!currentProject) return;
        return addDoc(collection(db, "tasks"), { points: 0, assigned: [], description: "", title, stage, pid: currentProject.id});
    }

    const getTasks = (stageIndex) => {
        if (!currentProject) return;
        const q = query(collection(db, "tasks"), where("pid", "==", currentProject.id), where("stage", "==", stageIndex));
        return getDocs(q);
    }

    const moveTaskLeft = async (data) => {
        if (!currentProject || data.stage === 0) return;
        const taskRef = await doc(db, "tasks", data.id);
        data.stage = data.stage - 1;
        await updateDoc(taskRef, {
            stage: data.stage
        });
        setRefresh(!refresh);
    }

    const moveTaskRight = async (data) => {
        if (!currentProject || data.stage === currentProject.stages.length - 1) return;
        const taskRef = await doc(db, "tasks", data.id);
        data.stage = data.stage + 1;
        await updateDoc(taskRef, {
            stage: data.stage
        });
        setRefresh(!refresh);
    }

    const deleteTask = async (data) => {
        if (!currentProject) return;
        const taskRef = await doc(db, "tasks", data.id);
        await deleteDoc(taskRef);
        setRefresh(!refresh);
    }


    const updateTaskDescription = async (data) => {
        if (!currentProject) return;
        const taskRef = await doc(db, "tasks", data.id);
        await updateDoc(taskRef, {
            description: data.description
        });
    }

    const updateTaskPoints = async (data, points) => {
        if (!currentProject) return;
        data.points = points;
        const taskRef = await doc(db, "tasks", data.id);
        await updateDoc(taskRef, {
            points
        });
    }

    const deleteAllTasks = async (stageIndex) => {
        if (!currentProject) return;
        const q = query(collection(db, "tasks"), where("pid", "==", currentProject.id), where("stage", "==", stageIndex));
        getDocs(q).then(async (querySnapshot) => {
            querySnapshot.forEach(async docRef => {
                await deleteDoc(doc(db, 'tasks', docRef.id));
            })
            await timeout(500);
            setRefresh(!refresh);
        })
    }

    const moveAllTasksRight = async (stageIndex) => {
        if (!currentProject || currentProject.stages.length - 1 === stageIndex) return;
        const q = query(collection(db, "tasks"), where("pid", "==", currentProject.id), where("stage", "==", stageIndex));
        getDocs(q).then(async (querySnapshot) => {
            querySnapshot.forEach(async docRef => {
                await updateDoc(doc(db, 'tasks', docRef.id), { stage: stageIndex + 1});
            });
            await timeout(500);
            setRefresh(!refresh);
        })
    }

    const moveAllTasksLeft = async (stageIndex) => {
      if (!currentProject || 0 === stageIndex) return;
      const q = query(collection(db, "tasks"), where("pid", "==", currentProject.id), where("stage", "==", stageIndex));
      getDocs(q).then(async (querySnapshot) => {
        querySnapshot.forEach(async docRef => {
            await updateDoc(doc(db, 'tasks', docRef.id), { stage: stageIndex - 1 });
        });
        await timeout(500);
        setRefresh(!refresh);
      })
    }



    // const editTask = (name) => {
    //     return addDoc(collection(db, "projects"), { name });
    // }

    // const getMembers = (name) => {
    //     return addDoc(collection(db, "projects"), { name });
    // }

    // const addMember = (name) => {
    //     return addDoc(collection(db, "projects"), { name });
    // }

    // const removeMember = (name) => {
    //     return addDoc(collection(db, "projects"), { name });
    // }

    // const getSprints = (name) => {
    //     return addDoc(collection(db, "projects"), { name });
    // }

    // const addSprint = (name) => {
    //     return addDoc(collection(db, "projects"), { name });
    // }

    // const deleteSprint = (name) => {
    //     return addDoc(collection(db, "projects"), { name });
    // }

    const value = {
        currentProject,
        newProject,
        getProjects,
        setProject,
        loadingProject,
        newStage,
        newTask,
        setStageTitle,
        deleteStage,
        moveStageLeft,
        moveStageRight,
        moveAllTasksLeft,
        moveAllTasksRight,
        getTasks,
        moveTaskLeft,
        moveTaskRight,
        deleteTask,
        deleteAllTasks,
        updateTaskDescription,
        updateTaskPoints,
        refresh
    }

    return (
        <ProjectContext.Provider value={value}>
            {children}
        </ProjectContext.Provider>
    )
}

export default ProjectProvider;