import React, { useState } from 'react';
import { X, CheckCircle, Send, Sparkles, Shield, Download, FileText } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AuditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuditModal: React.FC<AuditModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [siteOrNiche, setSiteOrNiche] = useState('');
  const [contact, setContact] = useState('');
  const [region, setRegion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contact.trim() || !siteOrNiche.trim()) {
      setError('Пожалуйста, заполните имя, контакт и нишу/сайт.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }, 600);
  };

  const handleReset = () => {
    setIsSuccess(false);
    setName('');
    setSiteOrNiche('');
    setContact('');
    setRegion('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl border border-neutral-800 bg-neutral-900 p-6 sm:p-8 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          aria-label="Закрыть"
        >
          <X className="h-5 w-5" />
        </button>

        {!isSuccess ? (
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 mb-2">
              <Sparkles className="h-4 w-4" />
              <span>БЕСПЛАТНЫЙ ЭКСПРЕСС-АУДИТ</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
              Узнайте емкость готового спроса в Google для вашей ниши
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 mb-6 leading-relaxed">
              Мы соберем семантическую карту транзакционных ключей, рассчитаем потенциальный объем заказов и покажем точки потери конверсий.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-xs text-red-300 bg-red-950/50 border border-red-800 rounded-lg">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Ваше имя:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Константин"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl bg-neutral-950 border border-neutral-800 px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Ссылка на сайт или ниша бизнеса:
                </label>
                <input
                  type="text"
                  required
                  placeholder="mysite.com или «Производство диванов»"
                  value={siteOrNiche}
                  onChange={(e) => setSiteOrNiche(e.target.value)}
                  className="w-full rounded-xl bg-neutral-950 border border-neutral-800 px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Телефон или Telegram:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+380... / @username"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="w-full rounded-xl bg-neutral-950 border border-neutral-800 px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Регион продвижения:
                  </label>
                  <input
                    type="text"
                    placeholder="Киев / Вся страна"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full rounded-xl bg-neutral-950 border border-neutral-800 px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-[0.99] cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Формирование расчета...</span>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Получить карту спроса и аудит</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-500 text-center pt-2">
                <Shield className="h-3.5 w-3.5 text-neutral-400" />
                <span>Данные строго конфиденциальны. Без спама и спам-звонков.</span>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-4 space-y-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <CheckCircle className="h-6 w-6" />
            </div>

            <h3 className="text-xl font-bold text-white">
              Заявка принята, {name}!
            </h3>

            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-sm mx-auto">
              Мы начали экспресс-анализ поисковых запросов для <strong>{siteOrNiche}</strong>. Наш ведущий специалист свяжется с вами в {contact} в течение 2 рабочих часов.
            </p>

            <div className="rounded-xl bg-neutral-950 border border-neutral-800 p-4 text-left space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-400">
                <FileText className="h-4 w-4" />
                <span>Ваш подарок готов к изучению:</span>
              </div>
              <p className="text-xs text-neutral-300">
                «Чек-лист: 35 транзакционных ключей и факторов доверия в Google для роста конверсии в 4+ раза».
              </p>
              <button
                type="button"
                onClick={() => {
                  alert('Гайд успешно отправлен на указанный контакт!');
                }}
                className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer pt-1"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Скачать PDF-руководство</span>
              </button>
            </div>

            <button
              onClick={handleReset}
              className="px-6 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold cursor-pointer"
            >
              Вернуться к статье
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
