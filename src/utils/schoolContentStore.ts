import { db, auth } from '../firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import {
  DailyThought,
  SchoolContentState,
  SchoolNoticeItem,
  StaffGalleryPhoto,
  ActivityReel,
  Teacher,
} from '../types';

export type {
  DailyThought,
  SchoolContentState,
  SchoolNoticeItem,
  StaffGalleryPhoto,
  ActivityReel,
  Teacher,
};

export type SchoolEventItem = SchoolNoticeItem;
import {
  uploadFileToStorage,
  deleteFileFromStorage,
  getStorageDownloadUrl,
  listStorageFolderFiles,
} from './firebaseStorage';

export const PRESET_THOUGHTS: DailyThought[] = [
  {
    quote: "Igniting the Spark of Wisdom: Where curiosity blossoms into knowledge.",
    author: "TSHS Creed",
    tag: "Our Motto",
  },
  {
    quote: "Every child is gifted; they just unwrap their packages at different times.",
    author: "Child Development",
    tag: "Individual Growth",
  },
  {
    quote: "Tell me and I forget. Teach me and I remember. Involve me and I learn.",
    author: "Benjamin Franklin",
    tag: "Active Learning",
  },
  {
    quote: "The roots of education are bitter, but the fruit is sweet.",
    author: "Aristotle",
    tag: "Perseverance",
  },
  {
    quote: "Do what you can, with what you have, where you are.",
    author: "Theodore Roosevelt",
    tag: "Initiative",
  },
  {
    quote: "Kindness is a language which the deaf can hear and the blind can see.",
    author: "Mark Twain",
    tag: "Kindness & Empathy",
  },
  {
    quote: "Mistakes are proof that you are trying and learning.",
    author: "Growth Mindset",
    tag: "Resilience",
  },
  {
    quote: "You have brains in your head. You have feet in your shoes. You can steer yourself any direction you choose.",
    author: "Dr. Seuss",
    tag: "Self-Belief",
  },
];

export const DEFAULT_TEACHERS: Teacher[] = [
  {
    id: 't-1',
    name: 'Sarah Adelia',
    role: 'Science Teacher',
    qualification: 'M.Sc. B.Ed, 8+ Yrs Exp.',
    imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 't-2',
    name: 'Cathrine Wils',
    role: 'Language & Phonics Specialist',
    qualification: 'M.A. English, Early Childhood Certified',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 't-3',
    name: 'Priya Sharma',
    role: 'Mathematics & Logic Coach',
    qualification: 'M.Sc. Mathematics, 6+ Yrs Exp.',
    imageUrl: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 't-4',
    name: 'Adam Smith',
    role: 'Creative Arts & Music Guide',
    qualification: 'B.F.A. Performing Arts',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80',
  },
];

export const DEFAULT_ACTIVITY_REELS: ActivityReel[] = [
  {
    id: 'reel-2',
    title: 'Janmashtami Celebration',
    category: 'Cultural & Devotional',
    tag: '#Janmashtami #SilverHillsSchool',
    videoUrl: '', // Dynamic Firebase Storage
  },
  {
    id: 'reel-3',
    title: 'Independence Day Celebrations',
    category: 'National Pride',
    tag: '#IndependenceDay #ProudTSHS',
    videoUrl: '', // Dynamic Firebase Storage
  },
  {
    id: 'reel-4',
    title: 'Art & Craft Exhibition',
    category: 'Creative Arts',
    tag: '#RakhiExhibition #TSHSArtists',
    videoUrl: '', // Dynamic Firebase Storage
  },
  {
    id: 'reel-5',
    title: 'Annual Sports & Athletics Meet',
    category: 'Sports & Fitness',
    tag: '#SportsMeet #TSHSAthletics',
    videoUrl: '', // Dynamic Firebase Storage
  },
];

