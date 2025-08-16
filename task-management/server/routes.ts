import { Express, Request, Response } from 'express';
import { db } from './db.js';
import { 
  users, projects, tasks, taskComments, projectMembers, taskLabels, taskLabelAssignments,
  insertUserSchema, insertProjectSchema, insertTaskSchema, insertTaskCommentSchema,
  insertProjectMemberSchema, insertTaskLabelSchema,
  type TaskWithRelations, type ProjectWithRelations
} from '../shared/schema.js';
import { eq, desc, asc, and, or } from 'drizzle-orm';
import { z } from 'zod';

export function setupRoutes(app: Express) {
  // Users routes
  app.get('/api/users', async (req: Request, res: Response) => {
    try {
      const allUsers = await db.query.users.findMany({
        orderBy: [asc(users.name)],
      });
      res.json(allUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  });

  app.post('/api/users', async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const [newUser] = await db.insert(users).values(userData).returning();
      res.status(201).json(newUser);
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(400).json({ error: 'Failed to create user' });
    }
  });

  // Projects routes
  app.get('/api/projects', async (req: Request, res: Response) => {
    try {
      const allProjects = await db.query.projects.findMany({
        with: {
          owner: true,
          tasks: {
            with: {
              assignee: true,
              reporter: true,
            },
          },
          members: {
            with: {
              user: true,
            },
          },
          labels: true,
        },
        orderBy: [desc(projects.updatedAt)],
      });
      res.json(allProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      res.status(500).json({ error: 'Failed to fetch projects' });
    }
  });

  app.get('/api/projects/:id', async (req: Request, res: Response) => {
    try {
      const projectId = parseInt(req.params.id);
      const project = await db.query.projects.findFirst({
        where: eq(projects.id, projectId),
        with: {
          owner: true,
          tasks: {
            with: {
              assignee: true,
              reporter: true,
              comments: {
                with: {
                  user: true,
                },
                orderBy: [asc(taskComments.createdAt)],
              },
              labelAssignments: {
                with: {
                  label: true,
                },
              },
            },
            orderBy: [asc(tasks.position)],
          },
          members: {
            with: {
              user: true,
            },
          },
          labels: true,
        },
      });

      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }

      res.json(project);
    } catch (error) {
      console.error('Error fetching project:', error);
      res.status(500).json({ error: 'Failed to fetch project' });
    }
  });

  app.post('/api/projects', async (req: Request, res: Response) => {
    try {
      const projectData = insertProjectSchema.parse(req.body);
      const [newProject] = await db.insert(projects).values(projectData).returning();
      
      // Add the project owner as a member
      await db.insert(projectMembers).values({
        projectId: newProject.id,
        userId: newProject.ownerId,
        role: 'owner',
      });

      res.status(201).json(newProject);
    } catch (error) {
      console.error('Error creating project:', error);
      res.status(400).json({ error: 'Failed to create project' });
    }
  });

  app.patch('/api/projects/:id', async (req: Request, res: Response) => {
    try {
      const projectId = parseInt(req.params.id);
      const updateData = req.body;
      
      const [updatedProject] = await db
        .update(projects)
        .set({ ...updateData, updatedAt: new Date() })
        .where(eq(projects.id, projectId))
        .returning();

      if (!updatedProject) {
        return res.status(404).json({ error: 'Project not found' });
      }

      res.json(updatedProject);
    } catch (error) {
      console.error('Error updating project:', error);
      res.status(400).json({ error: 'Failed to update project' });
    }
  });

  // Tasks routes
  app.get('/api/projects/:projectId/tasks', async (req: Request, res: Response) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const projectTasks = await db.query.tasks.findMany({
        where: eq(tasks.projectId, projectId),
        with: {
          assignee: true,
          reporter: true,
          comments: {
            with: {
              user: true,
            },
            orderBy: [asc(taskComments.createdAt)],
          },
          labelAssignments: {
            with: {
              label: true,
            },
          },
        },
        orderBy: [asc(tasks.position)],
      });

      res.json(projectTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      res.status(500).json({ error: 'Failed to fetch tasks' });
    }
  });

  app.post('/api/tasks', async (req: Request, res: Response) => {
    try {
      const taskData = insertTaskSchema.parse(req.body);
      
      // Get the highest position in the project for the status
      const maxPositionResult = await db.query.tasks.findFirst({
        where: and(eq(tasks.projectId, taskData.projectId), eq(tasks.status, taskData.status)),
        orderBy: [desc(tasks.position)],
      });

      const position = (maxPositionResult?.position || 0) + 1;

      const [newTask] = await db.insert(tasks).values({
        ...taskData,
        position,
      }).returning();

      res.status(201).json(newTask);
    } catch (error) {
      console.error('Error creating task:', error);
      res.status(400).json({ error: 'Failed to create task' });
    }
  });

  app.patch('/api/tasks/:id', async (req: Request, res: Response) => {
    try {
      const taskId = parseInt(req.params.id);
      const updateData = req.body;

      const [updatedTask] = await db
        .update(tasks)
        .set({ ...updateData, updatedAt: new Date() })
        .where(eq(tasks.id, taskId))
        .returning();

      if (!updatedTask) {
        return res.status(404).json({ error: 'Task not found' });
      }

      res.json(updatedTask);
    } catch (error) {
      console.error('Error updating task:', error);
      res.status(400).json({ error: 'Failed to update task' });
    }
  });

  app.delete('/api/tasks/:id', async (req: Request, res: Response) => {
    try {
      const taskId = parseInt(req.params.id);
      
      const [deletedTask] = await db
        .delete(tasks)
        .where(eq(tasks.id, taskId))
        .returning();

      if (!deletedTask) {
        return res.status(404).json({ error: 'Task not found' });
      }

      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting task:', error);
      res.status(500).json({ error: 'Failed to delete task' });
    }
  });

  // Task comments routes
  app.post('/api/tasks/:taskId/comments', async (req: Request, res: Response) => {
    try {
      const taskId = parseInt(req.params.taskId);
      const commentData = insertTaskCommentSchema.parse({
        ...req.body,
        taskId,
      });

      const [newComment] = await db.insert(taskComments).values(commentData).returning();
      
      // Fetch the comment with user data
      const commentWithUser = await db.query.taskComments.findFirst({
        where: eq(taskComments.id, newComment.id),
        with: {
          user: true,
        },
      });

      res.status(201).json(commentWithUser);
    } catch (error) {
      console.error('Error creating comment:', error);
      res.status(400).json({ error: 'Failed to create comment' });
    }
  });

  // Task labels routes
  app.get('/api/projects/:projectId/labels', async (req: Request, res: Response) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const labels = await db.query.taskLabels.findMany({
        where: eq(taskLabels.projectId, projectId),
        orderBy: [asc(taskLabels.name)],
      });

      res.json(labels);
    } catch (error) {
      console.error('Error fetching labels:', error);
      res.status(500).json({ error: 'Failed to fetch labels' });
    }
  });

  app.post('/api/labels', async (req: Request, res: Response) => {
    try {
      const labelData = insertTaskLabelSchema.parse(req.body);
      const [newLabel] = await db.insert(taskLabels).values(labelData).returning();
      res.status(201).json(newLabel);
    } catch (error) {
      console.error('Error creating label:', error);
      res.status(400).json({ error: 'Failed to create label' });
    }
  });

  // Project members routes
  app.post('/api/projects/:projectId/members', async (req: Request, res: Response) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const memberData = insertProjectMemberSchema.parse({
        ...req.body,
        projectId,
      });

      const [newMember] = await db.insert(projectMembers).values(memberData).returning();
      res.status(201).json(newMember);
    } catch (error) {
      console.error('Error adding project member:', error);
      res.status(400).json({ error: 'Failed to add project member' });
    }
  });

  // Health check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });
}