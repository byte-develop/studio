import { Server as SocketIOServer } from 'socket.io';

export function setupWebSocket(io: SocketIOServer) {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join project room
    socket.on('join-project', (projectId: string) => {
      socket.join(`project-${projectId}`);
      console.log(`User ${socket.id} joined project ${projectId}`);
    });

    // Leave project room
    socket.on('leave-project', (projectId: string) => {
      socket.leave(`project-${projectId}`);
      console.log(`User ${socket.id} left project ${projectId}`);
    });

    // Handle task updates
    socket.on('task-updated', (data) => {
      socket.to(`project-${data.projectId}`).emit('task-updated', data);
    });

    // Handle task status changes
    socket.on('task-status-changed', (data) => {
      socket.to(`project-${data.projectId}`).emit('task-status-changed', data);
    });

    // Handle new task creation
    socket.on('task-created', (data) => {
      socket.to(`project-${data.projectId}`).emit('task-created', data);
    });

    // Handle task deletion
    socket.on('task-deleted', (data) => {
      socket.to(`project-${data.projectId}`).emit('task-deleted', data);
    });

    // Handle new comments
    socket.on('comment-added', (data) => {
      socket.to(`project-${data.projectId}`).emit('comment-added', data);
    });

    // Handle user activity
    socket.on('user-typing', (data) => {
      socket.to(`project-${data.projectId}`).emit('user-typing', data);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
}