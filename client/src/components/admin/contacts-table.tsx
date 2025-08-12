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
      <div className="text-center py-8 text-gray-400">
        Заявок пока нет
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {contacts.map((contact) => (
        <Card key={contact.id} className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">{contact.name}</h3>
                  <Badge variant="outline" className="text-xs">
                    {contact.createdAt ? format(new Date(contact.createdAt), 'dd MMM yyyy, HH:mm', { locale: ru }) : 'Дата неизвестна'}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-400" />
                    <span className="text-gray-300">{contact.email}</span>
                  </div>
                  
                  {contact.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-green-400" />
                      <span className="text-gray-300">{contact.phone}</span>
                    </div>
                  )}
                  
                  {contact.company && (
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-purple-400" />
                      <span className="text-gray-300">{contact.company}</span>
                    </div>
                  )}
                  
                  {contact.service && (
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-orange-400" />
                      <Badge variant="secondary">{contact.service}</Badge>
                    </div>
                  )}
                  
                  {contact.budget && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-yellow-400" />
                      <Badge variant="outline">{contact.budget}</Badge>
                    </div>
                  )}
                </div>
                
                {contact.message && (
                  <div className="bg-gray-900 p-3 rounded-lg border border-gray-600">
                    <div className="flex items-start gap-2">
                      <MessageSquare className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                      <p className="text-gray-300 text-sm">{contact.message}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}