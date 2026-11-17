import React, { useState } from 'react';
import { Phone, Mail, MapPin, ArrowRight, CheckCircle2, Loader2, Send } from 'lucide-react';
import { RainbowCloudDoodle, TeddyBearDoodle } from './Doodles';
import directorImg from '../assets/images/regenerated_image_1788332778294.jpg';
import { AnimatedText } from './AnimatedText';
import { db, collection, addDoc, serverTimestamp } from '../firebase';

export const QuickContactSection: React.FC = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<{
    name: string;
    email: string;
    phone: string;
    message: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.message) return;

    setIsSubmitting(true);
    const submissionData = { ...form };
    let emailSent = false;

    // 1. Dispatch form submission to info@thesilverhillsschools.com via FormSubmit AJAX service
    try {
      const response = await fetch('https://formsubmit.co/ajax/info@thesilverhillsschools.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          Name: submissionData.name,
          Email: submissionData.email,
          Phone: submissionData.phone,
          Message: submissionData.message,
          _subject: `New Inquiry from TSHS Website: ${submissionData.name} (${submissionData.phone})`,
          _replyto: submissionData.email,
          _template: 'table',
          _captcha: 'false',
        }),
      });

      if (response.ok) {
        emailSent = true;
      }
    } catch (err) {
      console.warn('FormSubmit AJAX notification notice:', err);
    }

    // 2. Also record in Firestore collection 'contactInquiries' so school staff never miss an inquiry
    try {
      await addDoc(collection(db, 'contactInquiries'), {
        name: submissionData.name.trim(),
        email: submissionData.email.trim(),
        phone: submissionData.phone.trim(),
        message: submissionData.message.trim(),
        recipient: 'info@thesilverhillsschools.com',
        emailSent,
        createdAt: serverTimestamp(),
        submittedAtStr: new Date().toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata',
          dateStyle: 'medium',
          timeStyle: 'short',
        }),
      });
    } catch (fsErr) {
      console.warn('Firestore contact inquiry backup note:', fsErr);
    }

    setIsSubmitting(false);
    setSubmitted(true);
    setSubmittedData(submissionData);
    setForm({ name: '', email: '', phone: '', message: '' });
  };

  const mailtoHref = submittedData
    ? `mailto:info@thesilverhillsschools.com?subject=${encodeURIComponent(
        `Website Inquiry: ${submittedData.name} (${submittedData.phone})`
      )}&body=${encodeURIComponent(
        `Name: ${submittedData.name}\nPhone: ${submittedData.phone}\nEmail: ${submittedData.email}\n\nMessage:\n${submittedData.message}\n`
      )}`
    : 'mailto:info@thesilverhillsschools.com';

  return (
    <section id="contact" className="py-16 md:py-24 bg-white relative overflow-hidden">
      {/* Decorative Doodles */}
      <div className="absolute top-12 left-4 md:left-12 pointer-events-none hidden sm:block animate-float">
        <RainbowCloudDoodle className="w-24 h-20" />
      </div>

      <div className="absolute top-2 right-4 md:right-16 pointer-events-none hidden sm:block">
        <TeddyBearDoodle className="w-28 h-28" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-30">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-14">
          <AnimatedText delay={0.05} distance={16} direction="up" className="inline-block">
            <div className="inline-flex items-center px-5 py-1.5 rounded-full bg-[#6355EE] text-white text-xs sm:text-sm font-bold tracking-wide shadow-sm">
              Need Help? Contact Now
            </div>
          </AnimatedText>
          <AnimatedText
            tag="h2"
            delay={0.15}
            distance={22}
            direction="up"
            className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-black text-[#111638] tracking-tight spotlight-text-dark"
          >
            Quick Contact for Parents
          </AnimatedText>
        </div>

        {/* Large Main Contact Card with Dashed White Stitch Border */}
        <div className="bg-[#FFF3EC] border-2 border-dashed border-white rounded-[28px] sm:rounded-[44px] p-5 sm:p-8 lg:p-12 shadow-xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Testimonial & Contact Information */}
            <div className="lg:col-span-6 space-y-6">
              {/* Quote from Director */}
              <p className="text-base text-slate-700 italic leading-relaxed font-normal spotlight-text-dark">
                "A wonderful school with caring teachers. The admission process was smooth, and my child feels safe and happy every day."
              </p>

              {/* Director Profile */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-md bg-purple-100 shrink-0">
                  <img
                    src={directorImg}
                    alt="Mohini Yadav"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-lg font-black text-[#111638]">Mohini Yadav</h4>
                  <p className="text-xs font-semibold text-slate-500">TSHS Director</p>
                </div>
              </div>

              {/* Thin Divider Line */}
              <div className="border-t border-orange-200/80 my-4" />

              {/* Contact Items */}
              <div className="space-y-4 pt-2">
                {/* Item 1: Phone */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white text-[#6355EE] flex items-center justify-center shadow-md shrink-0">
                    <Phone className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-medium block">
                      Call for inquiries: (Available: 9 AM – 2 PM)
                    </span>
                    <a
                      href="tel:07512461474"
                      className="text-sm sm:text-base font-extrabold text-[#111638] hover:text-[#6355EE] transition-colors"
                    >
                      07512461474, 8602456620
                    </a>
                  </div>
                </div>

                {/* Item 2: Email */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white text-[#6355EE] flex items-center justify-center shadow-md shrink-0">
                    <Mail className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-medium block">
                      Email Address:
                    </span>
                    <a
                      href="mailto:info@thesilverhillsschools.com"
                      className="text-sm sm:text-base font-extrabold text-[#111638] hover:text-[#6355EE] transition-colors"
                    >
                      info@thesilverhillsschools.com
                    </a>
                  </div>
                </div>

                {/* Item 3: School Address */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white text-[#6355EE] flex items-center justify-center shadow-md shrink-0">
                    <MapPin className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-medium block">
                      School Address:
                    </span>
                    <span className="text-sm sm:text-base font-extrabold text-[#111638]">
                      C Block - Hurawali Morar, Gwalior, Madhya Pradesh - 474006
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="lg:col-span-6 space-y-4">
              <h3 className="text-2xl sm:text-3xl font-black text-[#111638] mb-6">
                We're Here to Help!
              </h3>

              {submitted ? (
                <div className="bg-white rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-xl border border-emerald-100 animate-fade-in">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>

                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                    <Mail className="w-3.5 h-3.5" />
                    Sent to info@thesilverhillsschools.com
                  </div>

                  <h4 className="text-xl sm:text-2xl font-black text-slate-800">
                    Thank You, {submittedData?.name || 'Parent'}!
                  </h4>

                  <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                    Your inquiry has been successfully sent to{' '}
                    <strong className="text-[#6355EE] font-semibold">info@thesilverhillsschools.com</strong>.
                    Our admissions and administrative team will review your message and contact you at{' '}
                    <strong className="text-slate-800">{submittedData?.phone || submittedData?.email}</strong> shortly.
                  </p>

                  <div className="p-4 bg-slate-50 rounded-2xl text-left border border-slate-200 text-xs space-y-1.5 text-slate-600">
                    <div className="flex justify-between">
                      <span className="font-semibold text-slate-500">Sender:</span>
                      <span className="text-slate-800 font-medium">{submittedData?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-slate-500">Contact:</span>
                      <span className="text-slate-800 font-medium">{submittedData?.phone} ({submittedData?.email})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-slate-500">Delivered To:</span>
                      <span className="text-emerald-700 font-bold">info@thesilverhillsschools.com</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSubmitted(false);
                        setSubmittedData(null);
                      }}
                      className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider rounded-full transition-colors cursor-pointer"
                    >
                      Send Another Message
                    </button>
                    <a
                      href={mailtoHref}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#6355EE] hover:bg-[#5244dd] text-white font-bold text-xs uppercase tracking-wider rounded-full transition-colors shadow-sm cursor-pointer"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      Open in Email App
                    </a>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <input
                      required
                      type="text"
                      placeholder="Your Name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      disabled={isSubmitting}
                      className="w-full px-4 sm:px-5 py-3 sm:py-3.5 bg-white text-slate-800 placeholder:text-slate-400 rounded-2xl border border-orange-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6355EE] text-base sm:text-sm font-medium disabled:opacity-60"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      required
                      type="email"
                      placeholder="Your Email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      disabled={isSubmitting}
                      className="w-full px-4 sm:px-5 py-3 sm:py-3.5 bg-white text-slate-800 placeholder:text-slate-400 rounded-2xl border border-orange-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6355EE] text-base sm:text-sm font-medium disabled:opacity-60"
                    />
                    <input
                      required
                      type="tel"
                      placeholder="Your Number"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      disabled={isSubmitting}
                      className="w-full px-4 sm:px-5 py-3 sm:py-3.5 bg-white text-slate-800 placeholder:text-slate-400 rounded-2xl border border-orange-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6355EE] text-base sm:text-sm font-medium disabled:opacity-60"
                    />
                  </div>

                  <div>
                    <textarea
                      required
                      rows={4}
                      placeholder="Your Message"
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      disabled={isSubmitting}
                      className="w-full px-4 sm:px-5 py-3 sm:py-3.5 bg-white text-slate-800 placeholder:text-slate-400 rounded-2xl border border-orange-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6355EE] text-base sm:text-sm font-medium resize-none disabled:opacity-60"
                    ></textarea>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-3 pl-6 pr-3 py-3.5 bg-[#ED5B2D] hover:bg-[#d94a1d] active:bg-[#c84116] disabled:opacity-75 disabled:cursor-not-allowed text-white font-bold text-xs sm:text-sm uppercase tracking-wider rounded-full shadow-lg shadow-orange-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer group"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Delivering Email...</span>
                        </>
                      ) : (
                        <>
                          <span>SEND INQUIRY</span>
                          <div className="w-8 h-8 rounded-full bg-white text-slate-900 flex items-center justify-center group-hover:translate-x-0.5 transition-transform shrink-0">
                            <Send className="w-4 h-4 text-[#ED5B2D]" />
                          </div>
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium justify-center sm:justify-start">
                      <Mail className="w-3.5 h-3.5 text-[#6355EE] shrink-0" />
                      <span>Sent to <strong>info@thesilverhillsschools.com</strong></span>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
