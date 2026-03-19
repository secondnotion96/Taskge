/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Task, Tab, Category } from './types';
import BottomNav from './components/BottomNav';
import HomeTab from './components/HomeTab';
import RoutineTab from './components/RoutineTab';
import ManageTab from './components/ManageTab';
import { motion, AnimatePresence } from 'motion/react';
import { Leaf } from 'lucide-react';

const TASKS_KEY = 'mindful_tasks_v3';
const CATEGORIES_KEY = 'mindful_categories_v3';
const RESET_KEY = 'mindful_last_reset';

const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Work', color: '#4285F4' },
  { id: 'cat-2', name: 'Personal', color: '#EA4335' },
  { id: 'cat-3', name: 'Health', color: '#34A853' },
  { id: 'cat-4', name: 'Ritual', color: '#FBBC05' },
  { id: 'cat-5', name: 'Other', color: '#757575' },
];

const INITIAL_TASKS: Task[] = [
  {
    id: '1',
    title: 'Morning Meditation',
    categoryId: 'cat-4',
    type: 'daily',
    completed: false,
    routineTime: '07:00',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Deep Work Session',
    categoryId: 'cat-1',
    type: 'one-time',
    completed: false,
    deadline: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Evening Reflection',
    categoryId: 'cat-4',
    type: 'daily',
    completed: false,
    routineTime: '21:30',
    createdAt: new Date().toISOString(),
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem(CATEGORIES_KEY);
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem(TASKS_KEY);
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  // Daily Reset Logic
  useEffect(() => {
    const checkReset = () => {
      const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD
      const lastReset = localStorage.getItem(RESET_KEY);

      if (lastReset !== today) {
        setTasks((prev) => 
          prev.map((task) => 
            task.type === 'daily' ? { ...task, completed: false } : task
          )
        );
        localStorage.setItem(RESET_KEY, today);
      }
    };

    checkReset();
    const interval = setInterval(checkReset, 60000);
    return () => clearInterval(interval);
  }, []);

  // Persistence
  useEffect(() => {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  }, [categories]);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'completed'>) => {
    const newTask: Task = {
      ...taskData,
      id: Math.random().toString(36).substring(2, 9),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  };

  const addCategory = (name: string, color: string) => {
    const newCategory: Category = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      color,
    };
    setCategories((prev) => [...prev, newCategory]);
  };

  const updateCategory = (id: string, name: string, color: string) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, name, color } : cat))
    );
  };

  const deleteCategory = (id: string) => {
    const hasTasks = tasks.some((t) => t.categoryId === id);
    if (hasTasks) return false;
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
    return true;
  };

  return (
    <div className="min-h-screen bg-earth-bg text-earth-ink pb-20">
      <header className="px-6 pt-10 max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-earth-green p-2.5 rounded-2xl shadow-sm">
            <Leaf className="text-white" size={24} />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-earth-ink">Taskge</h1>
        </div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-earth-muted/60 ml-1">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </header>

      <main className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'home' && (
              <HomeTab tasks={tasks} categories={categories} toggleTask={toggleTask} />
            )}
            {activeTab === 'routine' && (
              <RoutineTab tasks={tasks} categories={categories} toggleTask={toggleTask} />
            )}
            {activeTab === 'manage' && (
              <ManageTab
                tasks={tasks}
                categories={categories}
                addTask={addTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
                addCategory={addCategory}
                updateCategory={updateCategory}
                deleteCategory={deleteCategory}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}



