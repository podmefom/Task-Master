import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, CheckCircle2, Circle, LayoutGrid } from 'lucide-react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    setTasks([{ id: Date.now(), text: inputValue, completed: false }, ...tasks]);
    setInputValue('');
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  return (
    <div className="app-wrapper">
      <div className="glow-orb"></div>
      
      <div className="app-container">
        <header className="glass-header">
          <div className="logo-section">
            <LayoutGrid size={24} className="accent-icon" />
            <h1>TASK<span>MASTER</span></h1>
          </div>
          
          <form onSubmit={addTask} className="input-box">
            <input 
              type="text" 
              placeholder="Что нужно сделать?" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button type="submit"><Plus size={20} /></button>
          </form>
          
          <div className="tabs">
            {['all', 'active', 'completed'].map(f => (
              <button 
                key={f}
                className={filter === f ? 'tab active' : 'tab'} 
                onClick={() => setFilter(f)}
              >
                {f === 'all' ? 'Все' : f === 'active' ? 'В работе' : 'Готово'}
              </button>
            ))}
          </div>
        </header>

        <ul className="task-list">
          <AnimatePresence mode='popLayout'>
            {filteredTasks.map(task => (
              <motion.li 
                key={task.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                layout
                className={`task-card ${task.completed ? 'is-done' : ''}`}
              >
                <div className="task-info" onClick={() => toggleTask(task.id)}>
                  {task.completed ? 
                    <CheckCircle2 size={20} className="check-done" /> : 
                    <Circle size={20} className="check-empty" />
                  }
                  <span>{task.text}</span>
                </div>
                <button className="delete-icon" onClick={() => deleteTask(task.id)}>
                  <Trash2 size={18} />
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>
    </div>
  );
}

export default App;