export const DEFAULT_CONTENT_STATE: SchoolContentState = {
  dailyThought: {
    quote: "The spark of wisdom begins with curiosity and blossoms in a caring heart.",
    author: "The Silver Hills School",
    tag: "Today's Inspiration",
    updatedAt: new Date().toISOString(),
  },
  events: [
    {
      id: 'evt-1',
      date: 'Aug 28',
      badge: 'Admissions',
      title: 'Academic Session 2026-27 Enrolment Open',
      type: 'new',
    },
    {
      id: 'evt-2',
      date: 'Sep 05',
      badge: 'Celebration',
      title: "Teachers' Day & Student Talents Showcase",
      type: 'upcoming',
    },
    {
      id: 'evt-3',
      date: 'Sep 15',
      badge: 'Workshop',
      title: 'Parenting & Early Literacy Orientation',
      type: 'event',
    },
  ],
  galleryPhotos: [],
  missionVision: {
    missionText: "In order to Meet the needs of our diverse student population. The Silver Hills School Strives to attain high academic achievement and personal growth. We spark an attitude of inquiry and enthusiasm to become life-long learners by developing intellectual curiosity, a thirst for discovery, and achievement. These all will be accomplished through continued co-operation among school, community, parents, and students.",
    visionText: "The Vision of The Silver Hills School is to prepare our students of urban as well as rural India for a rapidly changing world by equipping them with critical thinking skills in global perspective, core values of honesty, loyalty, and compassion.",
  },
  adminPin: '1234',
  introVideoUrl: '',
  introVideoStoragePath: 'videos/intro-video.mp4',
  activityReels: DEFAULT_ACTIVITY_REELS,
  teachers: DEFAULT_TEACHERS,
};

const STORAGE_KEY = 'tshs_school_content_v2';
const UPDATE_EVENT_NAME = 'tshs_content_updated';

export const isFirebaseStorageUrl = (url?: string): boolean => {
  if (typeof url !== 'string' || !url.trim()) return false;
  return (
    url.startsWith('https://firebasestorage.googleapis.com/') ||
    url.startsWith('https://storage.googleapis.com/')
  );
};

let isFirestoreContentSyncInitialized = false;

export function initFirestoreSync() {
  if (isFirestoreContentSyncInitialized || typeof window === 'undefined') return;
  isFirestoreContentSyncInitialized = true;

  try {
    const docRef = doc(db, 'schoolContent', 'general');
    onSnapshot(
      docRef,
      async (snapshot) => {
        if (snapshot.exists()) {
          const remote = snapshot.data() as Partial<SchoolContentState>;
          const current = getSchoolContent();

          let rawVideoUrl = remote.introVideoUrl || current.introVideoUrl || '';
          let resolvedIntroVideoUrl = typeof rawVideoUrl === 'string' && rawVideoUrl.startsWith('http') ? rawVideoUrl : '';

          // If no intro video URL is explicitly in document, check Firebase Storage for default videos/intro-video.mp4
          if (!resolvedIntroVideoUrl) {
            try {
              const directStorageUrl = await getStorageDownloadUrl('videos/intro-video.mp4');
              if (directStorageUrl && directStorageUrl.startsWith('http')) {
                resolvedIntroVideoUrl = directStorageUrl;
              }
            } catch (e) {
              // Ignore if not found
            }
          }

          const merged: SchoolContentState = {
            ...DEFAULT_CONTENT_STATE,
            ...current,
            ...remote,
            dailyThought: {
              ...DEFAULT_CONTENT_STATE.dailyThought,
              ...(remote.dailyThought || current.dailyThought),
            },
            events: Array.isArray(remote.events) ? remote.events : current.events,
            galleryPhotos: (Array.isArray(remote.galleryPhotos)
              ? remote.galleryPhotos
              : current.galleryPhotos
            ).filter((p) => isFirebaseStorageUrl(p?.imageUrl)),
            activityReels: Array.isArray(remote.activityReels) && remote.activityReels.length > 0
              ? remote.activityReels
              : (current.activityReels || DEFAULT_ACTIVITY_REELS),
            teachers: Array.isArray(remote.teachers) && remote.teachers.length > 0
              ? remote.teachers
              : (current.teachers || DEFAULT_TEACHERS),
            missionVision: {
              ...DEFAULT_CONTENT_STATE.missionVision,
              ...(remote.missionVision || current.missionVision),
            },
            introVideoUrl: resolvedIntroVideoUrl,
          };

          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
          window.dispatchEvent(new CustomEvent(UPDATE_EVENT_NAME, { detail: merged }));
          syncActivityReelsFromStorage().catch(() => {});
          syncGalleryPhotosFromStorage().catch(() => {});
        } else {
          // Initialize first document in Firestore only if authenticated staff is logged in
          if (auth.currentUser) {
            setDoc(docRef, DEFAULT_CONTENT_STATE).catch((err) => {
              console.warn('Initial Firestore seed warning:', err);
            });
          }
        }
      },
      (err) => {
        // Fall back gracefully to local storage cache if offline or network failure
        console.warn('Firestore snapshot notice (operating from cache):', err?.message || err);
      }
    );
  } catch (err) {
    console.warn('Failed to attach Firestore snapshot listener:', err);
  }
}

