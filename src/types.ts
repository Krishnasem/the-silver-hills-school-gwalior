export interface NavItem {
  name: string;
  href: string;
  hasDropdown?: boolean;
  dropdownItems?: { name: string; href: string }[];
}

export interface AgeProgram {
  id: string;
  title: string;
  age: string;
  description: string;
  bgColor: string;
  borderColor: string;
  iconBg: string;
}

export interface LearningProgram {
  id: string;
  title: string;
  duration: string;
  students: number;
  reviews: number;
  rating: number;
  imageUrl: string;
  category?: string;
}

export interface Teacher {
  id: string;
  name: string;
  role: string;
  imageUrl: string;
  qualification?: string;
  storagePath?: string;
}

export interface ActivityReel {
  id: string;
  category: string;
  tag: string;
  videoUrl: string;
  title?: string;
  storagePath?: string;
}

export interface StaffGalleryPhoto {
  id: string;
  title: string;
  category: 'Festival' | 'Sports' | 'Academic' | 'Arts' | 'Campus' | 'All';
  date: string;
  imageUrl: string;
  storagePath?: string;
  description: string;
  likes: number;
  uploadedAt: string;
}

export interface SchoolNoticeItem {
  id: string;
  date: string;
  badge: 'Admissions' | 'Exam' | 'Notice' | 'Celebration' | 'Holiday' | 'Sports' | 'Workshop' | 'Circular';
  title: string;
  type?: 'new' | 'upcoming' | 'event';
  description?: string;
  attachmentUrl?: string; // Firebase Storage URL
  attachmentName?: string;
  storagePath?: string;
}

export interface DailyThought {
  quote: string;
  author: string;
  tag: string;
  updatedAt?: string;
  imageUrl?: string;
}

export interface SchoolContentState {
  dailyThought: DailyThought;
  events: SchoolNoticeItem[];
  galleryPhotos: StaffGalleryPhoto[];
  missionVision: {
    missionText: string;
    visionText: string;
    visionPoints?: string[];
  };
  adminPin: string;
  introVideoUrl?: string;
  introVideoStoragePath?: string;
  activityReels?: ActivityReel[];
  teachers?: Teacher[];
}

export interface StatItem {
  id: string;
  value: string;
  label: string;
  iconName: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  rating: number;
}

export interface PartnerBrand {
  id: string;
  name: string;
  tagline?: string;
  iconType: 'castle' | 'kids' | 'toys' | 'fun' | 'tree' | 'school';
  color: string;
}

export interface SessionSchedule {
  id: string;
  title: string;
  time: string;
}

export interface BlogPost {
  id: string;
  title: string;
  authorName: string;
  authorAvatar: string;
  category: string;
  readTime: string;
  commentsCount: number;
  imageUrl: string;
}
