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
      <div className="text-center py-16">
        <div className="mx-auto w-20 h-20 bg-slate-700/50 rounded-full flex items-center justify-center mb-6">
          <Mail className="w-10 h-10 text-slate-400" />
        </div>
        <p className="text-slate-300 text-xl font-medium mb-2">Заявок пока нет</p>
        <p className="text-slate-400">Новые обращения клиентов появятся здесь</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {contacts.map((contact) => (
        <div key={contact.id} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] backdrop-blur-sm">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white text-xl">{contact.name}</h3>
                <p className="text-slate-300 text-lg">{contact.email}</p>
              </div>
            </div>
            <Badge className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-0 shadow-lg text-sm px-3 py-1">
              {contact.createdAt ? format(new Date(contact.createdAt), 'dd MMM yyyy, HH:mm', { locale: ru }) : 'Дата неизвестна'}
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {contact.phone && (
              <div className="flex items-center gap-3 p-4 bg-slate-700/30 rounded-xl border border-slate-600/30">
                <Phone className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-slate-200 font-medium">{contact.phone}</span>
              </div>
            )}
            
            {contact.company && (
              <div className="flex items-center gap-3 p-4 bg-slate-700/30 rounded-xl border border-slate-600/30">
                <Building className="w-5 h-5 text-purple-400 flex-shrink-0" />
                <span className="text-slate-200 font-medium">{contact.company}</span>
              </div>
            )}
            
            {contact.service && (
              <div className="flex items-center gap-3 p-4 bg-slate-700/30 rounded-xl border border-slate-600/30">
                <Briefcase className="w-5 h-5 text-orange-400 flex-shrink-0" />
                <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-lg">
                  {contact.service}
                </Badge>
              </div>
            )}
            
            {contact.budget && (
              <div className="flex items-center gap-3 p-4 bg-slate-700/30 rounded-xl border border-slate-600/30">
                <DollarSign className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <Badge className="bg-gradient-to-r from-emerald-500 to-green-500 text-white border-0 shadow-lg">
                  {contact.budget}
                </Badge>
              </div>
            )}
          </div>
          
          {contact.message && (
            <div className="mt-6">
              <div className="p-6 bg-slate-700/30 rounded-xl border border-slate-600/30">
                <div className="flex items-center gap-3 mb-4">
                  <MessageSquare className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  <span className="font-semibold text-slate-200">Сообщение:</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-lg">{contact.message}</p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}