export const getSchoolContent = (): SchoolContentState => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);

      // Strict enforcement: only remote Firebase Storage URLs are accepted for video playback
      const validIntroUrl =
        typeof parsed.introVideoUrl === 'string' && parsed.introVideoUrl.startsWith('http')
          ? parsed.introVideoUrl
          : '';

      let sanitizedReels = Array.isArray(parsed.activityReels) && parsed.activityReels.length > 0
        ? parsed.activityReels
            .filter((r: ActivityReel) => r.id !== 'reel-1')
            .map((r: ActivityReel) => ({
              ...r,
              videoUrl: typeof r.videoUrl === 'string' && r.videoUrl.startsWith('http') ? r.videoUrl : '',
            }))
        : DEFAULT_ACTIVITY_REELS;

      return {
        ...DEFAULT_CONTENT_STATE,
        ...parsed,
        introVideoUrl: validIntroUrl,
        dailyThought: { ...DEFAULT_CONTENT_STATE.dailyThought, ...(parsed.dailyThought || {}) },
        events: Array.isArray(parsed.events) ? parsed.events : DEFAULT_CONTENT_STATE.events,
        galleryPhotos: Array.isArray(parsed.galleryPhotos)
          ? parsed.galleryPhotos.filter((p: StaffGalleryPhoto) => isFirebaseStorageUrl(p?.imageUrl))
          : [],
        activityReels: sanitizedReels,
        teachers: Array.isArray(parsed.teachers) && parsed.teachers.length > 0
          ? parsed.teachers
          : DEFAULT_TEACHERS,
        missionVision: { ...DEFAULT_CONTENT_STATE.missionVision, ...(parsed.missionVision || {}) },
      };
    }
  } catch (err) {
    console.error('Error reading school content from storage:', err);
  }
  return DEFAULT_CONTENT_STATE;
};

export const saveSchoolContent = (content: Partial<SchoolContentState>): SchoolContentState => {
  try {
    const current = getSchoolContent();
    const updated: SchoolContentState = {
      ...current,
      ...content,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(UPDATE_EVENT_NAME, { detail: updated }));

    // Async sync to Cloud Firestore
    try {
      const docRef = doc(db, 'schoolContent', 'general');
      setDoc(docRef, updated, { merge: true }).catch((err) => {
        console.warn('Firestore save warning:', err);
      });
    } catch (err) {
      console.warn('Firestore sync failed:', err);
    }

    return updated;
  } catch (err) {
    console.error('Error saving school content:', err);
    return getSchoolContent();
  }
};

/**
 * Upload Home Intro Video to Firebase Storage and sync URL to Firestore
 */
export async function uploadHomeIntroVideo(
  file: File,
  onProgress?: (pct: number) => void
): Promise<string> {
  const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const storagePath = `videos/intro_${Date.now()}_${cleanName}`;

  const { downloadUrl } = await uploadFileToStorage(storagePath, file, onProgress);

  saveSchoolContent({
    introVideoUrl: downloadUrl,
    introVideoStoragePath: storagePath,
  });

  return downloadUrl;
}

/**
 * Upload Gallery Photo directly to Firebase Storage and save metadata to Firestore
 */
