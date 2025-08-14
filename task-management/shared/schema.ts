import { pgTable, serial, text, timestamp, boolean, integer, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

// Enums
export const taskStatusEnum = pgEnum('task_status', ['todo', 'in_progress', 'in_review', 'done']);
export const taskPriorityEnum = pgEnum('task_priority', ['low', 'medium', 'high', 'urgent']);
export const projectStatusEnum = pgEnum('project_status', ['planning', 'active', 'on_hold', 'completed']);
export const userRoleEnum = pgEnum('user_role', ['admin', 'project_manager', 'developer', 'designer', 'tester']);

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  avatar: text('avatar'),
  role: userRoleEnum('role').notNull().default('developer'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Projects table
export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  status: projectStatusEnum('status').notNull().default('planning'),
  color: text('color').notNull().default('#3B82F6'),
  startDate: timestamp('start_date'),
  endDate: timestamp('end_date'),
  ownerId: integer('owner_id').notNull().references(() => users.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Tasks table
export const tasks = pgTable('tasks', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  status: taskStatusEnum('status').notNull().default('todo'),
  priority: taskPriorityEnum('priority').notNull().default('medium'),
  projectId: integer('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  assigneeId: integer('assignee_id').references(() => users.id),
  reporterId: integer('reporter_id').notNull().references(() => users.id),
  estimatedHours: integer('estimated_hours'),
  actualHours: integer('actual_hours'),
  dueDate: timestamp('due_date'),
  position: integer('position').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Task Comments table
export const taskComments = pgTable('task_comments', {
  id: serial('id').primaryKey(),
  taskId: integer('task_id').notNull().references(() => tasks.id, { onDelete: 'cascade' }),
  userId: integer('user_id').notNull().references(() => users.id),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Project Members table (many-to-many relationship)
export const projectMembers = pgTable('project_members', {
  id: serial('id').primaryKey(),
  projectId: integer('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  role: text('role').notNull().default('member'),
  joinedAt: timestamp('joined_at').notNull().defaultNow(),
});

// Task Labels table
export const taskLabels = pgTable('task_labels', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  color: text('color').notNull(),
  projectId: integer('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Task Label Assignments table (many-to-many)
export const taskLabelAssignments = pgTable('task_label_assignments', {
  id: serial('id').primaryKey(),
  taskId: integer('task_id').notNull().references(() => tasks.id, { onDelete: 'cascade' }),
  labelId: integer('label_id').notNull().references(() => taskLabels.id, { onDelete: 'cascade' }),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  ownedProjects: many(projects),
  assignedTasks: many(tasks, { relationName: 'assignee' }),
  reportedTasks: many(tasks, { relationName: 'reporter' }),
  comments: many(taskComments),
  projectMemberships: many(projectMembers),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  owner: one(users, {
    fields: [projects.ownerId],
    references: [users.id],
  }),
  tasks: many(tasks),
  members: many(projectMembers),
  labels: many(taskLabels),
}));

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  project: one(projects, {
    fields: [tasks.projectId],
    references: [projects.id],
  }),
  assignee: one(users, {
    fields: [tasks.assigneeId],
    references: [users.id],
    relationName: 'assignee',
  }),
  reporter: one(users, {
    fields: [tasks.reporterId],
    references: [users.id],
    relationName: 'reporter',
  }),
  comments: many(taskComments),
  labelAssignments: many(taskLabelAssignments),
}));

export const taskCommentsRelations = relations(taskComments, ({ one }) => ({
  task: one(tasks, {
    fields: [taskComments.taskId],
    references: [tasks.id],
  }),
  user: one(users, {
    fields: [taskComments.userId],
    references: [users.id],
  }),
}));

export const projectMembersRelations = relations(projectMembers, ({ one }) => ({
  project: one(projects, {
    fields: [projectMembers.projectId],
    references: [projects.id],
  }),
  user: one(users, {
    fields: [projectMembers.userId],
    references: [users.id],
  }),
}));

export const taskLabelsRelations = relations(taskLabels, ({ one, many }) => ({
  project: one(projects, {
    fields: [taskLabels.projectId],
    references: [projects.id],
  }),
  assignments: many(taskLabelAssignments),
}));

export const taskLabelAssignmentsRelations = relations(taskLabelAssignments, ({ one }) => ({
  task: one(tasks, {
    fields: [taskLabelAssignments.taskId],
    references: [tasks.id],
  }),
  label: one(taskLabels, {
    fields: [taskLabelAssignments.labelId],
    references: [taskLabels.id],
  }),
}));

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const selectUserSchema = createSelectSchema(users);
export type User = z.infer<typeof selectUserSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const selectProjectSchema = createSelectSchema(projects);
export type Project = z.infer<typeof selectProjectSchema>;
export type InsertProject = z.infer<typeof insertProjectSchema>;

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const selectTaskSchema = createSelectSchema(tasks);
export type Task = z.infer<typeof selectTaskSchema>;
export type InsertTask = z.infer<typeof insertTaskSchema>;

export const insertTaskCommentSchema = createInsertSchema(taskComments).omit({
  id: true,
  createdAt: true,
});
export const selectTaskCommentSchema = createSelectSchema(taskComments);
export type TaskComment = z.infer<typeof selectTaskCommentSchema>;
export type InsertTaskComment = z.infer<typeof insertTaskCommentSchema>;

export const insertProjectMemberSchema = createInsertSchema(projectMembers).omit({
  id: true,
  joinedAt: true,
});
export const selectProjectMemberSchema = createSelectSchema(projectMembers);
export type ProjectMember = z.infer<typeof selectProjectMemberSchema>;
export type InsertProjectMember = z.infer<typeof insertProjectMemberSchema>;

export const insertTaskLabelSchema = createInsertSchema(taskLabels).omit({
  id: true,
  createdAt: true,
});
export const selectTaskLabelSchema = createSelectSchema(taskLabels);
export type TaskLabel = z.infer<typeof selectTaskLabelSchema>;
export type InsertTaskLabel = z.infer<typeof insertTaskLabelSchema>;

// Extended types with relations
export type TaskWithRelations = Task & {
  assignee?: User | null;
  reporter?: User;
  project?: Project;
  comments?: (TaskComment & { user: User })[];
  labelAssignments?: (typeof taskLabelAssignments.$inferSelect & { label: TaskLabel })[];
};

export type ProjectWithRelations = Project & {
  owner?: User;
  tasks?: TaskWithRelations[];
  members?: (ProjectMember & { user: User })[];
  labels?: TaskLabel[];
};