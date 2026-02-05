import { useEffect, useState } from 'react';

function App() {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        // Fetching data from the .NET backend
        fetch('http://localhost:5160/api/tasks')
            .then(res => res.json())
            .then(data => setTasks(data))
            .catch(err => console.error("Backend not running?", err));
    }, []);

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h1>My Tasks</h1>
            <ul>
                {tasks.map(task => (
                    <li key={task.id}>
                        {task.title} {task.isCompleted ? '✅' : '⏳'}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;