export async function uploadGalleryPhotoToStorage(
  file: File,
  meta: {
    title: string;
    category: 'Festival' | 'Sports' | 'Academic' | 'Arts' | 'Campus' | 'All';
    date: string;
    description: string;
  },
  onProgress?: (pct: number) => void
): Promise<StaffGalleryPhoto> {
  const photoId = 'sgp-' + Date.now();
  const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const storagePath = `gallery/${photoId}_${cleanName}`;

  const cleanTitle = meta.title.trim() || file.name.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' ');
  const cleanDate =
    meta.date.trim() || new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  const cleanDescription =
    meta.description.trim() ||
    'Vibrant learning activity and school celebration captured at The Silver Hills School.';

  const { downloadUrl } = await uploadFileToStorage(storagePath, file, onProgress, {
    photoId,
    title: cleanTitle,
    category: meta.category,
    date: cleanDate,
    description: cleanDescription,
  });

  const newPhoto: StaffGalleryPhoto = {
    id: photoId,
    title: cleanTitle,
    category: meta.category,
    date: cleanDate,
    imageUrl: downloadUrl,
    storagePath,
    description: cleanDescription,
    likes: Math.floor(Math.random() * 25) + 15,
    uploadedAt: new Date().toISOString(),
  };

  const current = getSchoolContent();
  const existingPhotos = current.galleryPhotos.filter(
    (p) => p.id !== photoId && p.storagePath !== storagePath && isFirebaseStorageUrl(p.imageUrl)
  );
  const updatedPhotos = [newPhoto, ...existingPhotos];
  saveSchoolContent({ galleryPhotos: updatedPhotos });

  return newPhoto;
}

/**
 * Discover and sync any uploaded gallery photos directly from Firebase Storage `gallery/`
 * so only photos fetched from Firebase Storage appear in Gallery sections.
 */
export async function syncGalleryPhotosFromStorage(): Promise<StaffGalleryPhoto[]> {
  const current = getSchoolContent();
  const existingPhotos = (current.galleryPhotos || []).filter((p) =>
    isFirebaseStorageUrl(p?.imageUrl)
  );
  const storageItems = await listStorageFolderFiles('gallery');

  if (!storageItems || storageItems.length === 0) {
    return existingPhotos;
  }

  // Sort newest Storage uploads first
  const sortedItems = [...storageItems].sort((a, b) => {
    const timeA = a.timeCreated ? Date.parse(a.timeCreated) : 0;
    const timeB = b.timeCreated ? Date.parse(b.timeCreated) : 0;
    return timeB - timeA;
  });

  let changed = false;
  const mergedPhotos: StaffGalleryPhoto[] = [...existingPhotos];

  for (const item of sortedItems) {
    if (!isFirebaseStorageUrl(item.downloadUrl)) continue;

    const metaId = item.customMetadata?.photoId;
    const prefixMatch = item.name.match(/^(sgp-\d+)_(.+)$/);
    const derivedId = metaId || (prefixMatch ? prefixMatch[1] : `sgp-${item.name}`);

    const existingIdx = mergedPhotos.findIndex(
      (p) =>
        p.storagePath === item.fullPath ||
        p.imageUrl === item.downloadUrl ||
        p.id === derivedId
    );

    if (existingIdx !== -1) {
      const existing = mergedPhotos[existingIdx];
      if (!isFirebaseStorageUrl(existing.imageUrl) || !existing.storagePath) {
        mergedPhotos[existingIdx] = {
          ...existing,
          imageUrl: item.downloadUrl,
          storagePath: item.fullPath,
        };
        changed = true;
      }
      continue;
    }

    const rawName = prefixMatch ? prefixMatch[2] : item.name;
    const cleanedFilename = rawName
      .replace(/\.[^/.]+$/, '')
      .replace(/[_-]+/g, ' ')
      .trim();

    const validCategories: StaffGalleryPhoto['category'][] = [
      'Festival',
      'Sports',
      'Academic',
      'Arts',
      'Campus',
      'All',
    ];
    const metaCategory = item.customMetadata?.category as StaffGalleryPhoto['category'] | undefined;
    const category =
      metaCategory && validCategories.includes(metaCategory) ? metaCategory : 'Campus';

    const createdDate = item.timeCreated
      ? new Date(item.timeCreated).toLocaleDateString('en-US', {
          month: 'short',
          year: 'numeric',
        })
      : new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

    const newPhoto: StaffGalleryPhoto = {
      id: derivedId,
      title: item.customMetadata?.title || cleanedFilename || 'School Gallery Moment',
      category,
      date: item.customMetadata?.date || createdDate,
      imageUrl: item.downloadUrl,
      storagePath: item.fullPath,
      description:
        item.customMetadata?.description ||
        'Vibrant learning activity and school celebration captured at The Silver Hills School.',
      likes: 24,
      uploadedAt: item.timeCreated || new Date().toISOString(),
    };

    mergedPhotos.unshift(newPhoto);
    changed = true;
  }

  if (changed) {
    const updated: SchoolContentState = {
      ...current,
      galleryPhotos: mergedPhotos,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent(UPDATE_EVENT_NAME, { detail: updated }));
    } catch (err) {
      console.warn('Could not cache synced gallery photos:', err);
    }
  }

  return mergedPhotos;
}

