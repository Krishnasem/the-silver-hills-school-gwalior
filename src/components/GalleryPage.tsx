import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Image as ImageIcon,
  Sparkles,
  Calendar,
  Tag,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  Share2,
  Filter,
  Eye,
  Heart,
  Camera
} from 'lucide-react';
import {
  getSchoolContent,
  subscribeToSchoolContent,
  syncGalleryPhotosFromStorage,
  isFirebaseStorageUrl,
  StaffGalleryPhoto
} from '../utils/schoolContentStore';
import { AnimatedText } from './AnimatedText';

interface GalleryPageProps {
  onBackToHome: () => void;
  onOpenAdmission?: () => void;
  initialCategory?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Events' | 'Activities' | 'Celebrations' | 'Sports' | 'Art & Craft' | 'Classroom';
  date: string;
  imageUrl: string;
  description: string;
  likes: number;
}

export const galleryItemsData: GalleryItem[] = [];

const categories = [
  'All Photos',
  'Events',
  'Activities',
  'Celebrations',
  'Sports',
  'Art & Craft',
  'Classroom',
];

export const GalleryPage: React.FC<GalleryPageProps> = ({
  onBackToHome,
  onOpenAdmission,
  initialCategory = 'All Photos',
}) => {
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [likedPhotos, setLikedPhotos] = useState<Record<string, boolean>>({});
  const [staffPhotos, setStaffPhotos] = useState<StaffGalleryPhoto[]>([]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const content = getSchoolContent();
    setStaffPhotos((content.galleryPhotos || []).filter((p) => isFirebaseStorageUrl(p.imageUrl)));

    syncGalleryPhotosFromStorage()
      .then((synced) => {
        if (synced) {
          setStaffPhotos(synced.filter((p) => isFirebaseStorageUrl(p.imageUrl)));
        }
      })
      .catch(() => {});

    const unsubscribe = subscribeToSchoolContent((updated) => {
      setStaffPhotos((updated.galleryPhotos || []).filter((p) => isFirebaseStorageUrl(p.imageUrl)));
    });
    return () => unsubscribe();
  }, []);

  const mapCategory = (cat: string): GalleryItem['category'] => {
    if (cat === 'Festival') return 'Celebrations';
    if (cat === 'Arts') return 'Art & Craft';
    if (cat === 'Academic') return 'Classroom';
    if (cat === 'Sports') return 'Sports';
    if (cat === 'Campus') return 'Activities';
    return 'Events';
  };

  // Strictly display only photos fetched from Firebase Storage
  const combinedPhotos: GalleryItem[] = staffPhotos
    .filter((p) => isFirebaseStorageUrl(p.imageUrl))
    .map((p) => ({
      id: p.id,
      title: p.title,
      category: mapCategory(p.category),
      date: p.date,
      imageUrl: p.imageUrl,
      description: p.description,
      likes: p.likes,
    }));

  const filteredItems =
    activeCategory === 'All Photos'
      ? combinedPhotos
      : combinedPhotos.filter((item) => item.category === activeCategory);

  const getCategoryCount = (categoryName: string) => {
    if (categoryName === 'All Photos') return combinedPhotos.length;
    return combinedPhotos.filter((item) => item.category === categoryName).length;
  };

  const handleLike = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setLikedPhotos((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedPhotoIndex !== null) {
      setSelectedPhotoIndex((prev) =>
        prev === 0 ? filteredItems.length - 1 : (prev ?? 1) - 1
      );
    }
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedPhotoIndex !== null) {
      setSelectedPhotoIndex((prev) =>
        prev === filteredItems.length - 1 ? 0 : (prev ?? 0) + 1
      );
    }
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedPhotoIndex === null) return;
      if (e.key === 'Escape') setSelectedPhotoIndex(null);
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhotoIndex, filteredItems.length]);

  return (
    <div className="bg-[#FAF9FF] min-h-screen text-slate-800 pb-20">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-[#1B154B] via-[#2A1D72] to-[#6355EE] text-white pt-10 pb-16 px-4 sm:px-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-10 w-72 h-72 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Back Button & Breadcrumbs */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <button
              onClick={onBackToHome}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold backdrop-blur-md transition-all cursor-pointer border border-white/15 hover:scale-105"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </button>

            <nav className="flex items-center gap-2 text-xs sm:text-sm text-white/70 font-medium">
              <button
                onClick={onBackToHome}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Home
              </button>
              <span>/</span>
              <span className="text-amber-300 font-bold">School Gallery</span>
            </nav>
          </div>

          {/* Page Title */}
          <div className="max-w-3xl">
            <AnimatedText delay={0.05} distance={16} direction="up" className="inline-block mb-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 text-amber-300 text-xs font-black uppercase tracking-wider backdrop-blur-sm border border-white/10 spotlight-text-white">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Memories, Moments & Milestones</span>
              </div>
            </AnimatedText>

            <AnimatedText
              tag="h1"
              delay={0.15}
              distance={22}
              direction="up"
              className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight mb-4 spotlight-text-white"
            >
              Functions, Events & Activities Gallery
            </AnimatedText>

            <AnimatedText
              tag="p"
              delay={0.25}
              distance={18}
              direction="up"
              className="text-base sm:text-lg text-white/85 font-normal leading-relaxed spotlight-text-white"
            >
              Explore vibrant glimpses of life at The Silver Hills School—from grand cultural festivals, sports meets, and classroom discoveries to daily creative joys.
            </AnimatedText>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 -mt-7 relative z-10">
        <div className="bg-white rounded-2xl p-2 sm:p-2.5 shadow-xl shadow-indigo-950/5 border border-indigo-100 flex items-center gap-2 overflow-x-auto no-scrollbar sm:flex-wrap py-0.5">
          {categories.map((cat) => {
            const count = getCategoryCount(cat);
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-2 ${
                  activeCategory === cat
                    ? 'bg-[#6355EE] text-white shadow-md shadow-indigo-500/20'
                    : 'text-slate-600 hover:bg-indigo-50 hover:text-[#6355EE]'
                }`}
              >
                <span>{cat}</span>
                <span className={`text-xs px-1.5 py-0.2 rounded-full ${
                  activeCategory === cat ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-12">
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-indigo-100 p-8 shadow-xs">
            <Camera className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-700">
              {combinedPhotos.length === 0
                ? 'No gallery photos available yet'
                : 'No photos found in this category'}
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              {combinedPhotos.length === 0
                ? 'Photos uploaded to Firebase Storage via the School Staff Daily Portal will appear here automatically.'
                : 'Select another category or upload photos via the School Staff Daily Portal.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredItems.map((item, idx) => {
              const isLiked = !!likedPhotos[item.id];
              const likeCount = item.likes + (isLiked ? 1 : 0);
              const isStaffUploaded = item.id.startsWith('sgp-');

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedPhotoIndex(idx)}
                  className="bg-white rounded-[28px] overflow-hidden border border-indigo-100/80 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 group cursor-pointer flex flex-col justify-between"
                >
                  {/* Image Container with Zoom Icon */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                    />

                    {/* Gradient Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4 text-white">
                      <span className="text-xs font-bold flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
                        <Eye className="w-3.5 h-3.5" />
                        <span>Click to Enlarge</span>
                      </span>
                      <button
                        onClick={(e) => handleLike(e, item.id)}
                        className={`p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                          isLiked ? 'bg-red-500 text-white' : 'bg-white/30 text-white hover:bg-white/50'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    {/* Top Badges */}
                    <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-[#6355EE] text-white text-[11px] font-black uppercase tracking-wider shadow-md">
                        {item.category}
                      </span>
                      {isStaffUploaded && (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] tracking-wide shadow-sm flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          <span>Latest</span>
                        </span>
                      )}
                    </div>

                    <div className="absolute top-3.5 right-3.5">
                      <span className="px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md text-white text-[11px] font-semibold flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {item.date}
                      </span>
                    </div>
                  </div>

                  {/* Details / Caption */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-[#111638] group-hover:text-[#6355EE] transition-colors leading-snug mb-2 spotlight-text-dark">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 leading-relaxed spotlight-text-slate">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium">
                      <span className="flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                        <span className="font-bold text-slate-700">{likeCount}</span> likes
                      </span>
                      <span className="text-[#6355EE] font-bold group-hover:underline flex items-center gap-1">
                        <span>View Full Size</span>
                        <Maximize2 className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Lightbox / Fullscreen Modal */}
      {selectedPhotoIndex !== null && filteredItems[selectedPhotoIndex] && (
        <div
          onClick={() => setSelectedPhotoIndex(null)}
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 animate-fadeIn"
        >
          {/* Close Button */}
          <button
            onClick={() => setSelectedPhotoIndex(null)}
            className="absolute top-3 right-3 sm:top-6 sm:right-6 w-11 h-11 rounded-full bg-black/60 sm:bg-white/20 hover:bg-black/80 text-white flex items-center justify-center transition-all cursor-pointer z-50 backdrop-blur-xs"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Prev Photo */}
          <button
            onClick={handlePrev}
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/60 sm:bg-white/10 hover:bg-black/80 text-white flex items-center justify-center transition-all cursor-pointer z-50 backdrop-blur-xs"
            aria-label="Previous"
          >
            <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7" />
          </button>

          {/* Next Photo */}
          <button
            onClick={handleNext}
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/60 sm:bg-white/10 hover:bg-black/80 text-white flex items-center justify-center transition-all cursor-pointer z-50 backdrop-blur-xs"
            aria-label="Next"
          >
            <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7" />
          </button>

          {/* Image & Description Card */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-5xl w-full max-h-[92vh] bg-slate-900 rounded-[24px] sm:rounded-[32px] overflow-hidden border border-white/10 shadow-2xl flex flex-col"
          >
            <div className="relative flex-1 min-h-[220px] sm:min-h-[300px] max-h-[60vh] bg-black flex items-center justify-center overflow-hidden">
              <img
                src={filteredItems[selectedPhotoIndex].imageUrl}
                alt={filteredItems[selectedPhotoIndex].title}
                referrerPolicy="no-referrer"
                className="max-w-full max-h-[60vh] object-contain"
              />
            </div>

            {/* Bottom Caption Bar */}
            <div className="p-4 sm:p-6 bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 border-t border-white/10 overflow-y-auto max-h-[32vh]">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#6355EE] text-white text-[11px] font-black uppercase">
                    {filteredItems[selectedPhotoIndex].category}
                  </span>
                  <span className="text-xs text-slate-400">
                    {filteredItems[selectedPhotoIndex].date}
                  </span>
                  <span className="text-xs text-slate-500">
                    • Photo {selectedPhotoIndex + 1} of {filteredItems.length}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  {filteredItems[selectedPhotoIndex].title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
                  {filteredItems[selectedPhotoIndex].description}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={(e) => handleLike(e, filteredItems[selectedPhotoIndex].id)}
                  className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    likedPhotos[filteredItems[selectedPhotoIndex].id]
                      ? 'bg-rose-600 text-white'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${likedPhotos[filteredItems[selectedPhotoIndex].id] ? 'fill-current' : ''}`} />
                  <span>
                    {filteredItems[selectedPhotoIndex].likes +
                      (likedPhotos[filteredItems[selectedPhotoIndex].id] ? 1 : 0)}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
