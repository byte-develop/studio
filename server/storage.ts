import { 
  type User, type InsertUser, 
  type Contact, type InsertContact,
  type Technology, type InsertTechnology,
  type PortfolioProject, type InsertPortfolioProject,
  type ServiceProject, type InsertServiceProject,
  type TeamRole, type InsertTeamRole,
  users, contacts, technologies, portfolioProjects, serviceProjects, teamRoles
} from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Contact methods
  createContact(contact: InsertContact): Promise<Contact>;
  getContacts(): Promise<Contact[]>;
  
  // Technology methods
  getTechnologies(): Promise<Technology[]>;
  createTechnology(technology: InsertTechnology): Promise<Technology>;
  updateTechnology(id: number, technology: Partial<InsertTechnology>): Promise<Technology>;
  deleteTechnology(id: number): Promise<void>;
  
  // Portfolio project methods
  getPortfolioProjects(): Promise<PortfolioProject[]>;
  createPortfolioProject(project: InsertPortfolioProject): Promise<PortfolioProject>;
  updatePortfolioProject(id: number, project: Partial<InsertPortfolioProject>): Promise<PortfolioProject>;
  deletePortfolioProject(id: number): Promise<void>;
  
  // Service project methods
  getServiceProjects(serviceType?: string): Promise<ServiceProject[]>;
  createServiceProject(project: InsertServiceProject): Promise<ServiceProject>;
  updateServiceProject(id: number, project: Partial<InsertServiceProject>): Promise<ServiceProject>;
  deleteServiceProject(id: number): Promise<void>;
  
  // Team role methods
  getTeamRoles(): Promise<TeamRole[]>;
  createTeamRole(role: InsertTeamRole): Promise<TeamRole>;
  updateTeamRole(id: number, role: Partial<InsertTeamRole>): Promise<TeamRole>;
  deleteTeamRole(id: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private contacts: Map<string, Contact>;
  private technologies: Map<number, Technology>;
  private portfolioProjects: Map<number, PortfolioProject>;
  private serviceProjects: Map<number, ServiceProject>;
  private teamRoles: Map<number, TeamRole>;
  private idCounter: number;

  constructor() {
    this.users = new Map();
    this.contacts = new Map();
    this.technologies = new Map();
    this.portfolioProjects = new Map();
    this.serviceProjects = new Map();
    this.teamRoles = new Map();
    this.idCounter = 1;
    
    // Инициализируем базовые данные
    this.initializeBaseData();
  }

  private initializeBaseData() {
    // Базовые технологии
    const baseTechnologies = [
      { name: "React", icon: "Code", category: "frontend" },
      { name: "Node.js", icon: "Server", category: "backend" },
      { name: "TypeScript", icon: "FileCode", category: "frontend" },
      { name: "Python", icon: "Bot", category: "backend" },
      { name: "PostgreSQL", icon: "Database", category: "database" },
      { name: "Docker", icon: "Package", category: "devops" }
    ];

    baseTechnologies.forEach(tech => {
      const technology: Technology = {
        id: this.idCounter++,
        ...tech,
        createdAt: new Date()
      };
      this.technologies.set(technology.id, technology);
    });

    // Базовые роли команды
    const baseRoles = [
      { title: "Разработчики", description: "Frontend и Backend разработчики", icon: "Code", count: 8, color: "blue" },
      { title: "UI/UX Дизайнеры", description: "Создают красивые интерфейсы", icon: "Palette", count: 3, color: "purple" },
      { title: "DevOps Инженеры", description: "Настройка и поддержка инфраструктуры", icon: "Settings", count: 2, color: "green" },
      { title: "Проект-менеджеры", description: "Управление проектами и координация", icon: "Users", count: 2, color: "orange" }
    ];

    baseRoles.forEach(role => {
      const teamRole: TeamRole = {
        id: this.idCounter++,
        ...role,
        updatedAt: new Date()
      };
      this.teamRoles.set(teamRole.id, teamRole);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = randomUUID();
    const contact: Contact = { 
      ...insertContact,
      company: insertContact.company ?? null,
      phone: insertContact.phone ?? null,
      service: insertContact.service ?? null,
      budget: insertContact.budget ?? null,
      id, 
      createdAt: new Date() 
    };
    this.contacts.set(id, contact);
    return contact;
  }

  async getContacts(): Promise<Contact[]> {
    return Array.from(this.contacts.values()).sort(
      (a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
    );
  }

  // Technology methods
  async getTechnologies(): Promise<Technology[]> {
    return Array.from(this.technologies.values()).sort((a, b) => a.name.localeCompare(b.name));
  }

  async createTechnology(insertTechnology: InsertTechnology): Promise<Technology> {
    const technology: Technology = {
      id: this.idCounter++,
      ...insertTechnology,
      createdAt: new Date()
    };
    this.technologies.set(technology.id, technology);
    return technology;
  }

  async updateTechnology(id: number, updateData: Partial<InsertTechnology>): Promise<Technology> {
    const existing = this.technologies.get(id);
    if (!existing) throw new Error('Technology not found');
    
    const updated: Technology = { ...existing, ...updateData };
    this.technologies.set(id, updated);
    return updated;
  }

  async deleteTechnology(id: number): Promise<void> {
    this.technologies.delete(id);
  }

  // Portfolio project methods
  async getPortfolioProjects(): Promise<PortfolioProject[]> {
    return Array.from(this.portfolioProjects.values()).sort(
      (a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
    );
  }

  async createPortfolioProject(insertProject: InsertPortfolioProject): Promise<PortfolioProject> {
    const project: PortfolioProject = {
      id: this.idCounter++,
      ...insertProject,
      link: insertProject.link ?? null,
      featured: insertProject.featured ?? false,
      technologies: insertProject.technologies ?? [],
      createdAt: new Date()
    };
    this.portfolioProjects.set(project.id, project);
    return project;
  }

  async updatePortfolioProject(id: number, updateData: Partial<InsertPortfolioProject>): Promise<PortfolioProject> {
    const existing = this.portfolioProjects.get(id);
    if (!existing) throw new Error('Portfolio project not found');
    
    const updated: PortfolioProject = { ...existing, ...updateData };
    this.portfolioProjects.set(id, updated);
    return updated;
  }

  async deletePortfolioProject(id: number): Promise<void> {
    this.portfolioProjects.delete(id);
  }

  // Service project methods
  async getServiceProjects(serviceType?: string): Promise<ServiceProject[]> {
    const projects = Array.from(this.serviceProjects.values());
    const filtered = serviceType ? projects.filter(p => p.serviceType === serviceType) : projects;
    return filtered.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async createServiceProject(insertProject: InsertServiceProject): Promise<ServiceProject> {
    const project: ServiceProject = {
      id: this.idCounter++,
      ...insertProject,
      link: insertProject.link ?? null,
      technologies: insertProject.technologies ?? [],
      createdAt: new Date()
    };
    this.serviceProjects.set(project.id, project);
    return project;
  }

  async updateServiceProject(id: number, updateData: Partial<InsertServiceProject>): Promise<ServiceProject> {
    const existing = this.serviceProjects.get(id);
    if (!existing) throw new Error('Service project not found');
    
    const updated: ServiceProject = { ...existing, ...updateData };
    this.serviceProjects.set(id, updated);
    return updated;
  }

  async deleteServiceProject(id: number): Promise<void> {
    this.serviceProjects.delete(id);
  }

  // Team role methods
  async getTeamRoles(): Promise<TeamRole[]> {
    return Array.from(this.teamRoles.values()).sort((a, b) => a.title.localeCompare(b.title));
  }

  async createTeamRole(insertRole: InsertTeamRole): Promise<TeamRole> {
    const role: TeamRole = {
      id: this.idCounter++,
      ...insertRole,
      count: insertRole.count ?? 1,
      color: insertRole.color ?? "blue",
      updatedAt: new Date()
    };
    this.teamRoles.set(role.id, role);
    return role;
  }

  async updateTeamRole(id: number, updateData: Partial<InsertTeamRole>): Promise<TeamRole> {
    const existing = this.teamRoles.get(id);
    if (!existing) throw new Error('Team role not found');
    
    const updated: TeamRole = { ...existing, ...updateData, updatedAt: new Date() };
    this.teamRoles.set(id, updated);
    return updated;
  }

  async deleteTeamRole(id: number): Promise<void> {
    this.teamRoles.delete(id);
  }
}

// DatabaseStorage implementation for PostgreSQL
export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Contact methods
  async createContact(insertContact: InsertContact): Promise<Contact> {
    const [contact] = await db.insert(contacts).values(insertContact).returning();
    return contact;
  }

  async getContacts(): Promise<Contact[]> {
    return await db.select().from(contacts).orderBy(contacts.createdAt);
  }

  // Technology methods
  async getTechnologies(): Promise<Technology[]> {
    return await db.select().from(technologies).orderBy(technologies.name);
  }

  async createTechnology(insertTechnology: InsertTechnology): Promise<Technology> {
    const [technology] = await db.insert(technologies).values(insertTechnology).returning();
    return technology;
  }

  async updateTechnology(id: number, updateData: Partial<InsertTechnology>): Promise<Technology> {
    const [technology] = await db.update(technologies)
      .set(updateData)
      .where(eq(technologies.id, id))
      .returning();
    if (!technology) throw new Error('Technology not found');
    return technology;
  }

  async deleteTechnology(id: number): Promise<void> {
    await db.delete(technologies).where(eq(technologies.id, id));
  }

  // Portfolio project methods
  async getPortfolioProjects(): Promise<PortfolioProject[]> {
    return await db.select().from(portfolioProjects).orderBy(portfolioProjects.createdAt);
  }

  async createPortfolioProject(insertProject: InsertPortfolioProject): Promise<PortfolioProject> {
    const [project] = await db.insert(portfolioProjects).values(insertProject).returning();
    return project;
  }

  async updatePortfolioProject(id: number, updateData: Partial<InsertPortfolioProject>): Promise<PortfolioProject> {
    const [project] = await db.update(portfolioProjects)
      .set(updateData)
      .where(eq(portfolioProjects.id, id))
      .returning();
    if (!project) throw new Error('Portfolio project not found');
    return project;
  }

  async deletePortfolioProject(id: number): Promise<void> {
    await db.delete(portfolioProjects).where(eq(portfolioProjects.id, id));
  }

  // Service project methods
  async getServiceProjects(serviceType?: string): Promise<ServiceProject[]> {
    if (serviceType) {
      return await db.select().from(serviceProjects)
        .where(eq(serviceProjects.serviceType, serviceType))
        .orderBy(serviceProjects.createdAt);
    }
    return await db.select().from(serviceProjects).orderBy(serviceProjects.createdAt);
  }

  async createServiceProject(insertProject: InsertServiceProject): Promise<ServiceProject> {
    const [project] = await db.insert(serviceProjects).values(insertProject).returning();
    return project;
  }

  async updateServiceProject(id: number, updateData: Partial<InsertServiceProject>): Promise<ServiceProject> {
    const [project] = await db.update(serviceProjects)
      .set(updateData)
      .where(eq(serviceProjects.id, id))
      .returning();
    if (!project) throw new Error('Service project not found');
    return project;
  }

  async deleteServiceProject(id: number): Promise<void> {
    await db.delete(serviceProjects).where(eq(serviceProjects.id, id));
  }

  // Team role methods
  async getTeamRoles(): Promise<TeamRole[]> {
    return await db.select().from(teamRoles).orderBy(teamRoles.title);
  }

  async createTeamRole(insertRole: InsertTeamRole): Promise<TeamRole> {
    const [role] = await db.insert(teamRoles).values(insertRole).returning();
    return role;
  }

  async updateTeamRole(id: number, updateData: Partial<InsertTeamRole>): Promise<TeamRole> {
    const [role] = await db.update(teamRoles)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(teamRoles.id, id))
      .returning();
    if (!role) throw new Error('Team role not found');
    return role;
  }

  async deleteTeamRole(id: number): Promise<void> {
    await db.delete(teamRoles).where(eq(teamRoles.id, id));
  }
}

export const storage = new DatabaseStorage();