/**
 * Delete a Gallery Photo from Firebase Storage and Firestore
 */
export async function deleteGalleryPhoto(id: string): Promise<void> {
  const current = getSchoolContent();
  const target = current.galleryPhotos.find((p) => p.id === id);

  if (target?.storagePath) {
    deleteFileFromStorage(target.storagePath).catch(() => {});
  }

  const updatedPhotos = current.galleryPhotos.filter((p) => p.id !== id);
  saveSchoolContent({ galleryPhotos: updatedPhotos });
}

/**
 * Upload an Activity Reel video to Firebase Storage and save to Firestore
 */
export async function uploadActivityReelToStorage(
  file: File,
  meta: {
    title: string;
    category: string;
    tag: string;
  },
  onProgress?: (pct: number) => void
): Promise<ActivityReel> {
  const reelId = 'reel-' + Date.now();
  const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const storagePath = `activities/${reelId}_${cleanName}`;

  const cleanTitle = meta.title.trim() || file.name.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' ');
  const cleanCategory = meta.category.trim() || 'School Activity';
  const cleanTag = meta.tag.trim() || '#TSHSActivities';

  const { downloadUrl } = await uploadFileToStorage(storagePath, file, onProgress, {
    reelId,
    title: cleanTitle,
    category: cleanCategory,
    tag: cleanTag,
  });

  const newReel: ActivityReel = {
    id: reelId,
    title: cleanTitle,
    category: cleanCategory,
    tag: cleanTag,
    videoUrl: downloadUrl,
    storagePath,
  };

  const current = getSchoolContent();
  const existingReels = (current.activityReels || []).filter(
    (r) => r.id !== reelId && r.storagePath !== storagePath
  );
  const updatedReels = [newReel, ...existingReels];
  saveSchoolContent({ activityReels: updatedReels });

  return newReel;
}

/**
 * Discover and sync any uploaded activity videos directly from Firebase Storage `activities/`
 * so videos saved in Storage always appear as cards in Our School Activities.
 */
