import { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TaskCard } from './task-card';
import { useSocket } from '@/contexts/socket-context';
import type { TaskWithRelations } from '@shared/schema';

interface KanbanBoardProps {
  projectId: number;
  tasks: TaskWithRelations[];
  onTaskUpdate?: (taskId: number, updates: any) => void;
  onTaskCreate?: (columnId: string) => void;
}

const COLUMNS = [
  { id: 'todo', title: 'To Do', color: 'bg-slate-100 dark:bg-slate-800' },
  { id: 'in_progress', title: 'In Progress', color: 'bg-blue-100 dark:bg-blue-900' },
  { id: 'in_review', title: 'In Review', color: 'bg-yellow-100 dark:bg-yellow-900' },
  { id: 'done', title: 'Done', color: 'bg-green-100 dark:bg-green-900' },
];

export function KanbanBoard({ projectId, tasks, onTaskUpdate, onTaskCreate }: KanbanBoardProps) {
  const { socket } = useSocket();
  const [draggedTask, setDraggedTask] = useState<string | null>(null);

  // Group tasks by status
  const tasksByStatus = tasks.reduce((acc, task) => {
    if (!acc[task.status]) acc[task.status] = [];
    acc[task.status].push(task);
    return acc;
  }, {} as Record<string, TaskWithRelations[]>);

  // Sort tasks by position within each column
  Object.keys(tasksByStatus).forEach(status => {
    tasksByStatus[status].sort((a, b) => a.position - b.position);
  });

  const handleDragStart = (start: any) => {
    setDraggedTask(start.draggableId);
  };

  const handleDragEnd = (result: DropResult) => {
    setDraggedTask(null);

    const { destination, source, draggableId } = result;

    // Drop outside a droppable area
    if (!destination) return;

    // Drop in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const taskId = parseInt(draggableId);
    const newStatus = destination.droppableId as any;

    // Update task status and position
    const updates = {
      status: newStatus,
      position: destination.index,
    };

    onTaskUpdate?.(taskId, updates);

    // Emit real-time update
    if (socket) {
      socket.emit('task-status-changed', {
        projectId,
        taskId,
        ...updates,
      });
    }
  };

  return (
    <div className="h-full flex flex-col">
      <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex-1 overflow-x-auto">
          <div className="flex space-x-6 p-6 min-w-max">
            {COLUMNS.map((column) => (
              <div key={column.id} className="flex-shrink-0 w-80">
                <Card className={`h-full ${column.color}`}>
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center">
                        {column.title}
                        <span className="ml-2 text-sm font-normal bg-white dark:bg-slate-700 px-2 py-1 rounded-full">
                          {tasksByStatus[column.id]?.length || 0}
                        </span>
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onTaskCreate?.(column.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Droppable droppableId={column.id}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`min-h-[200px] space-y-3 transition-colors ${
                            snapshot.isDraggingOver ? 'column-dragging-over' : ''
                          }`}
                        >
                          {(tasksByStatus[column.id] || []).map((task, index) => (
                            <Draggable
                              key={task.id}
                              draggableId={task.id.toString()}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`${
                                    snapshot.isDragging ? 'task-dragging' : ''
                                  }`}
                                >
                                  <TaskCard
                                    task={task}
                                    isDragging={snapshot.isDragging}
                                    onUpdate={(updates) => onTaskUpdate?.(task.id, updates)}
                                  />
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </DragDropContext>
    </div>
  );
}