import React, { useState, useMemo } from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import { Task, Category } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface HomeTabProps {
  tasks: Task[];
  categories: Category[];
  toggleTask: (id: string) => void;
}

export default function HomeTab({ tasks, categories, toggleTask }: HomeTabProps) {
  const [activeCategoryId, setActiveCategoryId] = useState<string>('all');

  const filteredTasks = useMemo(() => {
    if (activeCategoryId === 'all') return tasks;
    return tasks.filter((t) => t.categoryId === activeCategoryId);
  }, [tasks, activeCategoryId]);

  const dailyRituals = filteredTasks.filter((t) => t.type === 'daily');
  const oneTimeIntentions = filteredTasks.filter((t) => t.type === 'one-time');

  const getCategory = (id: string) => categories.find(c => c.id === id);

  return (
    <div className="pb-24 pt-6 px-6 max-w-lg mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-earth-ink mb-1">Task List</h1>
        <p className="text-earth-muted italic text-sm">one task at a time</p>
      </header>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
        <button
          onClick={() => setActiveCategoryId('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
            activeCategoryId === 'all'
              ? 'bg-earth-green text-white shadow-md'
              : 'bg-white text-earth-muted border border-earth-green/10'
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategoryId(cat.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
              activeCategoryId === cat.id
                ? 'bg-earth-green text-white shadow-md'
                : 'bg-white text-earth-muted border border-earth-green/10'
            }`}
          >
            <span 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: cat.color }}
            />
            {cat.name}
          </button>
        ))}
      </div>

      <div className="space-y-8">
        {/* Daily Rituals */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-earth-muted">
              Daily Rituals
            </h2>
            <span className="text-[10px] text-earth-muted/60 bg-earth-green/5 px-2 py-0.5 rounded-full">
              {dailyRituals.length}
            </span>
          </div>
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {dailyRituals.map((task) => {
                const cat = getCategory(task.categoryId);
                return (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    onClick={() => toggleTask(task.id)}
                    className={`group flex items-center gap-4 p-4 rounded-2xl transition-all cursor-pointer ${
                      task.completed
                        ? 'bg-earth-green/5 border border-transparent opacity-60'
                        : 'bg-white border border-earth-green/10 shadow-sm hover:shadow-md'
                    }`}
                  >
                    <button className="flex-shrink-0">
                      {task.completed ? (
                        <CheckCircle2 className="text-earth-green" size={24} />
                      ) : (
                        <Circle className="text-earth-muted/30 group-hover:text-earth-green/50 transition-colors" size={24} />
                      )}
                    </button>
                    <div className="flex-grow min-w-0">
                      <h3 className={`font-medium truncate ${task.completed ? 'line-through text-earth-muted' : 'text-earth-ink'}`}>
                        {task.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span 
                          className="text-[10px] font-bold uppercase tracking-tighter"
                          style={{ color: cat?.color || '#757575' }}
                        >
                          {cat?.name || 'Unknown'}
                        </span>
                        {task.deadline && (
                          <span className="text-[10px] font-medium text-earth-muted/40">
                            • Due {new Date(task.deadline).toLocaleDateString()}
                          </span>
                        )}
                        {task.routineTime && (
                          <span className="text-[10px] font-medium text-earth-muted/40">
                            • {task.routineTime}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            {dailyRituals.length === 0 && (
              <p className="text-sm text-earth-muted/40 italic py-4 text-center border border-dashed border-earth-green/20 rounded-xl">
                No rituals for this category.
              </p>
            )}
          </div>
        </section>

        {/* One-Time Intentions */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-earth-muted">
              One-Time Intentions
            </h2>
            <span className="text-[10px] text-earth-muted/60 bg-earth-green/5 px-2 py-0.5 rounded-full">
              {oneTimeIntentions.length}
            </span>
          </div>
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {oneTimeIntentions.map((task) => {
                const cat = getCategory(task.categoryId);
                return (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    onClick={() => toggleTask(task.id)}
                    className={`group flex items-center gap-4 p-4 rounded-2xl transition-all cursor-pointer ${
                      task.completed
                        ? 'bg-earth-green/5 border border-transparent opacity-60'
                        : 'bg-white border border-earth-green/10 shadow-sm hover:shadow-md'
                    }`}
                  >
                    <button className="flex-shrink-0">
                      {task.completed ? (
                        <CheckCircle2 className="text-earth-green" size={24} />
                      ) : (
                        <Circle className="text-earth-muted/30 group-hover:text-earth-green/50 transition-colors" size={24} />
                      )}
                    </button>
                    <div className="flex-grow min-w-0">
                      <h3 className={`font-medium truncate ${task.completed ? 'line-through text-earth-muted' : 'text-earth-ink'}`}>
                        {task.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span 
                          className="text-[10px] font-bold uppercase tracking-tighter"
                          style={{ color: cat?.color || '#757575' }}
                        >
                          {cat?.name || 'Unknown'}
                        </span>
                        {task.deadline && (
                          <span className="text-[10px] font-medium text-earth-muted/40">
                            • Due {new Date(task.deadline).toLocaleDateString()}
                          </span>
                        )}
                        {task.routineTime && (
                          <span className="text-[10px] font-medium text-earth-muted/40">
                            • {task.routineTime}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            {oneTimeIntentions.length === 0 && (
              <p className="text-sm text-earth-muted/40 italic py-4 text-center border border-dashed border-earth-green/20 rounded-xl">
                No intentions for this category.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
