import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Instagram,
  Play,
  ArrowRight,
  Film,
  Sparkles,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { WavyScallopDivider } from './Doodles';
import { AnimatedText } from './AnimatedText';
import { ActivityReel } from '../types';
import {
  getSchoolContent,
  subscribeToSchoolContent,
  syncActivityReelsFromStorage,
  DEFAULT_ACTIVITY_REELS,
} from '../utils/schoolContentStore';
import { getStorageDownloadUrl } from '../utils/firebaseStorage';
import devotionalImg from '../assets/images/devotional-image.jpeg';
import independenceImg from '../assets/images/independenceday-image.JPG';

interface LearningProgramsProps {
  onJoinClass: (className: string) => void;
}

const INSTAGRAM_URL = 'https://www.instagram.com/thesilverhills_school/';

// Individual Reel Card Component with Video Play on Hover
const ReelCard: React.FC<{
  reel: ActivityReel;
  resolvedUrl: string;
  onRemoveCard: (id: string) => void;
  hidePlayOverlay?: boolean;
}> = ({ reel, resolvedUrl, onRemoveCard, hidePlayOverlay = false }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const getPoster = (reelId: string) => {
    if (reelId === 'reel-2') return devotionalImg;
    if (reelId === 'reel-3') return independenceImg;
    if (reelId === 'reel-4') return 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=600&q=80';
    if (reelId === 'reel-5') return 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=600&q=80';
    return undefined;
  };

  const handleMouseEnter = () => {
    const video = videoRef.current;
    if (
      !video ||
      !resolvedUrl ||
      video.error ||
      video.networkState === HTMLMediaElement.NETWORK_NO_SOURCE
    ) {
      onRemoveCard(reel.id);
      return;
    }

    video.muted = true;
    setIsMuted(true);

    video
      .play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch((err) => {
        setIsPlaying(false);
        if (
          err?.name !== 'AbortError' &&
          (video.error || video.networkState === HTMLMediaElement.NETWORK_NO_SOURCE)
        ) {
          onRemoveCard(reel.id);
        }
      });
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
      setIsMuted(true);
    }
  };

  const handleToggleClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    const video = videoRef.current;
    if (!video || !resolvedUrl) {
      onRemoveCard(reel.id);
      return;
    }

    if (video.paused) {
      video.muted = false;
      setIsMuted(false);

      video
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          if (err?.name !== 'AbortError') {
            onRemoveCard(reel.id);
          }
        });
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleSoundToggle = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!videoRef.current) return;

    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);

    if (videoRef.current.paused && resolvedUrl) {
      videoRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          if (err?.name !== 'AbortError') {
            onRemoveCard(reel.id);
          }
        });
    }
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="w-full bg-slate-900 rounded-[32px] overflow-hidden shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col group relative border-2 border-white/20 hover:border-white/50 text-white"
    >
      <div className="relative aspect-[9/13] sm:aspect-[9/13.5] w-full overflow-hidden bg-slate-950 flex items-center justify-center">
        <video
          ref={videoRef}
          src={resolvedUrl}
          poster={getPoster(reel.id)}
          muted={isMuted}
          playsInline
          loop
          preload="auto"
          onPlaying={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onError={(e) => {
            if (e.currentTarget.error?.code === MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED) {
              onRemoveCard(reel.id);
            }
          }}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            isPlaying ? 'opacity-100' : 'opacity-70'
          }`}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/60 pointer-events-none" />

        {/* Top information */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-xs font-bold shadow-lg">
            <Film className="w-3.5 h-3.5 text-pink-400" />
            <span>{reel.category}</span>
          </div>

          {/* Sound button */}
          <button
            onClick={handleSoundToggle}
            className="p-2 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white hover:bg-black/80 transition-colors shadow-lg cursor-pointer"
            title={isMuted ? 'Unmute video' : 'Mute video'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>

        {/* Center Play Button Overlay if Paused */}
        {!isPlaying && !hidePlayOverlay && (
          <div
            onClick={handleToggleClick}
            className="absolute inset-0 flex items-center justify-center z-20 cursor-pointer"
          >
            <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
              <Play className="w-6 h-6 fill-white text-white translate-x-0.5" />
            </div>
          </div>
        )}

        {/* Bottom Metadata & Instagram Hash Tag */}
        <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-col gap-2">
          {reel.title && (
            <h4 className="text-sm font-black text-white leading-tight drop-shadow-md">
              {reel.title}
            </h4>
          )}
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-amber-300 tracking-wide drop-shadow-md">
              {reel.tag}
            </span>

            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[11px] font-bold shadow-md hover:brightness-110 transition-all cursor-pointer"
            >
              <Instagram className="w-3 h-3" />
              <span>Watch</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export const LearningPrograms: React.FC<LearningProgramsProps> = ({ onJoinClass }) => {
  const [reels, setReels] = useState<ActivityReel[]>(() => {
    const stored = getSchoolContent().activityReels || DEFAULT_ACTIVITY_REELS;
    return stored.filter((r) => r.id !== 'reel-1');
  });
  const [resolvedUrlMap, setResolvedUrlMap] = useState<Record<string, string | null>>({});
  const [removedIds, setRemovedIds] = useState<Set<string>>(() => new Set());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [itemsPerView, setItemsPerView] = useState(3);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Subscribe to real-time changes from Firebase / Admin portal & discover Storage videos
  useEffect(() => {
    const unsubscribe = subscribeToSchoolContent((content) => {
      if (content.activityReels) {
        setReels(content.activityReels.filter((r) => r.id !== 'reel-1'));
        setCurrentIndex(0);
      }
    });

    syncActivityReelsFromStorage()
      .then((mergedReels) => {
        if (mergedReels && mergedReels.length > 0) {
          setReels(mergedReels.filter((r) => r.id !== 'reel-1'));
        }
      })
      .catch(() => {});

    return () => unsubscribe();
  }, []);

  const checkedIdsRef = useRef<Set<string>>(new Set());

  // Resolve Firebase Storage URLs for all reels; exclude any reel without an actual video
  useEffect(() => {
    let isMounted = true;

    reels.forEach((reel) => {
      if (reel.videoUrl && reel.videoUrl.startsWith('http')) {
        checkedIdsRef.current.add(reel.id);
        setResolvedUrlMap((prev) =>
          prev[reel.id] === reel.videoUrl ? prev : { ...prev, [reel.id]: reel.videoUrl }
        );
        return;
      }

      if (checkedIdsRef.current.has(reel.id)) return;
      checkedIdsRef.current.add(reel.id);

      const targetPath = reel.storagePath || `activities/${reel.id}.mp4`;
      getStorageDownloadUrl(targetPath)
        .then((url) => {
          if (!isMounted) return;
          const validUrl = url && url.startsWith('http') ? url : null;
          setResolvedUrlMap((prev) => ({ ...prev, [reel.id]: validUrl }));
        })
        .catch(() => {
          if (!isMounted) return;
          setResolvedUrlMap((prev) => ({ ...prev, [reel.id]: null }));
        });
    });

    return () => {
      isMounted = false;
    };
  }, [reels]);

  const handleRemoveCard = useCallback((id: string) => {
    setRemovedIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  // Responsive items count
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Only display cards that have a confirmed video URL and haven't failed to play
  const displayReels = reels
    .map((reel) => {
      const url =
        reel.videoUrl && reel.videoUrl.startsWith('http')
          ? reel.videoUrl
          : resolvedUrlMap[reel.id] || null;
      return { reel, resolvedUrl: url };
    })
    .filter(
      (item): item is { reel: ActivityReel; resolvedUrl: string } =>
        Boolean(item.resolvedUrl) && !removedIds.has(item.reel.id)
    );

  const maxIndex = Math.max(0, displayReels.length - itemsPerView);

  useEffect(() => {
    setCurrentIndex((prev) => Math.min(prev, maxIndex));
  }, [maxIndex]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  // Auto-swipe slowly from right to left with a time delay (every 4.5 seconds)
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      handleNext();
    }, 4500);

    return () => clearInterval(timer);
  }, [isPaused, maxIndex, itemsPerView]);

  // Touch Swipe Handlers for mobile devices
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <section
      id="classes"
      className="relative bg-[#6355EE] text-white pt-16 pb-20 overflow-hidden select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Top Scallop Waves from previous section */}
      <div className="absolute top-0 left-0 right-0 z-10">
        <WavyScallopDivider fillColor="#FFFFFF" inverted={true} className="w-full h-8 sm:h-12" />
      </div>

      {/* Decorative Zigzag doodle in background */}
      <div className="absolute top-20 left-10 opacity-30 pointer-events-none hidden md:block">
        <svg viewBox="0 0 100 100" className="w-24 h-24 text-white fill-none stroke-current stroke-[4] stroke-linecap-round stroke-linejoin-round">
          <path d="M10 80 L35 20 L55 70 L80 15 L95 65" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-30">
        {/* Section Header with Title & Subtitle */}
        <div className="text-center space-y-3 max-w-3xl mx-auto flex flex-col items-center mb-12">
          <AnimatedText delay={0.05} distance={16} direction="up" className="inline-block">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 text-white text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-sm shadow-sm">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Our School Activities</span>
            </div>
          </AnimatedText>

          <AnimatedText
            tag="h2"
            delay={0.15}
            distance={22}
            direction="up"
            className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white drop-shadow-sm text-center"
          >
            Discover Our Fun Activities/Programs
          </AnimatedText>

          <AnimatedText
            tag="p"
            delay={0.25}
            distance={18}
            direction="up"
            className="text-white/85 text-sm sm:text-base font-normal text-center max-w-2xl"
          >
            Hover your mouse over any video reel below to preview our students exploring arts, sports, science, and music!
          </AnimatedText>
        </div>

        {/* Carousel Viewport */}
        <div
          className="overflow-hidden relative -mx-3 px-3 py-2"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Sliding Track - moves from right to left smoothly */}
          <div
            className="flex transition-transform duration-700 ease-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
            }}
          >
            {displayReels.length === 0 ? (
              <div className="w-full py-12 text-center flex flex-col items-center justify-center">
                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-amber-300 mb-3 border border-white/20">
                  <Film className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-white mb-1">No Activity Reels Yet</h3>
                <p className="text-xs text-white/70 max-w-md">
                  Upload activity videos in the Staff Portal to feature them live here.
                </p>
              </div>
            ) : (
              displayReels.map(({ reel, resolvedUrl }, idx) => (
                <div
                  key={reel.id}
                  className="w-full sm:w-1/2 lg:w-1/3 px-3.5 shrink-0 flex"
                >
                  <ReelCard
                    reel={reel}
                    resolvedUrl={resolvedUrl}
                    onRemoveCard={handleRemoveCard}
                    hidePlayOverlay={idx === 0}
                  />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Carousel Pagination Dots */}
        {maxIndex > 0 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            {Array.from({ length: maxIndex + 1 }).map((_, dotIdx) => (
              <button
                key={dotIdx}
                onClick={() => setCurrentIndex(dotIdx)}
                aria-label={`Go to slide ${dotIdx + 1}`}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  currentIndex === dotIdx
                    ? 'w-8 h-2.5 bg-amber-300'
                    : 'w-2.5 h-2.5 bg-white/30 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        )}

        {/* Prominent Callout Banner to View All Reels on Instagram */}
        <div className="mt-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-[28px] p-5 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] flex items-center justify-center text-white shrink-0 shadow-lg">
              <Instagram className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <div>
              <h4 className="text-lg sm:text-2xl font-black text-white leading-snug">
                Want to see more school Reels & daily moments?
              </h4>
              <p className="text-white/80 text-xs sm:text-sm mt-1">
                Follow <strong>@thesilverhills_school</strong> on Instagram for event broadcasts, celebration highlights & classroom stories.
              </p>
            </div>
          </div>

          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] hover:brightness-110 text-white font-extrabold text-xs sm:text-sm md:text-base tracking-wide shadow-xl shadow-purple-950/30 hover:scale-105 active:scale-95 transition-all shrink-0 cursor-pointer"
          >
            <Instagram className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
            <span>Watch More on Instagram</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </a>
        </div>
      </div>

      {/* Bottom Scallop Waves transitioning to White Section */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <WavyScallopDivider fillColor="#FFFFFF" className="w-full h-8 sm:h-12" />
      </div>
    </section>
  );
};

