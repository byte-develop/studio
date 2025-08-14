import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import type { Contact } from '@shared/schema';
import { Mail, Phone, Building, MessageSquare, DollarSign, Briefcase } from 'lucide-react';

interface ContactsTableProps {
  contacts: Contact[];
}

export function ContactsTable({ contacts }: ContactsTableProps) {
  if (contacts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
          <Mail className="w-8 h-8 text-slate-400" />
        </div>
        <p className="text-slate-600 dark:text-slate-400 text-lg">Заявок пока нет</p>
        <p className="text-slate-500 dark:text-slate-500 text-sm mt-1">Новые обращения клиентов появятся здесь</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {contacts.map((contact) => (
        <div key={contact.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-6 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">{contact.name}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{contact.email}</p>
              </div>
            </div>
            <Badge variant="outline" className="text-xs text-slate-600 dark:text-slate-400">
              {contact.createdAt ? format(new Date(contact.createdAt), 'dd MMM yyyy, HH:mm', { locale: ru }) : 'Дата неизвестна'}
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
            {contact.phone && (
              <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <Phone className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                <span className="text-slate-700 dark:text-slate-300 text-sm">{contact.phone}</span>
              </div>
            )}
            
            {contact.company && (
              <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <Building className="w-4 h-4 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                <span className="text-slate-700 dark:text-slate-300 text-sm">{contact.company}</span>
              </div>
            )}
            
            {contact.service && (
              <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <Briefcase className="w-4 h-4 text-orange-600 dark:text-orange-400 flex-shrink-0" />
                <Badge className="text-xs bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300">
                  {contact.service}
                </Badge>
              </div>
            )}
            
            {contact.budget && (
              <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <DollarSign className="w-4 h-4 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                <Badge variant="outline" className="text-xs text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-600">
                  {contact.budget}
                </Badge>
              </div>
            )}
          </div>
          
          {contact.message && (
            <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg mt-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-slate-200 dark:bg-slate-600">
                  <MessageSquare className="w-4 h-4 text-slate-600 dark:text-slate-400 flex-shrink-0" />
                </div>
                <div className="flex-1">
                  <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">{contact.message}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}