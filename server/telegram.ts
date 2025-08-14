import type { Contact } from "@shared/schema";
import { storage } from "./storage";

export class TelegramService {
  private async getBotToken(): Promise<string> {
    const setting = await storage.getSetting('telegram_bot_token');
    return setting?.value || process.env.TELEGRAM_BOT_TOKEN || '';
  }

  private async getChatId(): Promise<string> {
    const setting = await storage.getSetting('telegram_chat_id');
    return setting?.value || process.env.TELEGRAM_CHAT_ID || '';
  }

  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  private formatContactMessage(contact: Contact): string {
    const lines = [
      '🔥 <b>Новая заявка с сайта VERTEX Studio!</b>',
      '',
      `👤 <b>Имя:</b> ${this.escapeHtml(contact.name || 'Не указано')}`,
      `📧 <b>Email:</b> ${this.escapeHtml(contact.email || 'Не указан')}`,
    ];

    if (contact.company) {
      lines.push(`🏢 <b>Компания:</b> ${this.escapeHtml(contact.company)}`);
    }

    if (contact.phone) {
      lines.push(`📱 <b>Телефон:</b> ${this.escapeHtml(contact.phone)}`);
    }

    if (contact.service) {
      lines.push(`🛠 <b>Услуга:</b> ${this.escapeHtml(contact.service)}`);
    }

    if (contact.budget) {
      lines.push(`💰 <b>Бюджет:</b> ${this.escapeHtml(contact.budget)}`);
    }

    if (contact.message) {
      lines.push('');
      lines.push('💬 <b>Сообщение:</b>');
      lines.push(`<i>${this.escapeHtml(contact.message)}</i>`);
    }

    lines.push('');
    lines.push(`📅 <b>Дата:</b> ${contact.createdAt ? new Date(contact.createdAt).toLocaleString('ru-RU') : new Date().toLocaleString('ru-RU')}`);

    return lines.join('\n');
  }

  async sendContactNotification(contact: Contact): Promise<boolean> {
    const botToken = await this.getBotToken();
    const chatId = await this.getChatId();
    
    if (!botToken || !chatId) {
      console.error('Telegram bot token or chat ID not configured');
      return false;
    }

    const message = this.formatContactMessage(contact);
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;



    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML',
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to send Telegram message:', errorText);
        return false;
      }

      console.log('Telegram notification sent successfully');
      return true;
    } catch (error) {
      console.error('Error sending Telegram notification:', error);
      return false;
    }
  }
}

export const telegramService = new TelegramService();