export async function syncActivityReelsFromStorage(): Promise<ActivityReel[]> {
  const current = getSchoolContent();
  const existingReels = current.activityReels || [];
  const storageItems = await listStorageFolderFiles('activities');

  if (!storageItems || storageItems.length === 0) {
    return existingReels;
  }

  // Sort newest Storage uploads first
  const sortedItems = [...storageItems].sort((a, b) => {
    const timeA = a.timeCreated ? Date.parse(a.timeCreated) : 0;
    const timeB = b.timeCreated ? Date.parse(b.timeCreated) : 0;
    return timeB - timeA;
  });

  let changed = false;
  const mergedReels: ActivityReel[] = [...existingReels];

  for (const item of sortedItems) {
    const metaId = item.customMetadata?.reelId;
    const prefixMatch = item.name.match(/^(reel-\d+)_(.+)$/);
    const derivedId = metaId || (prefixMatch ? prefixMatch[1] : `reel-${item.name}`);

    const existingIdx = mergedReels.findIndex(
      (r) =>
        r.storagePath === item.fullPath ||
        r.videoUrl === item.downloadUrl ||
        r.id === derivedId ||
        item.name === `${r.id}.mp4`
    );

    if (existingIdx !== -1) {
      const existing = mergedReels[existingIdx];
      if (!existing.videoUrl || !existing.storagePath) {
        mergedReels[existingIdx] = {
          ...existing,
          videoUrl: item.downloadUrl,
          storagePath: item.fullPath,
        };
        changed = true;
      }
      continue;
    }

    // Build readable title from custom metadata or filename
    const rawName = prefixMatch ? prefixMatch[2] : item.name;
    const cleanedFilename = rawName
      .replace(/\.[^/.]+$/, '')
      .replace(/[_-]+/g, ' ')
      .trim();

    const newReel: ActivityReel = {
      id: derivedId,
      title: item.customMetadata?.title || cleanedFilename || 'School Activity Reel',
      category: item.customMetadata?.category || 'School Activities',
      tag: item.customMetadata?.tag || '#TSHSActivities',
      videoUrl: item.downloadUrl,
      storagePath: item.fullPath,
    };

    // Place newly discovered uploaded reels at the front
    mergedReels.unshift(newReel);
    changed = true;
  }

  if (changed) {
    const updated: SchoolContentState = {
      ...current,
      activityReels: mergedReels,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent(UPDATE_EVENT_NAME, { detail: updated }));
    } catch (err) {
      console.warn('Could not cache synced activity reels:', err);
    }
  }

  return mergedReels;
}

/**
 * Delete an Activity Reel from Firebase Storage and Firestore
 */
export async function deleteActivityReel(id: string): Promise<void> {
  const current = getSchoolContent();
  const target = current.activityReels?.find((r) => r.id === id);

  if (target?.storagePath) {
    deleteFileFromStorage(target.storagePath).catch(() => {});
  }

  const updatedReels = (current.activityReels || []).filter((r) => r.id !== id);
  saveSchoolContent({ activityReels: updatedReels });
}

/**
 * Upload a Teacher Profile photo to Firebase Storage and update list in Firestore
 */
export async function uploadTeacherToStorage(
  file: File,
  meta: {
    name: string;
    role: string;
    qualification: string;
  },
  onProgress?: (pct: number) => void
): Promise<Teacher> {
  const teacherId = 'teacher-' + Date.now();
  const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const storagePath = `teachers/${teacherId}_${cleanName}`;

  const { downloadUrl } = await uploadFileToStorage(storagePath, file, onProgress);

  const newTeacher: Teacher = {
    id: teacherId,
    name: meta.name.trim(),
    role: meta.role.trim(),
    qualification: meta.qualification.trim(),
    imageUrl: downloadUrl,
    storagePath,
  };

  const current = getSchoolContent();
  const updatedTeachers = [...(current.teachers || []), newTeacher];
  saveSchoolContent({ teachers: updatedTeachers });

  return newTeacher;
}

/**
 * Delete a Teacher Profile
 */
export async function deleteTeacher(id: string): Promise<void> {
  const current = getSchoolContent();
  const target = current.teachers?.find((t) => t.id === id);

  if (target?.storagePath) {
    deleteFileFromStorage(target.storagePath).catch(() => {});
  }

  const updatedTeachers = (current.teachers || []).filter((t) => t.id !== id);
  saveSchoolContent({ teachers: updatedTeachers });
}

/**
 * Helper to compress and read image file for instant local preview while uploading
 */
export const compressAndReadImageFile = (
  file: File,
  maxWidth = 1400,
  maxHeight = 1000,
  quality = 0.82
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to parse image file'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};

export const subscribeToSchoolContent = (
  callback: (content: SchoolContentState) => void
): (() => void) => {
  initFirestoreSync();

  const handleUpdate = (e: Event) => {
    const customEvent = e as CustomEvent<SchoolContentState>;
    if (customEvent.detail) {
      callback(customEvent.detail);
    } else {
      callback(getSchoolContent());
    }
  };

  window.addEventListener(UPDATE_EVENT_NAME, handleUpdate);
  window.addEventListener('storage', handleUpdate);

  return () => {
    window.removeEventListener(UPDATE_EVENT_NAME, handleUpdate);
    window.removeEventListener('storage', handleUpdate);
  };
};
