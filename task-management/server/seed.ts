import { db } from './db.js';
import { users, projects, tasks, taskLabels, projectMembers } from '../shared/schema.js';
import { eq } from 'drizzle-orm';

async function seedDatabase() {
  console.log('🌱 Starting database seeding...');

  try {
    // Clear existing data
    await db.delete(taskLabels);
    await db.delete(projectMembers);
    await db.delete(tasks);
    await db.delete(projects);
    await db.delete(users);

    // Seed users
    console.log('👤 Creating users...');
    const seedUsers = await db.insert(users).values([
      {
        email: 'alex@company.com',
        name: 'Alex Johnson',
        role: 'project_manager',
        avatar: '👨‍💼',
      },
      {
        email: 'sarah@company.com', 
        name: 'Sarah Chen',
        role: 'developer',
        avatar: '👩‍💻',
      },
      {
        email: 'mike@company.com',
        name: 'Mike Wilson', 
        role: 'designer',
        avatar: '👨‍🎨',
      },
      {
        email: 'lisa@company.com',
        name: 'Lisa Park',
        role: 'admin',
        avatar: '👩‍💼',
      },
      {
        email: 'dev@company.com',
        name: 'Dev Team',
        role: 'developer',
        avatar: '🧑‍💻',
      },
    ]).returning();

    console.log(`✅ Created ${seedUsers.length} users`);

    // Seed projects
    console.log('📁 Creating projects...');
    const seedProjects = await db.insert(projects).values([
      {
        name: 'Task Management System',
        description: 'A comprehensive project and task management application with Kanban boards',
        status: 'active',
        color: '#3B82F6',
        ownerId: seedUsers[0].id,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-06-01'),
      },
      {
        name: 'E-commerce Platform',
        description: 'Modern e-commerce solution with inventory management',
        status: 'planning', 
        color: '#10B981',
        ownerId: seedUsers[3].id,
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-08-01'),
      },
      {
        name: 'Mobile App Design',
        description: 'UI/UX design for mobile application',
        status: 'active',
        color: '#8B5CF6',
        ownerId: seedUsers[2].id,
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-04-15'),
      },
    ]).returning();

    console.log(`✅ Created ${seedProjects.length} projects`);

    // Add project members
    console.log('👥 Adding project members...');
    const membershipData = [
      // Task Management System members
      { projectId: seedProjects[0].id, userId: seedUsers[0].id, role: 'owner' },
      { projectId: seedProjects[0].id, userId: seedUsers[1].id, role: 'developer' },
      { projectId: seedProjects[0].id, userId: seedUsers[4].id, role: 'developer' },
      
      // E-commerce Platform members  
      { projectId: seedProjects[1].id, userId: seedUsers[3].id, role: 'owner' },
      { projectId: seedProjects[1].id, userId: seedUsers[1].id, role: 'developer' },
      { projectId: seedProjects[1].id, userId: seedUsers[2].id, role: 'designer' },
      
      // Mobile App Design members
      { projectId: seedProjects[2].id, userId: seedUsers[2].id, role: 'owner' },
      { projectId: seedProjects[2].id, userId: seedUsers[0].id, role: 'project_manager' },
    ];

    await db.insert(projectMembers).values(membershipData);
    console.log(`✅ Added ${membershipData.length} project memberships`);

    // Seed task labels
    console.log('🏷️ Creating task labels...');
    const labelData = [
      // Task Management System labels
      { name: 'Frontend', color: '#3B82F6', projectId: seedProjects[0].id },
      { name: 'Backend', color: '#10B981', projectId: seedProjects[0].id },
      { name: 'Bug', color: '#EF4444', projectId: seedProjects[0].id },
      { name: 'Enhancement', color: '#8B5CF6', projectId: seedProjects[0].id },
      
      // E-commerce Platform labels
      { name: 'API', color: '#F59E0B', projectId: seedProjects[1].id },
      { name: 'UI/UX', color: '#EC4899', projectId: seedProjects[1].id },
      { name: 'Database', color: '#6B7280', projectId: seedProjects[1].id },
      
      // Mobile App Design labels
      { name: 'Wireframe', color: '#14B8A6', projectId: seedProjects[2].id },
      { name: 'Prototype', color: '#F97316', projectId: seedProjects[2].id },
      { name: 'Testing', color: '#84CC16', projectId: seedProjects[2].id },
    ];

    const seedLabels = await db.insert(taskLabels).values(labelData).returning();
    console.log(`✅ Created ${seedLabels.length} task labels`);

    // Seed tasks
    console.log('✅ Creating tasks...');
    const taskData = [
      // Task Management System tasks
      {
        title: 'Setup project structure',
        description: 'Initialize React + Node.js project with TypeScript',
        status: 'done',
        priority: 'high',
        projectId: seedProjects[0].id,
        assigneeId: seedUsers[1].id,
        reporterId: seedUsers[0].id,
        estimatedHours: 8,
        actualHours: 6,
        position: 1,
      },
      {
        title: 'Design database schema',
        description: 'Create comprehensive database schema for projects, tasks, and users',
        status: 'done',
        priority: 'high',
        projectId: seedProjects[0].id,
        assigneeId: seedUsers[1].id,
        reporterId: seedUsers[0].id,
        estimatedHours: 12,
        actualHours: 10,
        position: 2,
      },
      {
        title: 'Implement authentication',
        description: 'Add user authentication and authorization',
        status: 'in_progress',
        priority: 'high',
        projectId: seedProjects[0].id,
        assigneeId: seedUsers[4].id,
        reporterId: seedUsers[0].id,
        estimatedHours: 16,
        position: 1,
      },
      {
        title: 'Build Kanban board',
        description: 'Create drag-and-drop Kanban board interface',
        status: 'in_progress',
        priority: 'medium',
        projectId: seedProjects[0].id,
        assigneeId: seedUsers[1].id,
        reporterId: seedUsers[0].id,
        estimatedHours: 24,
        position: 2,
      },
      {
        title: 'Add real-time updates',
        description: 'Implement WebSocket for real-time task updates',
        status: 'todo',
        priority: 'medium',
        projectId: seedProjects[0].id,
        assigneeId: seedUsers[4].id,
        reporterId: seedUsers[0].id,
        estimatedHours: 16,
        position: 1,
      },
      {
        title: 'Create project analytics',
        description: 'Build analytics dashboard for project insights',
        status: 'todo',
        priority: 'low',
        projectId: seedProjects[0].id,
        assigneeId: seedUsers[1].id,
        reporterId: seedUsers[0].id,
        estimatedHours: 20,
        position: 2,
      },

      // E-commerce Platform tasks
      {
        title: 'Product catalog design',
        description: 'Design product listing and detail pages',
        status: 'in_progress',
        priority: 'high',
        projectId: seedProjects[1].id,
        assigneeId: seedUsers[2].id,
        reporterId: seedUsers[3].id,
        estimatedHours: 32,
        position: 1,
      },
      {
        title: 'Payment integration',
        description: 'Integrate Stripe payment processing',
        status: 'todo',
        priority: 'high',
        projectId: seedProjects[1].id,
        assigneeId: seedUsers[1].id,
        reporterId: seedUsers[3].id,
        estimatedHours: 20,
        position: 1,
      },

      // Mobile App Design tasks
      {
        title: 'User research',
        description: 'Conduct user interviews and create personas',
        status: 'done',
        priority: 'high',
        projectId: seedProjects[2].id,
        assigneeId: seedUsers[2].id,
        reporterId: seedUsers[0].id,
        estimatedHours: 40,
        actualHours: 35,
        position: 1,
      },
      {
        title: 'Create wireframes',
        description: 'Design low-fidelity wireframes for all screens',
        status: 'in_progress',
        priority: 'high',
        projectId: seedProjects[2].id,
        assigneeId: seedUsers[2].id,
        reporterId: seedUsers[0].id,
        estimatedHours: 24,
        position: 1,
      },
    ];

    const seedTasks = await db.insert(tasks).values(taskData).returning();
    console.log(`✅ Created ${seedTasks.length} tasks`);

    console.log('🎉 Database seeding completed successfully!');

    // Print summary
    console.log('\n📊 Seeding Summary:');
    console.log(`- Users: ${seedUsers.length}`);
    console.log(`- Projects: ${seedProjects.length}`);
    console.log(`- Tasks: ${seedTasks.length}`);
    console.log(`- Labels: ${seedLabels.length}`);
    console.log(`- Project Members: ${membershipData.length}`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export { seedDatabase };