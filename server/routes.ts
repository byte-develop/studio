import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertContactSchema,
  insertTechnologySchema,
  insertPortfolioProjectSchema,
  insertServiceProjectSchema,
  insertTeamRoleSchema,
  telegramSettingsSchema
} from "@shared/schema";
import { z } from "zod";
import { telegramService } from "./telegram";

export async function registerRoutes(app: Express): Promise<Server> {
  // Contact form submission
  app.post("/api/contacts", async (req, res) => {
    try {
      const contactData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(contactData);
      
      // Send Telegram notification (don't fail if it doesn't work)
      telegramService.sendContactNotification(contact).catch(err => {
        console.error('Failed to send Telegram notification:', err);
      });
      
      res.json({ success: true, contact });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid form data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to submit contact form" });
      }
    }
  });

  // Get all contacts (for admin purposes)
  app.get("/api/contacts", async (req, res) => {
    try {
      const contacts = await storage.getContacts();
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve contacts" });
    }
  });

  // Technology routes
  app.get("/api/technologies", async (req, res) => {
    try {
      const technologies = await storage.getTechnologies();
      res.json(technologies);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve technologies" });
    }
  });

  app.post("/api/technologies", async (req, res) => {
    try {
      const technologyData = insertTechnologySchema.parse(req.body);
      const technology = await storage.createTechnology(technologyData);
      res.json(technology);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create technology" });
      }
    }
  });

  app.put("/api/technologies/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = insertTechnologySchema.partial().parse(req.body);
      const technology = await storage.updateTechnology(id, updateData);
      res.json(technology);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid data", details: error.errors });
      } else {
        res.status(404).json({ error: "Technology not found" });
      }
    }
  });

  app.delete("/api/technologies/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteTechnology(id);
      res.json({ success: true });
    } catch (error) {
      res.status(404).json({ error: "Technology not found" });
    }
  });

  // Portfolio project routes
  app.get("/api/portfolio-projects", async (req, res) => {
    try {
      const projects = await storage.getPortfolioProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve portfolio projects" });
    }
  });

  app.post("/api/portfolio-projects", async (req, res) => {
    try {
      const projectData = insertPortfolioProjectSchema.parse(req.body);
      const project = await storage.createPortfolioProject(projectData);
      res.json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create portfolio project" });
      }
    }
  });

  app.put("/api/portfolio-projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = insertPortfolioProjectSchema.partial().parse(req.body);
      const project = await storage.updatePortfolioProject(id, updateData);
      res.json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid data", details: error.errors });
      } else {
        res.status(404).json({ error: "Portfolio project not found" });
      }
    }
  });

  app.delete("/api/portfolio-projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deletePortfolioProject(id);
      res.json({ success: true });
    } catch (error) {
      res.status(404).json({ error: "Portfolio project not found" });
    }
  });

  // Service project routes
  app.get("/api/service-projects", async (req, res) => {
    try {
      const serviceType = req.query.serviceType as string;
      const projects = await storage.getServiceProjects(serviceType);
      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve service projects" });
    }
  });

  app.post("/api/service-projects", async (req, res) => {
    try {
      const projectData = insertServiceProjectSchema.parse(req.body);
      const project = await storage.createServiceProject(projectData);
      res.json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create service project" });
      }
    }
  });

  app.put("/api/service-projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = insertServiceProjectSchema.partial().parse(req.body);
      const project = await storage.updateServiceProject(id, updateData);
      res.json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid data", details: error.errors });
      } else {
        res.status(404).json({ error: "Service project not found" });
      }
    }
  });

  app.delete("/api/service-projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteServiceProject(id);
      res.json({ success: true });
    } catch (error) {
      res.status(404).json({ error: "Service project not found" });
    }
  });

  // Team role routes
  app.get("/api/team-roles", async (req, res) => {
    try {
      const roles = await storage.getTeamRoles();
      res.json(roles);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve team roles" });
    }
  });

  app.post("/api/team-roles", async (req, res) => {
    try {
      const roleData = insertTeamRoleSchema.parse(req.body);
      const role = await storage.createTeamRole(roleData);
      res.json(role);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create team role" });
      }
    }
  });

  app.put("/api/team-roles/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = insertTeamRoleSchema.partial().parse(req.body);
      const role = await storage.updateTeamRole(id, updateData);
      res.json(role);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid data", details: error.errors });
      } else {
        res.status(404).json({ error: "Team role not found" });
      }
    }
  });

  app.delete("/api/team-roles/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteTeamRole(id);
      res.json({ success: true });
    } catch (error) {
      res.status(404).json({ error: "Team role not found" });
    }
  });

  // Settings routes - Get all settings
  app.get("/api/settings", async (req, res) => {
    try {
      const allSettings = await storage.getSettings();
      res.json(allSettings);
    } catch (error) {
      res.status(500).json({ error: "Failed to retrieve settings" });
    }
  });

  // Settings routes - Update Telegram settings
  app.post("/api/settings/telegram", async (req, res) => {
    try {
      const telegramData = telegramSettingsSchema.parse(req.body);
      const updatedSettings = [];

      if (telegramData.telegram_bot_token) {
        const botTokenSetting = await storage.setSetting('telegram_bot_token', telegramData.telegram_bot_token);
        updatedSettings.push(botTokenSetting);
      }

      if (telegramData.telegram_chat_id) {
        const chatIdSetting = await storage.setSetting('telegram_chat_id', telegramData.telegram_chat_id);
        updatedSettings.push(chatIdSetting);
      }

      res.json({ success: true, settings: updatedSettings });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid settings data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to update Telegram settings" });
      }
    }
  });

  // Get Telegram settings status
  app.get("/api/settings/telegram/status", async (req, res) => {
    try {
      const botToken = await storage.getSetting('telegram_bot_token');
      const chatId = await storage.getSetting('telegram_chat_id');
      
      res.json({
        bot_token_configured: !!botToken?.value,
        chat_id_configured: !!chatId?.value,
        last_updated: Math.max(
          botToken?.updatedAt?.getTime() || 0,
          chatId?.updatedAt?.getTime() || 0
        )
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to check Telegram settings status" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
