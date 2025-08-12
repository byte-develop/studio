import type { Contact } from "@shared/schema";

export class TelegramService {
  private botToken: string;
  private chatId: string;

  constructor() {
    this.botToken = process.env.TELEGRAM_BOT_TOKEN || '';
    this.chatId = process.env.TELEGRAM_CHAT_ID || '';
  }

  private formatContactMessage(contact: Contact): string {
    const lines = [
      '🔥 *Новая заявка с сайта VERTEX Studio!*',
      '',
      `👤 *Имя:* ${contact.name}`,
      `📧 *Email:* ${contact.email}`,
    ];

    if (contact.company) {
      lines.push(`🏢 *Компания:* ${contact.company}`);
    }

    if (contact.phone) {
      lines.push(`📱 *Телефон:* ${contact.phone}`);
    }

    if (contact.service) {
      lines.push(`🛠 *Услуга:* ${contact.service}`);
    }

    if (contact.budget) {
      lines.push(`💰 *Бюджет:* ${contact.budget}`);
    }

    lines.push('');
    lines.push(`💬 *Сообщение:*`);
    lines.push(contact.message);

    lines.push('');
    lines.push(`📅 *Дата:* ${contact.createdAt ? new Date(contact.createdAt).toLocaleString('ru-RU') : 'Не указана'}`);

    return lines.join('\n');
  }

  async sendContactNotification(contact: Contact): Promise<boolean> {
    if (!this.botToken || !this.chatId) {
      console.error('Telegram bot token or chat ID not configured');
      return false;
    }

    const message = this.formatContactMessage(contact);
    const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: this.chatId,
          text: message,
          parse_mode: 'Markdown',
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