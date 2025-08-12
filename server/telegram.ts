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
      'Новая заявка с сайта VERTEX Studio!',
      '',
      `Имя: ${contact.name || 'Не указано'}`,
      `Email: ${contact.email || 'Не указан'}`,
    ];

    if (contact.company) {
      lines.push(`Компания: ${contact.company}`);
    }

    if (contact.phone) {
      lines.push(`Телефон: ${contact.phone}`);
    }

    if (contact.service) {
      lines.push(`Услуга: ${contact.service}`);
    }

    if (contact.budget) {
      lines.push(`Бюджет: ${contact.budget}`);
    }

    if (contact.message) {
      lines.push('');
      lines.push('Сообщение:');
      lines.push(contact.message);
    }

    lines.push('');
    lines.push(`Дата: ${contact.createdAt ? new Date(contact.createdAt).toLocaleString('ru-RU') : new Date().toLocaleString('ru-RU')}`);

    return lines.join('\n');
  }

  async sendContactNotification(contact: Contact): Promise<boolean> {
    if (!this.botToken || !this.chatId) {
      console.error('Telegram bot token or chat ID not configured');
      return false;
    }

    const message = this.formatContactMessage(contact);
    const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`;

    console.log('Sending Telegram message with length:', message.length);
    console.log('Message content:', JSON.stringify(message));

    try {
      // Попробуем сначала простое сообщение
      const testResponse = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: this.chatId,
          text: 'Тест: новая заявка получена',
        }),
      });

      if (testResponse.ok) {
        console.log('Test message sent successfully, trying full message...');
        
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat_id: this.chatId,
            text: message,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Failed to send full Telegram message:', errorText);
          return false;
        }

        console.log('Full Telegram notification sent successfully');
        return true;
      } else {
        const errorText = await testResponse.text();
        console.error('Failed to send test Telegram message:', errorText);
        return false;
      }
    } catch (error) {
      console.error('Error sending Telegram notification:', error);
      return false;
    }
  }
}

export const telegramService = new TelegramService();