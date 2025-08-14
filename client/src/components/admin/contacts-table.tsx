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
        <div className="mx-auto w-24 h-24 bg-gray-800/50 rounded-full flex items-center justify-center mb-4">
          <Mail className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-400 text-lg">Заявок пока нет</p>
        <p className="text-gray-500 text-sm mt-1">Новые обращения клиентов появятся здесь</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {contacts.map((contact) => (
        <Card key={contact.id} className="group bg-gray-700/30 border-gray-600/50 hover:border-neon-cyan/50 hover:bg-gray-700/50 transition-all duration-300 overflow-hidden">
          <CardContent className="p-0">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center">
                    <Mail className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white group-hover:text-neon-cyan transition-colors">{contact.name}</h3>
                    <p className="text-sm text-gray-400">{contact.email}</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs border-gray-500/50 text-gray-400 bg-gray-800/50">
                  {contact.createdAt ? format(new Date(contact.createdAt), 'dd MMM yyyy, HH:mm', { locale: ru }) : 'Дата неизвестна'}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                {contact.phone && (
                  <div className="flex items-center gap-2 bg-gray-800/30 p-3 rounded-lg">
                    <Phone className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">{contact.phone}</span>
                  </div>
                )}
                
                {contact.company && (
                  <div className="flex items-center gap-2 bg-gray-800/30 p-3 rounded-lg">
                    <Building className="w-4 h-4 text-purple-400 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">{contact.company}</span>
                  </div>
                )}
                
                {contact.service && (
                  <div className="flex items-center gap-2 bg-gray-800/30 p-3 rounded-lg">
                    <Briefcase className="w-4 h-4 text-orange-400 flex-shrink-0" />
                    <Badge variant="secondary" className="text-xs bg-orange-500/20 text-orange-300 border-orange-500/30">
                      {contact.service}
                    </Badge>
                  </div>
                )}
                
                {contact.budget && (
                  <div className="flex items-center gap-2 bg-gray-800/30 p-3 rounded-lg">
                    <DollarSign className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                    <Badge variant="outline" className="text-xs border-yellow-500/50 text-yellow-300 bg-yellow-500/10">
                      {contact.budget}
                    </Badge>
                  </div>
                )}
              </div>
              
              {contact.message && (
                <div className="bg-gray-900/50 backdrop-blur-sm p-4 rounded-xl border border-gray-600/50 mt-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-gray-700/50">
                      <MessageSquare className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-300 text-sm leading-relaxed">{contact.message}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}