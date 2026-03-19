import { useMemo } from 'react';
import { Task, Category } from '../types';
import { motion } from 'motion/react';
import { Clock, CheckCircle2, Circle } from 'lucide-react';

interface RoutineTabProps {
  tasks: Task[];
  categories: Category[];
  toggleTask: (id: string) => void;
}

export default function RoutineTab({ tasks, categories, toggleTask }: RoutineTabProps) {
  const routineTasks = useMemo(() => {
    return tasks
      .filter((t) => t.type === 'daily' && t.routineTime)
      .sort((a, b) => (a.routineTime || '').localeCompare(b.routineTime || ''));
  }, [tasks]);

  const getCategory = (id: string) => categories.find(c => c.id === id);

  return (
    <div className="pb-[calc(env(safe-area-inset-bottom)+100px)] pt-6 px-6 max-w-lg mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-earth-ink mb-2">Daily Routine</h1>
        <p className="text-earth-muted italic">A dedicated timeline for your recurring habits.</p>
      </header>

      <div className="relative pl-8 border-l border-earth-green/20 space-y-12">
        {routineTasks.map((task, index) => {
          const cat = getCategory(task.categoryId);
          return (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {/* Timeline Dot */}
              <div className={`absolute -left-[41px] top-1 w-6 h-6 rounded-full border-4 border-earth-bg flex items-center justify-center z-10 ${
                task.completed ? 'bg-earth-green' : 'bg-white border-earth-green/20'
              }`}>
                {task.completed && <CheckCircle2 size={12} className="text-white" />}
              </div>

              <div 
                onClick={() => toggleTask(task.id)}
                className={`p-5 rounded-2xl transition-all cursor-pointer ${
                  task.completed 
                    ? 'bg-earth-green/5 opacity-60' 
                    : 'bg-white shadow-sm hover:shadow-md border border-earth-green/10'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Clock size={14} className="text-earth-green" />
                  <span className="text-xs font-bold text-earth-green tracking-widest uppercase">
                    {task.routineTime}
                  </span>
                </div>
                <h3 className={`text-lg font-semibold ${task.completed ? 'line-through text-earth-muted' : 'text-earth-ink'}`}>
                  {task.title}
                </h3>
                <p 
                  className="text-[10px] font-bold uppercase tracking-widest mt-2"
                  style={{ color: cat?.color || '#757575' }}
                >
                  {cat?.name || 'Unknown'}
                </p>
              </div>
            </motion.div>
          );
        })}

        {routineTasks.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-earth-muted/40 italic">
              No daily rituals scheduled yet.
            </p>
            <p className="text-xs text-earth-muted/30 mt-2">
              Add some in the Manage tab to see your timeline.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
