import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { ArrowLeft, Shield } from 'lucide-react';

export function PrivacyPage() {
  return (
    <div className="min-h-screen bg-deep-black text-white">
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-deep-black/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <Link href="/">
            <a className="flex items-center gap-2 text-neon-cyan hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
              Вернуться на главную
            </a>
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div className="container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-12 h-12 bg-neon-cyan/10 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-neon-cyan" />
              </div>
              <h1 className="text-3xl md:text-4xl font-light">
                Политика <span className="text-neon-cyan">конфиденциальности</span>
              </h1>
            </div>
            <p className="text-gray-400 text-lg">
              Защита и обработка персональных данных в VERTEX Studio
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Дата последнего обновления: {new Date().toLocaleDateString('ru-RU')}
            </p>
          </div>

          {/* Privacy Content */}
          <div className="space-y-8">
            <section className="glass-morphism rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-neon-cyan mb-4">1. Общие положения</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Настоящая Политика конфиденциальности (далее — «Политика») определяет порядок обработки 
                и защиты персональных данных пользователей сайта VERTEX Studio (далее — «Сайт»).
              </p>
              <p className="text-gray-300 leading-relaxed">
                Мы серьезно относимся к защите ваших персональных данных и обязуемся обеспечивать их безопасность 
                в соответствии с требованиями действующего законодательства Российской Федерации.
              </p>
            </section>

            <section className="glass-morphism rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-neon-cyan mb-4">2. Сбор персональных данных</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Мы собираем только те персональные данные, которые необходимы для предоставления наших услуг:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>Имя и фамилия</li>
                <li>Адрес электронной почты</li>
                <li>Номер телефона</li>
                <li>Название компании (по желанию)</li>
                <li>Информация о проекте</li>
                <li>Технические данные (IP-адрес, тип браузера, время посещения)</li>
              </ul>
            </section>

            <section className="glass-morphism rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-neon-cyan mb-4">3. Цели обработки данных</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Ваши персональные данные обрабатываются нами в следующих целях:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>Обработка заявок и обращений</li>
                <li>Предоставление информации об услугах</li>
                <li>Заключение и исполнение договоров</li>
                <li>Техническая поддержка клиентов</li>
                <li>Улучшение качества услуг</li>
                <li>Рассылка информационных материалов (с вашего согласия)</li>
                <li>Выполнение требований законодательства</li>
              </ul>
            </section>

            <section className="glass-morphism rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-neon-cyan mb-4">4. Правовые основания обработки</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Обработка персональных данных осуществляется на следующих правовых основаниях:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>Согласие субъекта персональных данных</li>
                <li>Исполнение договора, стороной которого является субъект персональных данных</li>
                <li>Осуществление прав и законных интересов оператора</li>
                <li>Исполнение возложенных законом обязанностей</li>
              </ul>
            </section>

            <section className="glass-morphism rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-neon-cyan mb-4">5. Передача данных третьим лицам</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Мы не передаем ваши персональные данные третьим лицам, за исключением следующих случаев:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>С вашего прямого согласия</li>
                <li>По требованию уполномоченных государственных органов</li>
                <li>Передача обезличенных данных для целей аналитики</li>
                <li>Передача данных нашим подрядчикам для выполнения договорных обязательств</li>
              </ul>
            </section>

            <section className="glass-morphism rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-neon-cyan mb-4">6. Безопасность данных</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Мы применяем технические и организационные меры для защиты ваших персональных данных:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>Шифрование данных при передаче (SSL/TLS)</li>
                <li>Ограничение доступа к персональным данным</li>
                <li>Регулярное обновление систем безопасности</li>
                <li>Мониторинг несанкционированного доступа</li>
                <li>Обучение сотрудников правилам обработки персональных данных</li>
              </ul>
            </section>

            <section className="glass-morphism rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-neon-cyan mb-4">7. Ваши права</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                В отношении ваших персональных данных вы имеете право:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>Получать информацию об обработке ваших персональных данных</li>
                <li>Требовать уточнения, блокирования или уничтожения данных</li>
                <li>Отзывать согласие на обработку персональных данных</li>
                <li>Обращаться с жалобами в уполномоченный орган по защите прав субъектов персональных данных</li>
                <li>Получать копию ваших персональных данных</li>
              </ul>
            </section>

            <section className="glass-morphism rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-neon-cyan mb-4">8. Файлы cookies</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Наш сайт использует файлы cookies для улучшения пользовательского опыта:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4 mb-4">
                <li>Технические cookies (необходимы для работы сайта)</li>
                <li>Аналитические cookies (для анализа посещаемости)</li>
                <li>Функциональные cookies (для сохранения настроек)</li>
              </ul>
              <p className="text-gray-300 leading-relaxed">
                Вы можете управлять использованием cookies в настройках вашего браузера.
              </p>
            </section>

            <section className="glass-morphism rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-neon-cyan mb-4">9. Хранение данных</h2>
              <p className="text-gray-300 leading-relaxed">
                Персональные данные хранятся в течение периода, необходимого для достижения целей их обработки, 
                либо в течение срока, установленного законодательством. После истечения указанного срока 
                персональные данные подлежат уничтожению.
              </p>
            </section>

            <section className="glass-morphism rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-neon-cyan mb-4">10. Изменения в политике</h2>
              <p className="text-gray-300 leading-relaxed">
                Мы оставляем за собой право вносить изменения в настоящую Политику. 
                О любых изменениях мы уведомим вас путем размещения обновленной версии на нашем сайте. 
                Рекомендуем регулярно просматривать данную страницу для ознакомления с актуальной информацией.
              </p>
            </section>

            <section className="glass-morphism rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-neon-cyan mb-4">11. Контактная информация</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                По вопросам обработки персональных данных вы можете обратиться к нам:
              </p>
              <div className="p-4 bg-white/5 rounded-lg">
                <p className="text-white font-medium">VERTEX Studio</p>
                <p className="text-gray-300">Email: hello@vertexstudio.dev</p>
                <p className="text-gray-300 mt-2">
                  Ответственный за обработку персональных данных: администратор сайта
                </p>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}