import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, CheckCircle2, Circle, LayoutGrid, Activity } from 'lucide-react';
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

  const playSound = (freq = 400, type = 'square') => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) { console.error("Audio block", e); }
  };

  const addTask = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    setTasks([{ id: Date.now(), text: inputValue, completed: false }, ...tasks]);
    setInputValue('');
    playSound(600, 'sine');
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    playSound(400, 'square'); 
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
    playSound(200, 'sawtooth'); 
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const progress = tasks.length > 0 
    ? (tasks.filter(t => t.completed).length / tasks.length) * 100 
    : 0;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setInputValue('');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="app-wrapper">
      <div className="glow-orb"></div>
      <div className="scanlines"></div>
      
      <div className="app-container">
        <header className="glass-header">
          <div className="header-top">
            <div className="logo-section">
              <Activity size={20} className="accent-icon pulse" />
              <h1>TASK<span>MASTER</span> <small>v2.0</small></h1>
            </div>
            <div className="engine-status">
              <span className="status-label">ENGINE STATUS</span>
              <div className="status-value">{Math.round(progress)}%</div>
            </div>
          </div>

          <div className="progress-container">
            <motion.div 
              className="progress-bar" 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ type: "spring", stiffness: 50 }}
            />
          </div>
          
          <form onSubmit={addTask} className="input-box">
            <input 
              type="text" 
              placeholder="ENTRY_DATA_..." 
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
                {f === 'all' ? '[ALL]' : f === 'active' ? '[DRAFT]' : '[TUNED]'}
              </button>
            ))}
          </div>
        </header>

        <ul className="task-list">
          <AnimatePresence mode='popLayout'>
            {filteredTasks.map(task => (
              <motion.li 
                key={task.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                layout
                className={`task-card ${task.completed ? 'is-done' : ''}`}
              >
                <div className="task-info" onClick={() => toggleTask(task.id)}>
                  {task.completed ? 
                    <CheckCircle2 size={18} className="check-done" /> : 
                    <Circle size={18} className="check-empty" />
                  }
                  <span>{task.text}</span>
                </div>
                <button className="delete-icon" onClick={(e) => {
                  e.stopPropagation();
                  deleteTask(task.id);
                }}>
                  <Trash2 size={16} />
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