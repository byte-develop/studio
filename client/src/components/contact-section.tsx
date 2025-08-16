import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { MapPin, Mail, Phone, Linkedin, Github, Twitter, Send, Clock, MessageCircle, HeadphonesIcon, Users } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { insertContactSchema, type InsertContact } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useScrollTrigger } from '@/hooks/use-scroll-trigger';
import { useLanguage } from '@/contexts/language-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

const contactInfo = [
  {
    icon: Mail,
    title: 'Email',
    description: 'info@hns.dev',
    action: 'mailto:info@hns.dev'
  }
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
  const { t, language } = useLanguage();

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
        title: t('contact.sendSuccess'),
        description: t('contact.sendSuccessDesc'),
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/contacts'] });
    },
    onError: (error: any) => {
      toast({
        title: t('contact.sendError'),
        description: error.message || t('contact.sendErrorDesc'),
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
    <section ref={elementRef} id="contact" className="py-16 md:py-24 lg:py-32 relative bg-dark-gray">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={hasTriggered ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light mb-6 text-3d">
            {t('contact.title').split(' ').slice(0, -2).join(' ')} <span className="text-neon-cyan">{t('contact.title').split(' ').slice(-2).join(' ')}</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
            {t('contact.subtitle')}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={hasTriggered ? "visible" : "hidden"}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start lg:items-center"
        >
          <div className="space-y-8">
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                variants={itemVariants}
                whileHover={{ x: 10, scale: 1.02 }}
                className="floating-card glass-morphism p-6 rounded-2xl cursor-pointer"
                onClick={() => info.action && info.action !== '#' && (window.location.href = info.action)}
              >
                <div className="flex items-center space-x-4">
                  <div
                    className="w-12 h-12 bg-neon-cyan/10 rounded-xl flex items-center justify-center"
                  >
                    <info.icon className="w-5 h-5 text-neon-cyan" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">{info.title}</h4>
                    <p className="text-gray-400">{info.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}

            <motion.div variants={itemVariants} className="pt-8">
              <h4 className="font-medium mb-4">{t('contact.followUs')}</h4>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="w-12 h-12 glass-morphism rounded-xl flex items-center justify-center hover:bg-neon-cyan/20 transition-all"
                  >
                    <social.icon className="w-5 h-5 text-neon-cyan" />
                  </a>
                ))}
              </div>
            </motion.div>

            <motion.div 
              variants={itemVariants} 
              className="floating-card glass-morphism p-6 rounded-2xl border border-neon-cyan/20"
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-neon-cyan/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <HeadphonesIcon className="w-5 h-5 text-neon-cyan" />
                </div>
                <div>
                  <h4 className="font-medium mb-2 text-neon-cyan">{t('contact.quickResponse')}</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {t('contact.quickResponseDesc')}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              variants={itemVariants} 
              className="floating-card glass-morphism p-6 rounded-2xl border border-neon-purple/20"
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-neon-purple/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-neon-purple" />
                </div>
                <div>
                  <h4 className="font-medium mb-2 text-neon-purple">{t('contact.personalManager')}</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {t('contact.personalManagerDesc')}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            variants={itemVariants}
            className="floating-card glass-morphism p-6 lg:p-8 rounded-3xl"
          >
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t('contact.name')} *
                  </label>
                  <Input
                    {...form.register('name')}
                    placeholder={t('contact.yourName')}
                  />
                  {form.formState.errors.name && (
                    <p className="text-red-400 text-sm mt-1">
                      {form.formState.errors.name.message}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t('contact.company')}
                  </label>
                  <Input
                    {...form.register('company')}
                    placeholder={t('contact.companyName')}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t('contact.email')} *
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
                    {t('contact.phone')}
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
                  {t('contact.service')}
                </label>
                <Select onValueChange={(value) => form.setValue('service', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('contact.selectService')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="web-dev">{t('services.webDevelopment')}</SelectItem>
                    <SelectItem value="3d-webgl">{t('services.3dWebgl')}</SelectItem>
                    <SelectItem value="mobile">{t('services.mobileDevelopment')}</SelectItem>
                    <SelectItem value="backend">{t('services.backendApi')}</SelectItem>
                    <SelectItem value="ai-ml">{t('services.aiMl')}</SelectItem>
                    <SelectItem value="devops">{t('services.devopsCloud')}</SelectItem>
                    <SelectItem value="consulting">{t('contact.consulting')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('contact.budget')}
                </label>
                <Select onValueChange={(value) => form.setValue('budget', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('contact.selectBudget')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="50k-100k">{t('contact.budget50k100k')}</SelectItem>
                    <SelectItem value="100k-500k">{t('contact.budget100k500k')}</SelectItem>
                    <SelectItem value="500k-1m">{t('contact.budget500k1m')}</SelectItem>
                    <SelectItem value="1m+">{t('contact.budget1mPlus')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('contact.message')} *
                </label>
                <Textarea
                  {...form.register('message')}
                  rows={4}
                  placeholder={t('contact.projectMessage')}
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
                  {t('contact.privacyAgree')}{' '}
                  <a href="/privacy" className="text-neon-cyan hover:underline">
                    {t('contact.privacyPolicy')}
                  </a>{' '}
                  {language === 'ru' ? 'и' : 'and'}{' '}
                  <a href="/terms" className="text-neon-cyan hover:underline">
                    {t('contact.userAgreement')}
                  </a>
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
                      {isSubmitting ? t('contact.sending') : t('contact.send')}
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
