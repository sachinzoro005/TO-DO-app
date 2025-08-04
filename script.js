let tasks = [];
let taskIdCounter = 1;

document.addEventListener('DOMContentLoaded', function () {
    const savedTasks = localStorage.getItem('todo-tasks');
    if (savedTasks) {
        try {
            tasks = JSON.parse(savedTasks);
            taskIdCounter = Math.max(...tasks.map(t => t.id), 0) + 1;
        } catch (error) {
            console.error('Error loading tasks:', error);
        }
    }
    renderTasks();

    document.getElementById('taskInput').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });
});

function saveTasks() {
    localStorage.setItem('todo-tasks', JSON.stringify(tasks));
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function addTask() {
    const input = document.getElementById('taskInput');
    const taskText = input.value.trim();

    if (taskText === '') {
        showToast('Please enter a task before adding.', 'error');
        return;
    }

    const newTask = {
        id: taskIdCounter++,
        text: taskText,
        completed: false,
        createdAt: new Date().toISOString()
    };

    tasks.unshift(newTask);
    input.value = '';
    saveTasks();
    renderTasks();
    showToast('Task added successfully!');
}

function removeTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
    showToast('Task removed.');
}

function toggleTask(id) {
    tasks = tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
    );
    saveTasks();
    renderTasks();
}

function clearAllTasks() {
    if (tasks.length === 0) {
        showToast('There are no tasks to clear.', 'error');
        return;
    }

    const taskCount = tasks.length;
    tasks = [];
    saveTasks();
    renderTasks();
    showToast(`Removed ${taskCount} task${taskCount !== 1 ? 's' : ''}.`);
}

function renderTasks() {
    const container = document.getElementById('tasksContainer');
    const emptyState = document.getElementById('emptyState');
    const taskCounter = document.getElementById('taskCounter');
    const clearBtn = document.getElementById('clearBtn');

    taskCounter.textContent = `${tasks.length} task${tasks.length !== 1 ? 's' : ''} total`;
    clearBtn.style.display = tasks.length > 0 ? 'block' : 'none';

    if (tasks.length === 0) {
        container.innerHTML = `
            <div class="empty-state" id="emptyState">
                <div class="emoji">📝</div>
                <p>No tasks yet. Add one above to get started!</p>
            </div>`;
        return;
    }

    container.innerHTML = tasks.map(task => `
        <div class="task-item ${task.completed ? 'completed' : ''}">
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} 
                   onchange="toggleTask(${task.id})">
            <span class="task-text ${task.completed ? 'completed' : ''}">${task.text}</span>
            <button class="remove-btn" onclick="removeTask(${task.id})">Remove</button>
        </div>
    `).join('');
}
