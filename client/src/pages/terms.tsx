import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { ArrowLeft, FileText } from 'lucide-react';

export function TermsPage() {
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
                <FileText className="w-6 h-6 text-neon-cyan" />
              </div>
              <h1 className="text-3xl md:text-4xl font-light">
                Пользовательское <span className="text-neon-cyan">соглашение</span>
              </h1>
            </div>
            <p className="text-gray-400 text-lg">
              Условия использования услуг HNS (Hidden Network Service)
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Дата последнего обновления: {new Date().toLocaleDateString('ru-RU')}
            </p>
          </div>

          {/* Terms Content */}
          <div className="space-y-8">
            <section className="glass-morphism rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-neon-cyan mb-4">1. Общие положения</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Настоящее Пользовательское соглашение (далее — «Соглашение») является официальным предложением 
                HNS (Hidden Network Service) (далее — «Компания») для пользователей сети Интернет (далее — «Пользователи») 
                относительно использования сайта и услуг Компании.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Используя сайт и/или заказывая услуги Компании, Пользователь подтверждает, что ознакомился 
                с условиями настоящего Соглашения и принимает их в полном объеме.
              </p>
            </section>

            <section className="glass-morphism rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-neon-cyan mb-4">2. Определения</h2>
              <ul className="space-y-3 text-gray-300">
                <li><strong>Сайт</strong> — интернет-ресурс, расположенный по адресу hns.dev</li>
                <li><strong>Услуги</strong> — разработка веб-сайтов, мобильных приложений, 3D/WebGL решений, backend систем, AI/ML решений</li>
                <li><strong>Заказчик</strong> — физическое или юридическое лицо, заказывающее услуги Компании</li>
                <li><strong>Исполнитель</strong> — HNS (Hidden Network Service)</li>
              </ul>
            </section>

            <section className="glass-morphism rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-neon-cyan mb-4">3. Предмет соглашения</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Компания оказывает следующие услуги:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>Веб-разработка (фронтенд и фулстек решения)</li>
                <li>3D и WebGL разработка</li>
                <li>Мобильная разработка</li>
                <li>Backend и API разработка</li>
                <li>Разработка AI/ML решений</li>
                <li>DevOps и облачные решения</li>
                <li>Техническое консультирование</li>
              </ul>
            </section>

            <section className="glass-morphism rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-neon-cyan mb-4">4. Права и обязанности сторон</h2>
              
              <h3 className="text-xl font-medium text-white mb-3">4.1. Исполнитель обязуется:</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4 mb-6">
                <li>Выполнять услуги качественно и в установленные сроки</li>
                <li>Консультировать Заказчика по вопросам выполнения заказа</li>
                <li>Соблюдать конфиденциальность информации Заказчика</li>
                <li>Предоставлять техническую поддержку в рамках договоренностей</li>
              </ul>

              <h3 className="text-xl font-medium text-white mb-3">4.2. Заказчик обязуется:</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>Предоставить полную и достоверную информацию для выполнения заказа</li>
                <li>Своевременно производить оплату услуг</li>
                <li>Предоставить необходимые материалы и доступы</li>
                <li>Согласовывать промежуточные результаты работы</li>
              </ul>
            </section>

            <section className="glass-morphism rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-neon-cyan mb-4">5. Оплата услуг</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Стоимость услуг определяется индивидуально для каждого проекта и указывается в коммерческом предложении.
                Оплата производится согласно выставленным счетам в соответствии с условиями договора.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Все цены указаны в российских рублях и не включают НДС (при наличии).
              </p>
            </section>

            <section className="glass-morphism rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-neon-cyan mb-4">6. Интеллектуальная собственность</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Все права на результаты выполненных работ переходят к Заказчику после полной оплаты услуг, 
                если иное не предусмотрено отдельным соглашением.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Исполнитель сохраняет за собой право использовать общие методы, идеи и концепции, 
                применявшиеся при выполнении работ, в своей дальнейшей деятельности.
              </p>
            </section>

            <section className="glass-morphism rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-neon-cyan mb-4">7. Ответственность</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Исполнитель несет ответственность за качество выполненных работ в соответствии с техническим заданием.
                Ответственность сторон ограничивается суммой заказа.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Исполнитель не несет ответственности за косвенные убытки, упущенную выгоду или 
                любые другие последствия, связанные с использованием результатов работы.
              </p>
            </section>

            <section className="glass-morphism rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-neon-cyan mb-4">8. Заключительные положения</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Все споры разрешаются путем переговоров, а при невозможности достижения соглашения — 
                в судебном порядке в соответствии с законодательством Российской Федерации.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Настоящее Соглашение вступает в силу с момента начала использования сайта или услуг Компании 
                и действует до момента прекращения такого использования.
              </p>
            </section>

            <section className="glass-morphism rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-neon-cyan mb-4">9. Контактная информация</h2>
              <p className="text-gray-300 leading-relaxed">
                По всем вопросам, связанным с настоящим Соглашением, Вы можете обратиться к нам:
              </p>
              <div className="mt-4 p-4 bg-white/5 rounded-lg">
                <p className="text-white font-medium">HNS (Hidden Network Service)</p>
                <p className="text-gray-300">Email: info@hns.dev</p>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}