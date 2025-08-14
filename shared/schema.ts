import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const contacts = pgTable("contacts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company"),
  phone: text("phone"),
  service: text("service"),
  budget: text("budget"),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Таблица для технологий
export const technologies = pgTable("technologies", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  icon: text("icon").notNull(), // название иконки из lucide-react
  category: text("category").notNull(), // frontend, backend, mobile, etc.
  createdAt: timestamp("created_at").defaultNow(),
});

// Таблица для проектов портфолио
export const portfolioProjects = pgTable("portfolio_projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(), // URL изображения
  technologies: text("technologies").array().notNull().default([]), // массив технологий
  link: text("link"), // ссылка на проект
  featured: boolean("featured").default(false), // показывать на главной
  createdAt: timestamp("created_at").defaultNow(),
});

// Таблица для проектов услуг
export const serviceProjects = pgTable("service_projects", {
  id: serial("id").primaryKey(),
  serviceType: text("service_type").notNull(), // web-development, mobile-development, etc.
  title: text("title").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  technologies: text("technologies").array().notNull().default([]),
  link: text("link"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Таблица для ролей команды
export const teamRoles = pgTable("team_roles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(), // название иконки
  count: integer("count").notNull().default(1), // количество участников
  color: text("color").notNull().default("blue"), // цвет для UI
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Таблица для настроек приложения
export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(), // например: telegram_bot_token, telegram_chat_id
  value: text("value"), // значение настройки
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Схемы для валидации
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertContactSchema = createInsertSchema(contacts).omit({
  id: true,
  createdAt: true,
}).extend({
  name: z.string().min(2, "Имя должно содержать минимум 2 символа"),
  email: z.string().email("Введите корректный email адрес"),
  message: z.string().min(10, "Сообщение должно содержать минимум 10 символов"),
});

export const insertTechnologySchema = createInsertSchema(technologies).omit({
  id: true,
  createdAt: true,
});

export const insertPortfolioProjectSchema = createInsertSchema(portfolioProjects).omit({
  id: true,
  createdAt: true,
});

export const insertServiceProjectSchema = createInsertSchema(serviceProjects).omit({
  id: true,
  createdAt: true,
});

export const insertTeamRoleSchema = createInsertSchema(teamRoles).omit({
  id: true,
  updatedAt: true,
});

export const insertSettingSchema = createInsertSchema(settings).omit({
  id: true,
  updatedAt: true,
});

// Специальная схема для Telegram настроек
export const telegramSettingsSchema = z.object({
  telegram_bot_token: z.string().optional(),
  telegram_chat_id: z.string().optional(),
});

// Типы
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contacts.$inferSelect;
export type InsertTechnology = z.infer<typeof insertTechnologySchema>;
export type Technology = typeof technologies.$inferSelect;
export type InsertPortfolioProject = z.infer<typeof insertPortfolioProjectSchema>;
export type PortfolioProject = typeof portfolioProjects.$inferSelect;
export type InsertServiceProject = z.infer<typeof insertServiceProjectSchema>;
export type ServiceProject = typeof serviceProjects.$inferSelect;
export type InsertTeamRole = z.infer<typeof insertTeamRoleSchema>;
export type TeamRole = typeof teamRoles.$inferSelect;
export type InsertSetting = z.infer<typeof insertSettingSchema>;
export type Setting = typeof settings.$inferSelect;
export type TelegramSettings = z.infer<typeof telegramSettingsSchema>;
