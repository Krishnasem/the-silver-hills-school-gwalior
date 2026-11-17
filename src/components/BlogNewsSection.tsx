import React, { useState, useEffect } from 'react';
import { ArrowRight, Images, Sparkles, Eye, Heart, Camera } from 'lucide-react';
import { BookDoodle } from './Doodles';
import {
  getSchoolContent,
  subscribeToSchoolContent,
  syncGalleryPhotosFromStorage,
  isFirebaseStorageUrl,
  StaffGalleryPhoto,
} from '../utils/schoolContentStore';
import { AnimatedText } from './AnimatedText';

interface GalleryPreviewItem {
  id: string;
  title: string;
  imageUrl: string;
  likes: number;
}

interface BlogNewsSectionProps {
  onReadArticle?: (title: string) => void;
  onViewAll?: () => void;
}

export const BlogNewsSection: React.FC<BlogNewsSectionProps> = ({ onReadArticle, onViewAll }) => {
  const [likedCards, setLikedCards] = useState<Record<string, boolean>>({});
  const [staffPhotos, setStaffPhotos] = useState<StaffGalleryPhoto[]>([]);

  useEffect(() => {
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

  const handleLike = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setLikedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCardClick = (title: string) => {
    if (onViewAll) {
      onViewAll();
    } else if (onReadArticle) {
      onReadArticle(title);
    }
  };

  // Strictly include only photos fetched from Firebase Storage
  const combinedCards: GalleryPreviewItem[] = staffPhotos
    .filter((p) => isFirebaseStorageUrl(p.imageUrl))
    .map((p) => ({
      id: p.id,
      title: p.title,
      imageUrl: p.imageUrl,
      likes: p.likes,
    }));

  const useMarquee = combinedCards.length >= 4;
  const displayCards = useMarquee ? [...combinedCards, ...combinedCards] : combinedCards;

  const renderPhotoCard = (card: GalleryPreviewItem, index: number) => {
    const isLiked = !!likedCards[`${card.id}-${index}`];
    const likeCount = card.likes + (isLiked ? 1 : 0);

    return (
      <div
        key={`${card.id}-${index}`}
        onClick={() => handleCardClick(card.title)}
        className="w-[260px] xs:w-[290px] sm:w-[340px] md:w-[370px] shrink-0 bg-[#FFF9F5] border border-orange-100/90 rounded-[28px] sm:rounded-[32px] p-3.5 sm:p-4 flex flex-col justify-between shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group cursor-pointer"
      >
        {/* Photo Container */}
        <div className="relative aspect-[4/3] w-full rounded-[22px] sm:rounded-[24px] overflow-hidden bg-slate-900 shadow-sm mb-3 sm:mb-4">
          <img
            src={card.imageUrl}
            alt={card.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
          />

          {/* Hover Overlay with Preview prompt */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-3.5 text-white">
            <span className="text-xs font-bold flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
              <Eye className="w-3.5 h-3.5" />
              <span>View in Gallery</span>
            </span>
            <button
              onClick={(e) => handleLike(e, `${card.id}-${index}`)}
              className={`p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                isLiked ? 'bg-red-500 text-white' : 'bg-white/30 text-white hover:bg-white/50'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Card Information */}
        <div className="flex flex-col justify-between flex-1 px-1">
          <div>
            <h3 className="text-base sm:text-lg font-black text-[#111638] group-hover:text-[#6355EE] transition-colors leading-snug line-clamp-1 mb-1.5">
              {card.title}
            </h3>
          </div>

          {/* Bottom Action Row */}
          <div className="pt-2 border-t border-orange-100/80 flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
              <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
              <span>{likeCount} Likes</span>
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section id="gallery" className="py-16 md:py-24 bg-white relative overflow-hidden">
      {/* Top Open Book Doodle */}
      <div className="flex justify-center mb-2 pointer-events-none">
        <BookDoodle className="w-16 h-16 animate-float" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-30 mb-10">
        {/* Section Header */}
        <div className="text-center space-y-4">
          <AnimatedText delay={0.05} distance={16} direction="up" className="inline-block">
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#EBE8FD] text-[#6355EE] text-xs sm:text-sm font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Gallery</span>
            </div>
          </AnimatedText>
          <AnimatedText
            tag="h2"
            delay={0.15}
            distance={22}
            direction="up"
            className="text-3xl sm:text-4xl md:text-5xl font-black text-[#111638] tracking-tight spotlight-text-dark"
          >
            Functions & Activities
          </AnimatedText>
          <AnimatedText
            tag="p"
            delay={0.25}
            distance={18}
            direction="up"
            className="text-slate-500 text-sm sm:text-base max-w-2xl mx-auto"
          >
            Glimpses of memorable annual events, creative workshops, sports, and daily vibrant moments of our students.
          </AnimatedText>
        </div>
      </div>

      {/* Firebase Storage Gallery Showcase */}
      {combinedCards.length === 0 ? (
        <div className="max-w-3xl mx-auto px-4 sm:px-8 py-4">
          <div className="text-center py-14 px-6 bg-[#FFF9F5] rounded-[28px] border border-orange-100/90 shadow-xs">
            <Camera className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-[#111638]">No gallery photos uploaded yet</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
              Photos uploaded to Firebase Storage via the Staff Portal will appear here automatically.
            </p>
          </div>
        </div>
      ) : useMarquee ? (
        <div className="relative w-full overflow-hidden py-4">
          {/* Left & Right Gradient Fades for smooth edge blending */}
          <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-white via-white/80 to-transparent z-20 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-white via-white/80 to-transparent z-20 pointer-events-none" />

          {/* Sliding Track (Continuous Right-to-Left Slide) */}
          <div className="animate-marquee flex gap-6 px-4 cursor-grab active:cursor-grabbing">
            {displayCards.map((card, index) => renderPhotoCard(card, index))}
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4">
          <div className="flex flex-wrap justify-center gap-6">
            {displayCards.map((card, index) => renderPhotoCard(card, index))}
          </div>
        </div>
      )}

      {/* Bottom Area: View All Button in the Bottom-Right Corner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">

        {/* View All Button positioned in the Bottom-Right Corner */}
        <div className="w-full sm:w-auto sm:ml-auto">
          <button
            onClick={onViewAll}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 pl-6 pr-2.5 py-3 bg-[#ED5B2D] hover:bg-[#d94a1d] text-white font-black text-xs sm:text-sm uppercase tracking-wider rounded-full shadow-lg shadow-orange-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <Images className="w-4 h-4 text-white" />
              <span>VIEW ALL PHOTOS</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-white text-slate-900 flex items-center justify-center group-hover:translate-x-0.5 transition-transform shrink-0">
              <ArrowRight className="w-4 h-4 text-slate-900 stroke-[2.5]" />
            </div>
          </button>
        </div>
      </div>
    </section>
  );
};
