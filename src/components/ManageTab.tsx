import React, { useState } from 'react';
import { Plus, Trash2, Edit2, X, Check, Tag, Palette } from 'lucide-react';
import { Task, Category, TaskType } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface ManageTabProps {
  tasks: Task[];
  categories: Category[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'completed'>) => void;
  deleteTask: (id: string) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  addCategory: (name: string, color: string) => void;
  updateCategory: (id: string, name: string, color: string) => void;
  deleteCategory: (id: string) => boolean;
}

export default function ManageTab({ 
  tasks, 
  categories, 
  addTask, 
  deleteTask, 
  updateTask,
  addCategory,
  updateCategory,
  deleteCategory 
}: ManageTabProps) {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [isManagingCategories, setIsManagingCategories] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const [taskFormData, setTaskFormData] = useState({
    title: '',
    categoryId: categories[0]?.id || '',
    type: 'one-time' as TaskType,
    deadline: '',
    routineTime: '',
  });

  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    color: '#4285F4',
  });

  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskFormData.title || !taskFormData.categoryId) return;

    if (editingTaskId) {
      updateTask(editingTaskId, taskFormData);
      setEditingTaskId(null);
    } else {
      addTask(taskFormData);
    }

    setTaskFormData({
      title: '',
      categoryId: categories[0]?.id || '',
      type: 'one-time',
      deadline: '',
      routineTime: '',
    });
    setIsAddingTask(false);
  };

  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryFormData.name) return;

    if (editingCategoryId) {
      updateCategory(editingCategoryId, categoryFormData.name, categoryFormData.color);
      setEditingCategoryId(null);
    } else {
      addCategory(categoryFormData.name, categoryFormData.color);
    }

    setCategoryFormData({ name: '', color: '#4285F4' });
  };

  const startEditTask = (task: Task) => {
    setEditingTaskId(task.id);
    setTaskFormData({
      title: task.title,
      categoryId: task.categoryId,
      type: task.type,
      deadline: task.deadline || '',
      routineTime: task.routineTime || '',
    });
    setIsAddingTask(true);
  };

  const cancelTaskEdit = () => {
    setEditingTaskId(null);
    setIsAddingTask(false);
    setTaskFormData({
      title: '',
      categoryId: categories[0]?.id || '',
      type: 'one-time',
      deadline: '',
      routineTime: '',
    });
  };

  const startEditCategory = (cat: Category) => {
    setEditingCategoryId(cat.id);
    setCategoryFormData({ name: cat.name, color: cat.color });
  };

  const handleDeleteCategory = (id: string) => {
    const success = deleteCategory(id);
    if (!success) {
      setDeleteError("Cannot delete category with active tasks.");
      setTimeout(() => setDeleteError(null), 3000);
    }
  };

  const getCategory = (id: string) => categories.find(c => c.id === id);

  return (
    <div className="pb-[calc(env(safe-area-inset-bottom)+100px)] pt-6 px-6 max-w-lg mx-auto">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-earth-ink mb-2">Manage</h1>
          <p className="text-earth-muted italic">Organize your tasks.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsManagingCategories(!isManagingCategories)}
            className={`p-4 rounded-2xl shadow-lg transition-all ${
              isManagingCategories ? 'bg-earth-ink text-white' : 'bg-white text-earth-ink border border-earth-green/10'
            }`}
          >
            <Tag size={24} />
          </button>
          {!isAddingTask && !isManagingCategories && (
            <button
              onClick={() => setIsAddingTask(true)}
              className="bg-earth-green text-white p-4 rounded-2xl shadow-lg hover:scale-105 transition-transform"
            >
              <Plus size={24} />
            </button>
          )}
        </div>
      </header>

      {/* Category Management Section */}
      <AnimatePresence>
        {isManagingCategories && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-8"
          >
            <div className="bg-white p-6 rounded-3xl shadow-xl border border-earth-green/10 space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-earth-ink">
                  {editingCategoryId ? 'Edit Category' : 'Add Category'}
                </h2>
                {editingCategoryId && (
                  <button onClick={() => setEditingCategoryId(null)} className="text-earth-muted">
                    <X size={20} />
                  </button>
                )}
              </div>

              <form onSubmit={handleCategorySubmit} className="space-y-4">
                <div className="flex gap-2">
                  <div className="flex-grow">
                    <input
                      type="text"
                      value={categoryFormData.name}
                      onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                      placeholder="Category Name"
                      className="w-full bg-earth-bg/50 border border-earth-green/10 rounded-xl px-4 py-3 focus:outline-none"
                      required
                    />
                  </div>
                  <div className="relative group">
                    <input
                      type="color"
                      value={categoryFormData.color}
                      onChange={(e) => setCategoryFormData({ ...categoryFormData, color: e.target.value })}
                      className="w-12 h-12 rounded-xl cursor-pointer border-none bg-transparent"
                    />
                    <Palette size={16} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-white mix-blend-difference" />
                  </div>
                  <button
                    type="submit"
                    className="bg-earth-green text-white p-3 rounded-xl shadow-md"
                  >
                    {editingCategoryId ? <Check size={24} /> : <Plus size={24} />}
                  </button>
                </div>
              </form>

              {deleteError && (
                <p className="text-xs text-red-500 font-medium animate-pulse">{deleteError}</p>
              )}

              <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {categories.map((cat) => (
                  <div key={cat.id} className="flex items-center justify-between p-3 bg-earth-bg/30 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: cat.color }} />
                      <span className="font-medium text-earth-ink">{cat.name}</span>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => startEditCategory(cat)} className="p-2 text-earth-muted hover:text-earth-green">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDeleteCategory(cat.id)} className="p-2 text-earth-muted hover:text-red-500">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAddingTask && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-white p-6 rounded-3xl shadow-xl border border-earth-green/10 mb-8"
          >
            <form onSubmit={handleTaskSubmit} className="space-y-6">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-bold text-earth-ink">
                  {editingTaskId ? 'Edit Task' : 'New Task'}
                </h2>
                <button type="button" onClick={cancelTaskEdit} className="text-earth-muted">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-earth-muted mb-2 block">
                    Title
                  </label>
                  <input
                    type="text"
                    value={taskFormData.title}
                    onChange={(e) => setTaskFormData({ ...taskFormData, title: e.target.value })}
                    placeholder="e.g., Morning Meditation"
                    className="w-full bg-earth-bg/50 border border-earth-green/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-earth-green/20"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-earth-muted mb-2 block">
                      Category
                    </label>
                    <select
                      value={taskFormData.categoryId}
                      onChange={(e) => setTaskFormData({ ...taskFormData, categoryId: e.target.value })}
                      className="w-full bg-earth-bg/50 border border-earth-green/10 rounded-xl px-4 py-3 focus:outline-none"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-earth-muted mb-2 block">
                      Type
                    </label>
                    <select
                      value={taskFormData.type}
                      onChange={(e) => setTaskFormData({ ...taskFormData, type: e.target.value as TaskType })}
                      className="w-full bg-earth-bg/50 border border-earth-green/10 rounded-xl px-4 py-3 focus:outline-none"
                    >
                      <option value="one-time">One-Time</option>
                      <option value="daily">Daily Ritual</option>
                    </select>
                  </div>
                </div>

                {taskFormData.type === 'one-time' ? (
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-earth-muted mb-2 block">
                      Deadline (Optional)
                    </label>
                    <input
                      type="date"
                      value={taskFormData.deadline}
                      onChange={(e) => setTaskFormData({ ...taskFormData, deadline: e.target.value })}
                      className="w-full bg-earth-bg/50 border border-earth-green/10 rounded-xl px-4 py-3 focus:outline-none"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-earth-muted mb-2 block">
                      Time (Optional)
                    </label>
                    <input
                      type="time"
                      value={taskFormData.routineTime}
                      onChange={(e) => setTaskFormData({ ...taskFormData, routineTime: e.target.value })}
                      className="w-full bg-earth-bg/50 border border-earth-green/10 rounded-xl px-4 py-3 focus:outline-none"
                    />
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-earth-green text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <Check size={20} />
                {editingTaskId ? 'Save Changes' : 'Create Task'}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-earth-muted mb-4">
          Existing Tasks
        </h2>
        {tasks.map((task) => {
          const cat = getCategory(task.categoryId);
          return (
            <div
              key={task.id}
              className="bg-white border border-earth-green/10 p-4 rounded-2xl flex items-center justify-between shadow-sm"
            >
              <div className="min-w-0 flex-grow">
                <h3 className="font-semibold text-earth-ink truncate">{task.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span 
                    className="text-[10px] font-bold uppercase tracking-widest"
                    style={{ color: cat?.color || '#757575' }}
                  >
                    {cat?.name || 'Unknown'}
                  </span>
                  <span className="text-[10px] font-medium text-earth-muted/40">
                    • {task.type === 'daily' ? 'Daily' : 'One-Time'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => startEditTask(task)}
                  className="p-2 text-earth-muted hover:text-earth-green transition-colors"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="p-2 text-earth-muted hover:text-red-500 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          );
        })}
        {tasks.length === 0 && !isAddingTask && (
          <p className="text-sm text-earth-muted/40 italic text-center py-12">
            No tasks yet. Tap the + to begin.
          </p>
        )}
      </div>
    </div>
  );
}
