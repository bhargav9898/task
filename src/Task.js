import React, { useState, useEffect } from 'react';
import './index.css';

const TaskManager = () => {
    const [tasks, setTasks] = useState([]);
    const [taskInput, setTaskInput] = useState("");
    const [searchQuery, setSearchQuery] = useState("");


    useEffect(() => {
        const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];

        savedTasks.sort((a, b) => {
            const priorityOrder = { "High": 1, "Low": 2, "None": 3 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        });
        setTasks(savedTasks);
    }, []);


    useEffect(() => {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }, [tasks]);


    const addTask = () => {
        if (taskInput.trim() === "") return;
        const newTask = { id: Date.now(), title: taskInput, status: "Incomplete", priority: "None" };
        const updatedTasks = [...tasks, newTask];

        updatedTasks.sort((a, b) => {
            const priorityOrder = { "High": 1, "Low": 2, "None": 3 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        });
        setTasks(updatedTasks);
        setTaskInput("");
    };


    const deleteTask = (id) => {
        const updatedTasks = tasks.filter(task => task.id !== id);

        updatedTasks.sort((a, b) => {
            const priorityOrder = { "High": 1, "Low": 2, "None": 3 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        });
        setTasks(updatedTasks);
    };


    const toggleTaskCheck = (id) => {
        const updatedTasks = tasks.map(task =>
            task.id === id ? { ...task, status: task.status === "Complete" ? "Incomplete" : "Complete" } : task
        );
        setTasks(updatedTasks);
    };


    const updatePriority = (id, priority) => {
        const updatedTasks = tasks.map(task =>
            task.id === id ? { ...task, priority: priority } : task
        );

        updatedTasks.sort((a, b) => {
            const priorityOrder = { "High": 1, "Low": 2, "None": 3 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        });
        setTasks(updatedTasks);
    };


    const filteredTasks = tasks
        .filter(task => task.title.toLowerCase().includes(searchQuery.toLowerCase()))

    return (
        <div className="task-manager-container">

            <h1>Task Manager</h1>

            <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />

            <div className="task-input-container">
                <input
                    type="text"
                    value={taskInput}
                    onChange={(e) => setTaskInput(e.target.value)}
                    placeholder="Enter a task"
                />
                <button onClick={addTask} className="add-task-button">Add Task</button>
            </div>

            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                <table>
                    <thead>
                        <tr>
                            <th>Task</th>
                            <th>Select</th>
                            <th>Priority</th>
                            {!searchQuery && <th>Action</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTasks.length > 0 ? (
                            filteredTasks.map(task => (
                                <tr key={task.id}>
                                    <td>{task.title}</td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={task.status === "Complete"}
                                            onChange={() => toggleTaskCheck(task.id)}
                                        />
                                        {task.status === "Complete" && <span>Complete</span>}
                                        {task.status === "Incomplete" && <span>Incomplete</span>}
                                    </td>

                                    <td>
                                        <input
                                            type="radio"
                                            id={`high-${task.id}`}
                                            name={`priority-${task.id}`}
                                            value="High"
                                            checked={task.priority === "High"}
                                            onChange={() => updatePriority(task.id, "High")}
                                        />
                                        <label htmlFor={`high-${task.id}`}>High priority</label>
                                        <br /><br />
                                        <input
                                            type="radio"
                                            id={`low-${task.id}`}
                                            name={`priority-${task.id}`}
                                            value="Low"
                                            checked={task.priority === "Low"}
                                            onChange={() => updatePriority(task.id, "Low")}
                                        />
                                        <label htmlFor={`low-${task.id}`}>Low priority</label>
                                        <br /><br />
                                        <input
                                            type="radio"
                                            id={`none-${task.id}`}
                                            name={`priority-${task.id}`}
                                            value="None"
                                            checked={task.priority === "None"}
                                            onChange={() => updatePriority(task.id, "None")}
                                        />
                                        <label htmlFor={`none-${task.id}`}>None priority</label>
                                    </td>

                                    {!searchQuery && (
                                        <td>
                                            <button onClick={() => deleteTask(task.id)} className="delete-button">
                                                Delete
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={searchQuery ? 3 : 4} style={{ textAlign: 'center' }}>No tasks found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

        </div>

    );
};

export default TaskManager;