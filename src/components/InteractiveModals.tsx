import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Play, Search, Send, Sparkles, Loader2, Video as VideoIcon, Cloud, UploadCloud } from 'lucide-react';
import { getSchoolContent, subscribeToSchoolContent } from '../utils/schoolContentStore';
import { getStorageDownloadUrl } from '../utils/firebaseStorage';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAdmin?: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose, onOpenAdmin }) => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;
    setIsLoading(true);

    const resolveVideo = async () => {
      const current = getSchoolContent();
      if (current.introVideoUrl && current.introVideoUrl.startsWith('http')) {
        if (isMounted) {
          setVideoUrl(current.introVideoUrl);
          setIsLoading(false);
        }
        return;
      }

      // Query Firebase Storage directly for path 'videos/intro-video.mp4'
      try {
        const storageUrl = await getStorageDownloadUrl('videos/intro-video.mp4');
        if (isMounted) {
          if (storageUrl && storageUrl.startsWith('http')) {
            setVideoUrl(storageUrl);
          } else {
            // No local video is played - strict Firebase Storage only
            setVideoUrl(null);
          }
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setVideoUrl(null);
          setIsLoading(false);
        }
      }
    };

    resolveVideo();

    const unsubscribe = subscribeToSchoolContent((content) => {
      if (content.introVideoUrl && content.introVideoUrl.startsWith('http') && isMounted) {
        setVideoUrl(content.introVideoUrl);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[92vh] bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-indigo-500/30 flex flex-col">
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-indigo-600 text-white shrink-0">
          <div className="flex items-center gap-2 min-w-0 pr-2">
            <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current shrink-0" />
            <span className="font-bold text-sm sm:text-base truncate">A Day in TSHS — Campus Tour & Highlights</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer shrink-0"
            aria-label="Close video modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="aspect-video w-full bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center gap-3 text-indigo-300">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
              <span className="text-xs font-semibold">Connecting to Firebase Cloud Storage...</span>
            </div>
          ) : videoUrl ? (
            <video
              className="w-full h-full object-contain"
              src={videoUrl}
              controls
              autoPlay
              playsInline
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="text-center p-6 sm:p-8 max-w-md">
              <div className="w-14 h-14 mx-auto mb-3.5 rounded-2xl bg-indigo-950/80 border border-indigo-500/40 text-indigo-400 flex items-center justify-center shadow-lg">
                <Cloud className="w-7 h-7 text-indigo-300" />
              </div>
              <h4 className="text-sm sm:text-base font-bold text-white mb-1">Firebase Storage Video Channel</h4>
              <p className="text-xs text-slate-300 mb-3.5 leading-relaxed">
                Videos are streamed exclusively from Firebase Storage. No video is currently uploaded to <code className="text-indigo-300 font-mono bg-indigo-950/80 px-1.5 py-0.5 rounded">videos/intro-video.mp4</code>.
              </p>
              <p className="text-[11px] text-slate-400 mb-4">
                Local video playback has been disabled. Upload your official school tour video in the Staff Admin Portal to stream it live.
              </p>
              {onOpenAdmin && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenAdmin();
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-bold shadow-lg transition-all cursor-pointer"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>Open Staff Portal to Upload</span>
                </button>
              )}
            </div>
          )}
        </div>

        <div className="p-3 sm:p-4 bg-slate-900 flex justify-end items-center gap-2 text-xs text-slate-400 shrink-0">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-semibold cursor-pointer transition-colors text-center"
          >
            Close Video
          </button>
        </div>
      </div>
    </div>
  );
};

interface AdmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProgram?: string;
}

export const AdmissionModal: React.FC<AdmissionModalProps> = ({
  isOpen,
  onClose,
  defaultProgram = 'Preschool (02-03 years)',
}) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    parentName: '',
    childName: '',
    childAge: '3',
    program: defaultProgram,
    email: '',
    phone: '',
    message: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      // Auto close after success
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg max-h-[90vh] bg-white rounded-3xl overflow-hidden shadow-2xl border border-purple-100 flex flex-col">
        <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 sm:py-4 bg-gradient-to-r from-[#6355EE] to-[#8075FF] text-white shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-300" />
            <h3 className="font-bold text-base sm:text-lg">Online Admission Form</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1 rounded-full hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-6 sm:p-8 text-center flex flex-col items-center overflow-y-auto">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>
            <h4 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2">Application Received!</h4>
            <p className="text-slate-600 text-xs sm:text-sm mb-6 max-w-xs leading-relaxed">
              Thank you, <strong>{formData.parentName || 'Parent'}</strong>! Our admissions counselor will contact you at <strong>{formData.phone || formData.email || 'your number'}</strong> within 24 hours.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="px-6 py-2.5 bg-[#ED5B2D] text-white font-bold rounded-full hover:bg-[#d94a1d] transition-all shadow-md cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-3 sm:space-y-3.5 text-slate-700 overflow-y-auto flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Parent's Full Name *</label>
                <input
                  required
                  type="text"
                  placeholder=""
                  value={formData.parentName}
                  onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-base sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#6355EE] bg-slate-50"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Child's Name *</label>
                <input
                  required
                  type="text"
                  placeholder=""
                  value={formData.childName}
                  onChange={(e) => setFormData({ ...formData, childName: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-base sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#6355EE] bg-slate-50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number *</label>
                <input
                  required
                  type="tel"
                  placeholder=""
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-base sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#6355EE] bg-slate-50"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder=""
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-base sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#6355EE] bg-slate-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Questions / Notes (Optional)</label>
              <textarea
                rows={2}
                placeholder=""
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-3.5 py-2 text-base sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#6355EE] bg-slate-50 resize-none"
              ></textarea>
            </div>

            <div className="pt-2 flex flex-col-reverse sm:flex-row justify-end gap-2.5 shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer text-center flex items-center justify-center"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto min-h-[44px] px-6 py-3 bg-[#ED5B2D] hover:bg-[#d84a1d] text-white font-bold text-xs sm:text-sm rounded-full flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 transition-all cursor-pointer"
              >
                <span>Submit Enrollment</span>
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const sampleResults = [
    { title: 'Preschool Learning Program (Age 2-3)', category: 'Programs', link: '#programs' },
    { title: 'Sensory Play & Art Class', category: 'Classes', link: '#classes' },
    { title: 'Admission Requirements & Steps', category: 'Admissions', link: '#admissions' },
    { title: 'Kindergarten Teachers & Faculty', category: 'Teachers', link: '#teachers' },
    { title: 'Morning & Afternoon Session Hours', category: 'Schedules', link: '#sessions' },
  ].filter((item) => item.title.toLowerCase().includes(query.toLowerCase()));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="relative w-full max-w-xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100">
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <Search className="w-5 h-5 text-[#6355EE]" />
          <input
            autoFocus
            type="text"
            placeholder="Search programs, teachers, schedules, admissions..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-base outline-none placeholder:text-slate-400 font-medium text-slate-800"
          />
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-4 space-y-2">
          {sampleResults.length > 0 ? (
            sampleResults.map((res, i) => (
              <a
                key={i}
                href={res.link}
                onClick={onClose}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-purple-50 transition-colors group cursor-pointer"
              >
                <div>
                  <h4 className="text-sm font-bold text-slate-800 group-hover:text-[#6355EE]">{res.title}</h4>
                  <span className="text-xs text-slate-400">{res.category}</span>
                </div>
                <span className="text-xs text-[#6355EE] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  View →
                </span>
              </a>
            ))
          ) : (
            <div className="text-center py-8 text-slate-400 text-sm">
              No results found for "{query}". Try "admission", "preschool", or "teacher".
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
