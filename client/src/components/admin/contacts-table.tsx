import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Mail, Phone, Building } from 'lucide-react';
import type { Contact } from '@shared/schema';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useState } from 'react';

interface ContactsTableProps {
  contacts: Contact[];
}

interface ContactDetailsDialogProps {
  contact: Contact;
  children: React.ReactNode;
}

function ContactDetailsDialog({ contact, children }: ContactDetailsDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle>Заявка от {contact.name}</DialogTitle>
          <DialogDescription>
            Получена {contact.createdAt ? format(new Date(contact.createdAt), 'dd MMMM yyyy в HH:mm', { locale: ru }) : 'Дата неизвестна'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-gray-400">Email:</span>
              </div>
              <p className="font-medium">{contact.email}</p>
            </div>

            {contact.phone && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-gray-400">Телефон:</span>
                </div>
                <p className="font-medium">{contact.phone}</p>
              </div>
            )}

            {contact.company && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-gray-400">Компания:</span>
                </div>
                <p className="font-medium">{contact.company}</p>
              </div>
            )}

            {contact.service && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">Услуга:</span>
                </div>
                <Badge variant="secondary">{contact.service}</Badge>
              </div>
            )}

            {contact.budget && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">Бюджет:</span>
                </div>
                <Badge className="bg-green-600">{contact.budget}</Badge>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <span className="text-sm text-gray-400">Сообщение:</span>
            <div className="p-4 bg-gray-800 rounded-lg">
              <p className="whitespace-pre-wrap">{contact.message}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ContactsTable({ contacts }: ContactsTableProps) {
  if (contacts.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        Заявки пока не поступали
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-gray-700">
            <TableHead className="text-gray-300">Имя</TableHead>
            <TableHead className="text-gray-300">Email</TableHead>
            <TableHead className="text-gray-300">Услуга</TableHead>
            <TableHead className="text-gray-300">Бюджет</TableHead>
            <TableHead className="text-gray-300">Дата</TableHead>
            <TableHead className="text-gray-300 text-right">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.map((contact) => (
            <TableRow key={contact.id} className="border-gray-700">
              <TableCell className="font-medium" data-testid={`contact-name-${contact.id}`}>
                {contact.name}
                {contact.company && (
                  <div className="text-sm text-gray-400">{contact.company}</div>
                )}
              </TableCell>
              <TableCell data-testid={`contact-email-${contact.id}`}>
                {contact.email}
                {contact.phone && (
                  <div className="text-sm text-gray-400">{contact.phone}</div>
                )}
              </TableCell>
              <TableCell data-testid={`contact-service-${contact.id}`}>
                {contact.service ? (
                  <Badge variant="secondary">{contact.service}</Badge>
                ) : (
                  <span className="text-gray-500">Не указана</span>
                )}
              </TableCell>
              <TableCell data-testid={`contact-budget-${contact.id}`}>
                {contact.budget ? (
                  <Badge className="bg-green-600">{contact.budget}</Badge>
                ) : (
                  <span className="text-gray-500">Не указан</span>
                )}
              </TableCell>
              <TableCell data-testid={`contact-date-${contact.id}`}>
                {contact.createdAt ? (
                  <div>
                    <div>{format(new Date(contact.createdAt), 'dd.MM.yyyy', { locale: ru })}</div>
                    <div className="text-sm text-gray-400">
                      {format(new Date(contact.createdAt), 'HH:mm', { locale: ru })}
                    </div>
                  </div>
                ) : (
                  <span className="text-gray-500">Неизвестно</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <ContactDetailsDialog contact={contact}>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-8 w-8 p-0"
                    data-testid={`button-view-contact-${contact.id}`}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </ContactDetailsDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}