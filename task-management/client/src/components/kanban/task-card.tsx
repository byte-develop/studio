import { useState } from 'react';
import { format } from 'date-fns';
import { 
  Calendar, 
  Clock, 
  MessageCircle, 
  User, 
  MoreVertical,
  Edit,
  Trash2,
  Flag
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { TaskWithRelations } from '@shared/schema';

interface TaskCardProps {
  task: TaskWithRelations;
  isDragging?: boolean;
  onUpdate?: (updates: any) => void;
  onDelete?: () => void;
  onClick?: () => void;
}

const PRIORITY_COLORS = {
  low: 'bg-gray-500',
  medium: 'bg-yellow-500',
  high: 'bg-orange-500',
  urgent: 'bg-red-500',
};

const PRIORITY_ICONS = {
  low: <Flag className="h-3 w-3" />,
  medium: <Flag className="h-3 w-3" />,
  high: <Flag className="h-3 w-3" />,
  urgent: <Flag className="h-3 w-3" />,
};

export function TaskCard({ task, isDragging = false, onUpdate, onDelete, onClick }: TaskCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick?.();
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Open edit dialog
    console.log('Edit task:', task.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.();
  };

  return (
    <Card 
      className={`cursor-pointer hover:shadow-md transition-all duration-200 ${
        isDragging ? 'shadow-lg rotate-2' : 'hover:shadow-lg'
      }`}
      onClick={handleClick}
      data-testid={`task-card-${task.id}`}
    >
      <CardContent className="p-4 space-y-3">
        {/* Header with title and actions */}
        <div className="flex items-start justify-between">
          <h4 className="font-medium text-sm leading-tight flex-1 mr-2">
            {task.title}
          </h4>
          
          <div className="flex items-center space-x-1">
            {/* Priority indicator */}
            <div 
              className={`w-2 h-2 rounded-full ${PRIORITY_COLORS[task.priority]}`}
              title={`Priority: ${task.priority}`}
            />
            
            {/* Menu */}
            <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={handleMenuClick}
                  data-testid={`task-menu-${task.id}`}
                >
                  <MoreVertical className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={handleEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleDelete}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Description */}
        {task.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {task.description}
          </p>
        )}

        {/* Labels */}
        {task.labelAssignments && task.labelAssignments.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {task.labelAssignments.slice(0, 3).map((assignment) => (
              <Badge 
                key={assignment.id} 
                variant="secondary" 
                className="text-xs px-2 py-0"
                style={{ 
                  backgroundColor: assignment.label.color + '20',
                  color: assignment.label.color,
                  borderColor: assignment.label.color + '40',
                }}
              >
                {assignment.label.name}
              </Badge>
            ))}
            {task.labelAssignments.length > 3 && (
              <Badge variant="outline" className="text-xs px-2 py-0">
                +{task.labelAssignments.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Footer with assignee, comments, and due date */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-2">
            {/* Assignee */}
            {task.assignee && (
              <div className="flex items-center space-x-1" title={task.assignee.name}>
                <Avatar className="h-5 w-5">
                  <AvatarFallback className="text-xs">
                    {task.assignee.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              </div>
            )}

            {/* Comments count */}
            {task.comments && task.comments.length > 0 && (
              <div className="flex items-center space-x-1" title={`${task.comments.length} comments`}>
                <MessageCircle className="h-3 w-3" />
                <span>{task.comments.length}</span>
              </div>
            )}

            {/* Estimated hours */}
            {task.estimatedHours && (
              <div className="flex items-center space-x-1" title={`${task.estimatedHours}h estimated`}>
                <Clock className="h-3 w-3" />
                <span>{task.estimatedHours}h</span>
              </div>
            )}
          </div>

          {/* Due date */}
          {task.dueDate && (
            <div 
              className={`flex items-center space-x-1 ${
                new Date(task.dueDate) < new Date() 
                  ? 'text-destructive' 
                  : new Date(task.dueDate) < new Date(Date.now() + 24 * 60 * 60 * 1000)
                  ? 'text-yellow-600'
                  : ''
              }`}
              title={`Due: ${format(new Date(task.dueDate), 'MMM d, yyyy')}`}
            >
              <Calendar className="h-3 w-3" />
              <span>{format(new Date(task.dueDate), 'MMM d')}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}