import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Mail, Phone, Linkedin, Github, Twitter, Send } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { insertContactSchema, type InsertContact } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useScrollTrigger } from '@/hooks/use-scroll-trigger';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

const contactInfo = [
  {
    icon: MapPin,
    title: 'Адрес',
    description: 'Москва, ул. Технологическая, 15',
  },
  {
    icon: Mail,
    title: 'Email',
    description: 'hello@vertexstudio.dev',
  },
  {
    icon: Phone,
    title: 'Телефон',
    description: '+7 (495) 123-45-67',
  },
];

const socialLinks = [
  { icon: Linkedin, href: '#' },
  { icon: Github, href: '#' },
  { icon: Twitter, href: '#' },
];

export function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { elementRef, hasTriggered } = useScrollTrigger();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertContact>({
    resolver: zodResolver(insertContactSchema),
    defaultValues: {
      name: '',
      email: '',
      company: '',
      phone: '',
      service: '',
      budget: '',
      message: '',
    },
  });

  const contactMutation = useMutation({
    mutationFn: async (data: InsertContact) => {
      const response = await apiRequest('POST', '/api/contacts', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Сообщение отправлено!',
        description: 'Мы свяжемся с вами в ближайшее время.',
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/contacts'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Ошибка отправки',
        description: error.message || 'Попробуйте еще раз позже.',
        variant: 'destructive',
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const onSubmit = (data: InsertContact) => {
    setIsSubmitting(true);
    contactMutation.mutate(data);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  return (
    <section ref={elementRef} id="contact" className="py-32 relative bg-dark-gray">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={hasTriggered ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl font-light mb-6 text-3d">
            Свяжитесь <span className="text-neon-cyan">с Нами</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Готовы воплотить ваши идеи в передовые цифровые решения
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={hasTriggered ? "visible" : "hidden"}
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
        >
          <div className="space-y-8">
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                variants={itemVariants}
                whileHover={{ x: 10, scale: 1.02 }}
                className="floating-card glass-morphism p-6 rounded-2xl"
              >
                <div className="flex items-center space-x-4">
                  <motion.div
                    whileHover={{ rotateZ: 360 }}
                    transition={{ duration: 0.6 }}
                    className="w-12 h-12 bg-neon-cyan/10 rounded-xl flex items-center justify-center"
                  >
                    <info.icon className="w-5 h-5 text-neon-cyan" />
                  </motion.div>
                  <div>
                    <h4 className="font-medium mb-1">{info.title}</h4>
                    <p className="text-gray-400">{info.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}

            <motion.div variants={itemVariants} className="pt-8">
              <h4 className="font-medium mb-4">Следите за нами</h4>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    whileHover={{ scale: 1.2, rotateZ: 360 }}
                    transition={{ duration: 0.3 }}
                    className="w-12 h-12 glass-morphism rounded-xl flex items-center justify-center hover:bg-neon-cyan/20 transition-all"
                  >
                    <social.icon className="w-5 h-5 text-neon-cyan" />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div
            variants={itemVariants}
            className="floating-card glass-morphism p-8 rounded-3xl"
          >
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Имя *
                  </label>
                  <Input
                    {...form.register('name')}
                    placeholder="Ваше имя"
                  />
                  {form.formState.errors.name && (
                    <p className="text-red-400 text-sm mt-1">
                      {form.formState.errors.name.message}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Компания
                  </label>
                  <Input
                    {...form.register('company')}
                    placeholder="Название компании"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email *
                  </label>
                  <Input
                    {...form.register('email')}
                    type="email"
                    placeholder="your@email.com"
                  />
                  {form.formState.errors.email && (
                    <p className="text-red-400 text-sm mt-1">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Телефон
                  </label>
                  <Input
                    {...form.register('phone')}
                    type="tel"
                    placeholder="+7 (XXX) XXX-XX-XX"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Услуга
                </label>
                <Select onValueChange={(value) => form.setValue('service', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите услугу" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="web-dev">Веб-Разработка</SelectItem>
                    <SelectItem value="3d-webgl">3D и WebGL</SelectItem>
                    <SelectItem value="mobile">Мобильная Разработка</SelectItem>
                    <SelectItem value="backend">Backend & API</SelectItem>
                    <SelectItem value="ai-ml">ИИ и ML</SelectItem>
                    <SelectItem value="devops">DevOps & Cloud</SelectItem>
                    <SelectItem value="consulting">Консультации</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Бюджет проекта
                </label>
                <Select onValueChange={(value) => form.setValue('budget', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите диапазон" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="50k-100k">50,000 - 100,000 ₽</SelectItem>
                    <SelectItem value="100k-500k">100,000 - 500,000 ₽</SelectItem>
                    <SelectItem value="500k-1m">500,000 - 1,000,000 ₽</SelectItem>
                    <SelectItem value="1m+">1,000,000+ ₽</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Сообщение *
                </label>
                <Textarea
                  {...form.register('message')}
                  rows={4}
                  placeholder="Расскажите о вашем проекте..."
                  className="resize-none"
                />
                {form.formState.errors.message && (
                  <p className="text-red-400 text-sm mt-1">
                    {form.formState.errors.message.message}
                  </p>
                )}
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="privacy"
                  className="mt-1 border-gray-700 data-[state=checked]:bg-neon-cyan data-[state=checked]:border-neon-cyan"
                />
                <label htmlFor="privacy" className="text-sm text-gray-400">
                  Я согласен с{' '}
                  <a href="#" className="text-neon-cyan hover:underline">
                    политикой конфиденциальности
                  </a>{' '}
                  и обработкой персональных данных
                </label>
              </div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-neon-cyan text-deep-black font-medium py-4 px-8 rounded-xl hover:bg-neon-cyan/90 transition-all duration-300 group"
                >
                  <span className="flex items-center justify-center space-x-2">
                    <span>
                      {isSubmitting ? 'Отправляется...' : 'Отправить сообщение'}
                    </span>
                    <motion.div
                      animate={{ x: isSubmitting ? 0 : [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <Send className="w-4 h-4" />
                    </motion.div>
                  </span>
                </Button>
              </motion.div>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
