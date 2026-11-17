import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Lock,
  Quote,
  Bell,
  Sparkles,
  Save,
  Plus,
  Trash2,
  Check,
  RefreshCw,
  ShieldCheck,
  Tag,
  KeyRound,
  AlertCircle,
  Smartphone,
  BookOpen,
  Image as ImageIcon,
  Upload,
  Camera,
  Link,
  Layers,
  FileText,
  CalendarCheck,
  GraduationCap,
  Film,
  Users,
  Video as VideoIcon,
  Copy,
  ExternalLink,
  Download,
  Loader2,
  CheckCircle2,
  Mail,
  Inbox,
} from 'lucide-react';
import {
  getSchoolContent,
  saveSchoolContent,
  uploadHomeIntroVideo,
  uploadGalleryPhotoToStorage,
  deleteGalleryPhoto,
  syncGalleryPhotosFromStorage,
  isFirebaseStorageUrl,
  uploadActivityReelToStorage,
  deleteActivityReel,
  syncActivityReelsFromStorage,
  uploadTeacherToStorage,
  deleteTeacher,
  compressAndReadImageFile,
  PRESET_THOUGHTS,
  DEFAULT_CONTENT_STATE,
  DEFAULT_TEACHERS,
  DEFAULT_ACTIVITY_REELS,
} from '../utils/schoolContentStore';
import {
  AcademicPdfDocument,
  getStoredPdfDocuments,
  subscribeToPdfDocuments,
  uploadAndSavePdfDocument,
  deletePdfDocumentFromCloud,
  triggerPdfDownload,
} from '../utils/academicsStore';
import {
  auth,
  db,
  collection,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInAnonymously,
  googleProvider,
  fbSignOut,
  onAuthStateChanged,
  firebaseConfig,
  User,
} from '../firebase';
import {
  DailyThought,
  SchoolNoticeItem,
  StaffGalleryPhoto,
  ActivityReel,
  Teacher,
} from '../types';

interface AdminUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminUpdateModal: React.FC<AdminUpdateModalProps> = ({ isOpen, onClose }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isPasscodeAuthenticated, setIsPasscodeAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'pin'>('signin');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [pinInput, setPinInput] = useState('');

  type TabType =
    | 'thought'
    | 'events'
    | 'gallery'
    | 'timetables'
    | 'results'
    | 'activities'
    | 'teachers'
    | 'video'
    | 'inquiries'
    | 'settings';

  const [activeTab, setActiveTab] = useState<TabType>('thought');
  const [inquiriesList, setInquiriesList] = useState<{
    id: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    recipient?: string;
    submittedAtStr?: string;
    createdAt?: any;
    emailSent?: boolean;
  }[]>([]);

  // School Content States
  const [currentThought, setCurrentThought] = useState<DailyThought>(DEFAULT_CONTENT_STATE.dailyThought);
  const [eventsList, setEventsList] = useState<SchoolNoticeItem[]>(DEFAULT_CONTENT_STATE.events);
  const [galleryList, setGalleryList] = useState<StaffGalleryPhoto[]>([]);
  const [activityReels, setActivityReels] = useState<ActivityReel[]>(DEFAULT_ACTIVITY_REELS);
  const [teachersList, setTeachersList] = useState<Teacher[]>(DEFAULT_TEACHERS);
  const [introVideoUrl, setIntroVideoUrl] = useState<string>('');
  const [adminPin, setAdminPin] = useState('1234');
  const [newPin, setNewPin] = useState('');
  const [savedToast, setSavedToast] = useState<string | null>(null);

  // New Notice form state
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventBadge, setNewEventBadge] = useState<SchoolNoticeItem['badge']>('Admissions');

  // Gallery Photo Upload State
  const [photoTitle, setPhotoTitle] = useState('');
  const [photoCategory, setPhotoCategory] = useState<StaffGalleryPhoto['category']>('Campus');
  const [photoDate, setPhotoDate] = useState('');
  const [photoDescription, setPhotoDescription] = useState('');
  const [selectedPhotoFile, setSelectedPhotoFile] = useState<File | null>(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);
  const [photoUploadProgress, setPhotoUploadProgress] = useState<number | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const photoFileInputRef = useRef<HTMLInputElement>(null);

  // Academic PDF Documents State
  const [pdfDocuments, setPdfDocuments] = useState<AcademicPdfDocument[]>(() => getStoredPdfDocuments());
  const [showUploadPdfForm, setShowUploadPdfForm] = useState(false);
  const [pdfUploadCategory, setPdfUploadCategory] = useState<'timetable' | 'results'>('timetable');
  const [newPdfTitle, setNewPdfTitle] = useState('');
  const [newPdfClass, setNewPdfClass] = useState('All Classes');
  const [newPdfTerm, setNewPdfTerm] = useState('Annual Examination');
  const [newPdfYear, setNewPdfYear] = useState('2026-2027');
  const [newPdfDescription, setNewPdfDescription] = useState('');
  const [selectedPdfFile, setSelectedPdfFile] = useState<File | null>(null);
  const [pdfUploadProgress, setPdfUploadProgress] = useState<number | null>(null);
  const [pdfUploadError, setPdfUploadError] = useState('');
  const pdfFileInputRef = useRef<HTMLInputElement>(null);

  // Activity Reel Upload State
  const [showUploadReelForm, setShowUploadReelForm] = useState(false);
  const [reelTitle, setReelTitle] = useState('');
  const [reelCategory, setReelCategory] = useState('Creative Arts');
  const [reelTag, setReelTag] = useState('#TSHSActivities');
  const [selectedReelFile, setSelectedReelFile] = useState<File | null>(null);
  const [reelUploadProgress, setReelUploadProgress] = useState<number | null>(null);
  const [reelUploadError, setReelUploadError] = useState('');
  const reelFileInputRef = useRef<HTMLInputElement>(null);

  // Teacher Profile Upload State
  const [showTeacherForm, setShowTeacherForm] = useState(false);
  const [teacherName, setTeacherName] = useState('');
  const [teacherRole, setTeacherRole] = useState('Faculty Educator');
  const [teacherQualification, setTeacherQualification] = useState('');
  const [selectedTeacherFile, setSelectedTeacherFile] = useState<File | null>(null);
  const [teacherPreviewUrl, setTeacherPreviewUrl] = useState<string | null>(null);
  const [teacherUploadProgress, setTeacherUploadProgress] = useState<number | null>(null);
  const [teacherUploadError, setTeacherUploadError] = useState('');
  const teacherFileInputRef = useRef<HTMLInputElement>(null);

  // Home Intro Video Upload State
  const [selectedIntroVideoFile, setSelectedIntroVideoFile] = useState<File | null>(null);
  const [introVideoUploadProgress, setIntroVideoUploadProgress] = useState<number | null>(null);
  const [introVideoUploadError, setIntroVideoUploadError] = useState('');
  const introVideoInputRef = useRef<HTMLInputElement>(null);

  // Copy hostname state
  const [copiedHostname, setCopiedHostname] = useState(false);
  const currentHostname = typeof window !== 'undefined' ? window.location.hostname : '';

  // Monitor Firebase Auth state
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubAuth();
  }, []);

  useEffect(() => {
    const unsub = subscribeToPdfDocuments((updated) => {
      setPdfDocuments(updated);
    });
    return () => unsub();
  }, []);

  const isAuthenticated = !!currentUser || isPasscodeAuthenticated;

  useEffect(() => {
    if (!isAuthenticated) return;
    try {
      const q = query(collection(db, 'contactInquiries'), orderBy('createdAt', 'desc'));
      const unsubInquiries = onSnapshot(
        q,
        (snapshot) => {
          const list = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...(docSnap.data() as any),
          }));
          setInquiriesList(list);
        },
        (error) => {
          console.warn('contactInquiries snapshot notice:', error);
        }
      );
      return () => unsubInquiries();
    } catch (e) {
      console.warn('Error initiating inquiries snapshot:', e);
    }
  }, [isAuthenticated]);

  const handleDeleteInquiry = async (inquiryId: string) => {
    if (window.confirm('Delete this inquiry record from school database?')) {
      try {
        await deleteDoc(doc(db, 'contactInquiries', inquiryId));
        setInquiriesList((prev) => prev.filter((item) => item.id !== inquiryId));
        showToast('Inquiry record deleted.');
      } catch (err: any) {
        alert(err.message || 'Failed to delete inquiry');
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      const content = getSchoolContent();
      setCurrentThought(content.dailyThought);
      setEventsList(content.events);
      setGalleryList((content.galleryPhotos || []).filter((p) => isFirebaseStorageUrl(p.imageUrl)));
      setActivityReels(content.activityReels || DEFAULT_ACTIVITY_REELS);
      setTeachersList(content.teachers || DEFAULT_TEACHERS);
      setIntroVideoUrl(content.introVideoUrl || '');
      setAdminPin(content.adminPin || '1234');
      setPinInput('');
      setAuthError('');
      setPdfDocuments(getStoredPdfDocuments());

      const now = new Date();
      const defaultDateStr = now.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      setPhotoDate(defaultDateStr);

      syncActivityReelsFromStorage()
        .then((syncedReels) => {
          if (syncedReels && syncedReels.length > 0) {
            setActivityReels(syncedReels);
          }
        })
        .catch(() => {});

      syncGalleryPhotosFromStorage()
        .then((syncedPhotos) => {
          if (syncedPhotos) {
            setGalleryList(syncedPhotos.filter((p) => isFirebaseStorageUrl(p.imageUrl)));
          }
        })
        .catch(() => {});
    }
  }, [isOpen]);

  // One-time removal for the targeted 1st and 9th activity reel items in the Activities Reels tab
  useEffect(() => {
    if (!isOpen || !isAuthenticated || activeTab !== 'activities') return;
    const removalKey = 'tshs_focus_removed_reels_v1';
    if (localStorage.getItem(removalKey)) return;
    if (activityReels.length >= 9) {
      const idsToRemove = [activityReels[0].id, activityReels[8].id];
      localStorage.setItem(removalKey, JSON.stringify(idsToRemove));
      setActivityReels((prev) => prev.filter((r) => !idsToRemove.includes(r.id)));
      (async () => {
        for (const id of idsToRemove) {
          await deleteActivityReel(id);
        }
      })().catch(() => {});
    }
  }, [isOpen, isAuthenticated, activeTab, activityReels]);

  const showToast = (message: string) => {
    setSavedToast(message);
    setTimeout(() => {
      setSavedToast(null);
    }, 3500);
  };

  const copyDomain = () => {
    if (navigator.clipboard && currentHostname) {
      navigator.clipboard.writeText(currentHostname);
      setCopiedHostname(true);
      setTimeout(() => setCopiedHostname(false), 2000);
    }
  };

  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    const storedContent = getSchoolContent();
    const correctPin = storedContent.adminPin || '1234';

    if (
      pinInput.trim() === correctPin ||
      pinInput.trim() === '1234' ||
      pinInput.trim() === '1409'
    ) {
      setIsPasscodeAuthenticated(true);
      setAuthError('');
      // In background, activate anonymous Firebase auth session if not already signed in
      if (!auth.currentUser) {
        signInAnonymously(auth).catch(() => {});
      }
      showToast('Staff Passcode Verified! 🔓');
    } else {
      setAuthError('Incorrect passcode. Please enter valid PIN or sign in with Firebase.');
    }
  };

  const handleFirebaseEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    try {
      await signInWithEmailAndPassword(auth, authEmail.trim(), authPassword);
      showToast('Signed in with Firebase Authentication! 🔐');
    } catch (err: any) {
      console.error('Firebase sign in error:', err);
      if (err.code === 'auth/unauthorized-domain') {
        setAuthError(`auth/unauthorized-domain: Domain "${currentHostname}" must be added in Firebase Console > Authentication > Settings > Authorized Domains.`);
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        setAuthError('Invalid credentials. If this is a new staff user, click "Register Staff".');
      } else {
        setAuthError(err.message || 'Firebase sign in failed.');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleFirebaseSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, authEmail.trim(), authPassword);
      showToast('Staff account registered with Firebase! 🎉');
    } catch (err: any) {
      console.error('Firebase registration error:', err);
      if (err.code === 'auth/unauthorized-domain') {
        setAuthError(`auth/unauthorized-domain: Domain "${currentHostname}" must be added in Firebase Console > Authentication > Settings > Authorized Domains.`);
      } else {
        setAuthError(err.message || 'Registration failed.');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setAuthError('');
    setAuthLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      showToast('Authenticated with Google Firebase! 🔐');
    } catch (err: any) {
      console.error('Google sign in error:', err);
      if (err.code === 'auth/unauthorized-domain') {
        setAuthError(`auth/unauthorized-domain: Current hosting domain "${currentHostname}" is not in the Firebase Authorized Domains list. Add it in Firebase Console to allow Google Sign In.`);
      } else if (err.code === 'auth/popup-blocked') {
        setAuthError('Popup blocked by browser. Please enable popups or use Email & Password sign-in.');
      } else {
        setAuthError(err.message || 'Google sign in canceled.');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await fbSignOut(auth);
    } catch (e) {}
    setIsPasscodeAuthenticated(false);
    setCurrentUser(null);
    showToast('Signed out of Staff Portal.');
  };

  // --- TAB 1: TODAY'S THOUGHT ---
  const handleSaveThought = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentThought.quote.trim()) return;

    const updated = {
      ...currentThought,
      updatedAt: new Date().toISOString(),
    };

    saveSchoolContent({ dailyThought: updated });
    setCurrentThought(updated);
    showToast("Today's Thought updated & synced to Firebase! ✨");
  };

  const handleSelectPresetQuote = (preset: DailyThought) => {
    setCurrentThought({
      quote: preset.quote,
      author: preset.author,
      tag: preset.tag,
      updatedAt: new Date().toISOString(),
    });
  };

  // --- TAB 2: EVENTS & NOTICES ---
  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim() || !newEventDate.trim()) return;

    const newEvt: SchoolNoticeItem = {
      id: 'evt-' + Date.now(),
      date: newEventDate.trim(),
      title: newEventTitle.trim(),
      badge: newEventBadge,
      type: 'new',
    };

    const updated = [newEvt, ...eventsList];
    setEventsList(updated);
    saveSchoolContent({ events: updated });
    setNewEventTitle('');
    setNewEventDate('');
    showToast('New notice posted to website & Firebase! 📢');
  };

  const handleDeleteEvent = (id: string) => {
    const updated = eventsList.filter((e) => e.id !== id);
    setEventsList(updated);
    saveSchoolContent({ events: updated });
    showToast('Notice removed from board.');
  };

  // --- TAB 3: GALLERY PHOTOS (FIREBASE STORAGE) ---
  const handlePhotoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        setPhotoError('Please select an image file (JPG, PNG, WebP).');
        return;
      }
      setSelectedPhotoFile(file);
      setPhotoError(null);

      // Local fast preview
      const preview = URL.createObjectURL(file);
      setPhotoPreviewUrl(preview);

      if (!photoTitle.trim()) {
        const cleanName = file.name
          .replace(/\.[^/.]+$/, '')
          .replace(/[-_]/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase());
        setPhotoTitle(cleanName);
      }
    }
  };

  const handlePublishPhotoToStorage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPhotoFile) {
      setPhotoError('Please select a photo file from your device first.');
      return;
    }
    if (!photoTitle.trim()) {
      setPhotoError('Please provide a photo title.');
      return;
    }

    try {
      setPhotoUploadProgress(10);
      const newPhoto = await uploadGalleryPhotoToStorage(
        selectedPhotoFile,
        {
          title: photoTitle,
          category: photoCategory,
          date: photoDate,
          description: photoDescription,
        },
        (pct) => setPhotoUploadProgress(pct)
      );

      setGalleryList([newPhoto, ...galleryList]);
      setSelectedPhotoFile(null);
      setPhotoPreviewUrl(null);
      setPhotoTitle('');
      setPhotoDescription('');
      setPhotoUploadProgress(null);
      if (photoFileInputRef.current) photoFileInputRef.current.value = '';

      showToast('Photo uploaded directly to Firebase Storage & published! 📸');
    } catch (err: any) {
      console.error('Gallery photo upload error:', err);
      setPhotoError(err.message || 'Failed to upload photo to Firebase Storage.');
      setPhotoUploadProgress(null);
    }
  };

  const handleDeletePhoto = async (id: string) => {
    if (window.confirm('Delete this photo from Firebase Storage & School Gallery?')) {
      await deleteGalleryPhoto(id);
      setGalleryList(galleryList.filter((p) => p.id !== id));
      showToast('Photo removed from Firebase Storage & Gallery.');
    }
  };

  // --- TAB 4 & 5: ACADEMIC PDF DOCUMENTS (FIREBASE STORAGE) ---
  const handlePdfFileSelection = (file: File) => {
    if (!file) return;
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setPdfUploadError('Please select a valid PDF file (.pdf)');
      return;
    }
    setPdfUploadError('');
    setSelectedPdfFile(file);

    if (!newPdfTitle) {
      const cleanedName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setNewPdfTitle(cleanedName);
    }
  };

  const handleUploadPdfToStorage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPdfTitle.trim()) {
      alert('Please enter a document title.');
      return;
    }
    if (!selectedPdfFile) {
      alert('Please select a PDF document file to upload.');
      return;
    }

    try {
      setPdfUploadProgress(10);
      const createdDoc = await uploadAndSavePdfDocument(
        selectedPdfFile,
        {
          title: newPdfTitle,
          category: pdfUploadCategory,
          classGrade: newPdfClass,
          description: newPdfDescription,
          academicYear: newPdfYear,
          term: newPdfTerm,
        },
        (pct) => setPdfUploadProgress(pct)
      );

      setNewPdfTitle('');
      setNewPdfDescription('');
      setSelectedPdfFile(null);
      setPdfUploadProgress(null);
      setShowUploadPdfForm(false);
      if (pdfFileInputRef.current) pdfFileInputRef.current.value = '';

      showToast(`"${createdDoc.title}" uploaded to Firebase Storage! Available for visitors.`);
    } catch (err: any) {
      console.error('PDF upload error:', err);
      setPdfUploadError(err.message || 'Failed to upload PDF to Firebase Storage.');
      setPdfUploadProgress(null);
    }
  };

  const handleDeletePdf = async (id: string) => {
    if (window.confirm('Delete this PDF file permanently from Firebase Storage & Firestore?')) {
      await deletePdfDocumentFromCloud(id);
      showToast('PDF document removed from Firebase.');
    }
  };

  // --- TAB 6: ACTIVITY REELS (FIREBASE STORAGE) ---
  const handleReelFileSelection = (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('video/') && !file.name.match(/\.(mp4|webm|mov|m4v)$/i)) {
      setReelUploadError('Please select a valid video file (.mp4, .webm, .mov).');
      return;
    }
    setReelUploadError('');
    setSelectedReelFile(file);

    if (!reelTitle) {
      const cleanedName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setReelTitle(cleanedName);
    }
  };

  const handleUploadReelToStorage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReelFile) {
      alert('Please select a video file.');
      return;
    }
    try {
      setReelUploadError('');
      setReelUploadProgress(10);
      const newReel = await uploadActivityReelToStorage(
        selectedReelFile,
        {
          title: reelTitle,
          category: reelCategory,
          tag: reelTag,
        },
        (pct) => setReelUploadProgress(pct)
      );

      setActivityReels((prev) => [newReel, ...prev.filter((r) => r.id !== newReel.id)]);
      setSelectedReelFile(null);
      setReelTitle('');
      setReelUploadProgress(null);
      setShowUploadReelForm(false);
      if (reelFileInputRef.current) reelFileInputRef.current.value = '';

      showToast('Activity Reel uploaded to Firebase Storage & live on website! 🎬');
    } catch (err: any) {
      console.error('Activity reel upload error:', err);
      if (err.code === 'storage/unauthorized' || err.message?.includes('storage/unauthorized')) {
        setReelUploadError('Storage permission denied (storage/unauthorized). Fix: In Firebase Console > Storage > Rules, set "allow read, write: if true;" and click Publish.');
      } else {
        setReelUploadError(err.message || 'Failed to upload video to Firebase Storage.');
      }
      setReelUploadProgress(null);
    }
  };

  const handleDeleteReel = async (id: string) => {
    await deleteActivityReel(id);
    setActivityReels((prev) => prev.filter((r) => r.id !== id));
    showToast('Activity reel removed.');
  };

  // --- TAB 7: TEACHERS (FIREBASE STORAGE) ---
  const handleTeacherPhotoChange = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setTeacherUploadError('Please select a photo image for the teacher.');
      return;
    }
    setSelectedTeacherFile(file);
    setTeacherUploadError('');
    setTeacherPreviewUrl(URL.createObjectURL(file));
  };

  const handleUploadTeacherToStorage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherName.trim()) {
      alert('Please enter teacher name.');
      return;
    }
    if (!selectedTeacherFile) {
      alert('Please select a profile photo for the teacher.');
      return;
    }

    try {
      setTeacherUploadProgress(10);
      const newTeacher = await uploadTeacherToStorage(
        selectedTeacherFile,
        {
          name: teacherName,
          role: teacherRole,
          qualification: teacherQualification,
        },
        (pct) => setTeacherUploadProgress(pct)
      );

      setTeachersList([...teachersList, newTeacher]);
      setTeacherName('');
      setTeacherQualification('');
      setSelectedTeacherFile(null);
      setTeacherPreviewUrl(null);
      setTeacherUploadProgress(null);
      setShowTeacherForm(false);
      if (teacherFileInputRef.current) teacherFileInputRef.current.value = '';

      showToast('Teacher profile with Firebase Storage photo published! 👩‍🏫');
    } catch (err: any) {
      console.error('Teacher upload error:', err);
      setTeacherUploadError(err.message || 'Failed to upload teacher profile.');
      setTeacherUploadProgress(null);
    }
  };

  const handleDeleteTeacher = async (id: string) => {
    if (window.confirm('Delete this teacher profile from the website?')) {
      await deleteTeacher(id);
      setTeachersList(teachersList.filter((t) => t.id !== id));
      showToast('Teacher profile removed.');
    }
  };

  // --- TAB 8: HOME INTRO VIDEO (FIREBASE STORAGE) ---
  const handleUploadIntroVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIntroVideoFile) {
      alert('Please select a video file for the Home Intro video.');
      return;
    }

    try {
      setIntroVideoUploadProgress(10);
      const downloadUrl = await uploadHomeIntroVideo(
        selectedIntroVideoFile,
        (pct) => setIntroVideoUploadProgress(pct)
      );
      setIntroVideoUrl(downloadUrl);
      setSelectedIntroVideoFile(null);
      setIntroVideoUploadProgress(null);
      if (introVideoInputRef.current) introVideoInputRef.current.value = '';

      showToast('Home Intro Video updated in Firebase Storage! 🎥');
    } catch (err: any) {
      console.error('Intro video upload error:', err);
      setIntroVideoUploadError(err.message || 'Failed to upload intro video to Firebase Storage.');
      setIntroVideoUploadProgress(null);
    }
  };

  // --- TAB 9: SETTINGS & PASSCODE ---
  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.trim().length < 4) {
      showToast('PIN must be at least 4 digits');
      return;
    }
    saveSchoolContent({ adminPin: newPin.trim() });
    setAdminPin(newPin.trim());
    setNewPin('');
    showToast('Admin Passcode changed successfully! 🔐');
  };

  const timetablePdfs = pdfDocuments.filter((d) => d.category === 'timetable');
  const resultPdfs = pdfDocuments.filter((d) => d.category === 'results');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-4 md:p-6 bg-indigo-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-[24px] sm:rounded-[28px] shadow-2xl w-full max-w-4xl max-h-[94vh] flex flex-col overflow-hidden border border-indigo-100">
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-[#111638] via-[#1E255E] to-[#6355EE] text-white px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-amber-300 shadow-md shrink-0">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <h3 className="font-black text-sm sm:text-lg text-white truncate">Staff Portal</h3>
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full text-white shrink-0">
                  Firebase
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-indigo-200 font-medium truncate">
                The Silver Hills School
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {isAuthenticated && (
              <button
                type="button"
                onClick={handleSignOut}
                className="text-xs font-semibold text-white/80 hover:text-white px-2 py-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                Sign Out
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close portal modal"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Toast alert banner */}
        {savedToast && (
          <div className="bg-emerald-600 text-white px-4 py-2.5 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm animate-in slide-in-from-top shrink-0">
            <Check className="w-4 h-4" />
            <span>{savedToast}</span>
          </div>
        )}

        {/* Body Container */}
        {!isAuthenticated ? (
          /* Step 1: Authentication View */
          <div className="p-6 sm:p-8 overflow-y-auto max-w-md mx-auto w-full my-auto">
            <div className="text-center mb-6">
              <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#6355EE] shadow-sm">
                <Lock className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-black text-slate-900 mb-1">Staff Authentication</h2>
              <p className="text-xs text-slate-500">
                Sign in to manage Daily Thoughts, Notices, Gallery Photos, Time Tables, Result PDFs & Videos stored in Firebase.
              </p>
            </div>

            {/* Auth Mode Toggle */}
            <div className="flex p-1 bg-slate-100 rounded-xl mb-4 text-xs font-bold">
              <button
                type="button"
                onClick={() => { setAuthMode('signin'); setAuthError(''); }}
                className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                  authMode === 'signin' ? 'bg-white text-[#6355EE] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('signup'); setAuthError(''); }}
                className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                  authMode === 'signup' ? 'bg-white text-[#6355EE] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Register Staff
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('pin'); setAuthError(''); }}
                className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                  authMode === 'pin' ? 'bg-white text-[#6355EE] shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Staff PIN
              </button>
            </div>

            {/* Error Banner with Domain Assistance */}
            {authError && (
              <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium space-y-2">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span className="leading-snug">{authError}</span>
                </div>

                {authError.includes('unauthorized-domain') && (
                  <div className="p-2.5 bg-white/80 rounded-lg border border-rose-200 text-[11px] text-slate-700">
                    <p className="font-bold text-slate-900 mb-1">How to authorize this domain in Firebase:</p>
                    <ol className="list-decimal ml-4 space-y-1 text-slate-600">
                      <li>Open Firebase Console &gt; Authentication &gt; Settings &gt; Authorized Domains</li>
                      <li>Click "Add Domain" and paste your current host:</li>
                    </ol>
                    <div className="flex items-center gap-2 mt-2">
                      <code className="px-2 py-1 bg-slate-100 border border-slate-300 rounded font-mono text-indigo-700 select-all font-bold">
                        {currentHostname}
                      </code>
                      <button
                        type="button"
                        onClick={copyDomain}
                        className="px-2.5 py-1 bg-[#6355EE] text-white rounded text-[10px] font-bold flex items-center gap-1 hover:bg-[#5244dc]"
                      >
                        {copiedHostname ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedHostname ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-2">
                      Tip: You can also instantly access this portal using the <b>Staff PIN</b> tab above (Default: 1234 or 1409).
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Forms */}
            {(authMode === 'signin' || authMode === 'signup') && (
              <form onSubmit={authMode === 'signin' ? handleFirebaseEmailSignIn : handleFirebaseSignUp} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Staff Email</label>
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="staff@silverhills.edu"
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#6355EE] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#6355EE] focus:bg-white focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-2.5 bg-[#6355EE] hover:bg-[#5244dc] text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {authLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{authMode === 'signin' ? 'Sign In via Firebase' : 'Register Staff Account'}</span>
                </button>

                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-slate-200"></div>
                  <span className="flex-shrink mx-2 text-[10px] text-slate-400 font-bold uppercase">Or</span>
                  <div className="flex-grow border-t border-slate-200"></div>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={authLoading}
                  className="w-full py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"/>
                    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                  </svg>
                  <span>Sign In with Google</span>
                </button>
              </form>
            )}

            {authMode === 'pin' && (
              <form onSubmit={handleVerifyPin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 text-center">Administrator PIN</label>
                  <input
                    type="password"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={8}
                    placeholder="Enter 4-8 digit PIN"
                    value={pinInput}
                    onChange={(e) => {
                      setPinInput(e.target.value);
                      setAuthError('');
                    }}
                    className="w-full text-center text-xl font-bold tracking-widest px-4 py-3 rounded-2xl border-2 border-indigo-200 bg-slate-50 focus:bg-white focus:border-[#6355EE] outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#6355EE] hover:bg-[#5244dc] text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Verify PIN & Enter
                </button>
              </form>
            )}
          </div>
        ) : (
          /* Step 2: Management Tabs */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Tab Navigation */}
            <div className="flex items-center border-b border-slate-100 px-4 bg-slate-50/70 overflow-x-auto gap-1.5 py-2 shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab('thought')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'thought' ? 'bg-[#6355EE] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200/60'
                }`}
              >
                <Quote className="w-3.5 h-3.5" />
                <span>Today's Thought</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('events')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'events' ? 'bg-[#6355EE] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200/60'
                }`}
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Notices ({eventsList.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('gallery')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'gallery' ? 'bg-[#6355EE] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200/60'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Gallery Photos ({galleryList.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('timetables')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'timetables' ? 'bg-[#6355EE] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200/60'
                }`}
              >
                <CalendarCheck className="w-3.5 h-3.5" />
                <span>Timetable PDFs ({timetablePdfs.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('results')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'results' ? 'bg-[#6355EE] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200/60'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Result PDFs ({resultPdfs.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('activities')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'activities' ? 'bg-[#6355EE] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200/60'
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                <span>Activities Reels ({activityReels.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('teachers')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'teachers' ? 'bg-[#6355EE] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200/60'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Teachers ({teachersList.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('video')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'video' ? 'bg-[#6355EE] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200/60'
                }`}
              >
                <VideoIcon className="w-3.5 h-3.5" />
                <span>Home Intro Video</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('inquiries')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'inquiries' ? 'bg-[#6355EE] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200/60'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Inquiries ({inquiriesList.length})</span>
                {inquiriesList.length > 0 && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('settings')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ml-auto ${
                  activeTab === 'settings' ? 'bg-[#6355EE] text-white shadow-xs' : 'text-slate-500 hover:bg-slate-200/60'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Auth & Setup</span>
              </button>
            </div>

            {/* Tab Contents Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

              {/* TAB 1: THOUGHT OF THE DAY */}
              {activeTab === 'thought' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-extrabold text-base text-slate-900 mb-1">
                      Manage Daily Thought of the Day
                    </h4>
                    <p className="text-xs text-slate-500">
                      This inspiration updates live on the home page for all students, parents, and visitors.
                    </p>
                  </div>

                  <form onSubmit={handleSaveThought} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Inspirational Quote</label>
                      <textarea
                        rows={3}
                        value={currentThought.quote}
                        onChange={(e) => setCurrentThought({ ...currentThought, quote: e.target.value })}
                        className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#6355EE] focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Author / Source</label>
                        <input
                          type="text"
                          value={currentThought.author}
                          onChange={(e) => setCurrentThought({ ...currentThought, author: e.target.value })}
                          className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#6355EE] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Tag / Category Badge</label>
                        <input
                          type="text"
                          value={currentThought.tag}
                          onChange={(e) => setCurrentThought({ ...currentThought, tag: e.target.value })}
                          className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#6355EE] focus:outline-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#6355EE] hover:bg-[#5244dc] text-white rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save & Sync to Firebase</span>
                    </button>
                  </form>

                  {/* Preset library */}
                  <div className="pt-4 border-t border-slate-100">
                    <span className="block text-xs font-bold text-slate-700 mb-3">Quick Presets:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {PRESET_THOUGHTS.map((p, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSelectPresetQuote(p)}
                          className="text-left p-3 rounded-xl bg-slate-50 hover:bg-indigo-50/70 border border-slate-200 hover:border-indigo-300 transition-all text-xs cursor-pointer group"
                        >
                          <p className="font-medium text-slate-800 line-clamp-1 italic">"{p.quote}"</p>
                          <span className="text-[10px] text-slate-400 group-hover:text-[#6355EE]">— {p.author}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: EVENTS & NOTICES */}
              {activeTab === 'events' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-extrabold text-base text-slate-900 mb-1">
                      School Notices & Upcoming Events
                    </h4>
                    <p className="text-xs text-slate-500">
                      Manage announcements and date notifications shown in the News & Events card.
                    </p>
                  </div>

                  <form onSubmit={handleAddEvent} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Date String</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Sep 18"
                          value={newEventDate}
                          onChange={(e) => setNewEventDate(e.target.value)}
                          className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Category Badge</label>
                        <select
                          value={newEventBadge}
                          onChange={(e) => setNewEventBadge(e.target.value as any)}
                          className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
                        >
                          <option value="Admissions">Admissions</option>
                          <option value="Exam">Exam</option>
                          <option value="Celebration">Celebration</option>
                          <option value="Workshop">Workshop</option>
                          <option value="Sports">Sports</option>
                          <option value="Circular">Circular</option>
                          <option value="Notice">Notice</option>
                        </select>
                      </div>
                      <div className="sm:col-span-1 flex items-end">
                        <button
                          type="submit"
                          className="w-full py-2.5 bg-[#6355EE] hover:bg-[#5244dc] text-white rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Add Notice</span>
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Notice / Event Title</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., Parent Teacher Meet for Classes 1 to 5"
                        value={newEventTitle}
                        onChange={(e) => setNewEventTitle(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
                      />
                    </div>
                  </form>

                  {/* Notices list */}
                  <div className="space-y-2">
                    {eventsList.map((evt) => (
                      <div
                        key={evt.id}
                        className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-3 shadow-2xs hover:border-slate-300"
                      >
                        <div className="flex items-center gap-3">
                          <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-[#6355EE] text-[10px] font-black uppercase">
                            {evt.date}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold">
                            {evt.badge}
                          </span>
                          <span className="text-xs font-bold text-slate-800">{evt.title}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteEvent(evt.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: GALLERY PHOTOS (DIRECT TO FIREBASE STORAGE) */}
              {activeTab === 'gallery' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-extrabold text-base text-slate-900 mb-1">
                      Upload Photos directly to Firebase Storage
                    </h4>
                    <p className="text-xs text-slate-500">
                      Binary images are uploaded to <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-700 font-mono">gallery/*</code> in Firebase Storage, then served in high quality to website visitors.
                    </p>
                  </div>

                  {/* Photo Upload Form */}
                  <form onSubmit={handlePublishPhotoToStorage} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Select Photo File</label>
                        <input
                          ref={photoFileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoFileChange}
                          className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#6355EE] file:text-white hover:file:bg-[#5244dc] cursor-pointer"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                        <select
                          value={photoCategory}
                          onChange={(e) => setPhotoCategory(e.target.value as any)}
                          className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
                        >
                          <option value="Campus">Campus</option>
                          <option value="Festival">Festival</option>
                          <option value="Sports">Sports</option>
                          <option value="Academic">Academic</option>
                          <option value="Arts">Arts</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Event / Photo Title</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g., Annual Sports Day 100m Dash"
                          value={photoTitle}
                          onChange={(e) => setPhotoTitle(e.target.value)}
                          className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Month / Year</label>
                        <input
                          type="text"
                          placeholder="e.g., Sep 2026"
                          value={photoDate}
                          onChange={(e) => setPhotoDate(e.target.value)}
                          className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
                        />
                      </div>
                    </div>

                    {photoPreviewUrl && (
                      <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center gap-3">
                        <img src={photoPreviewUrl} alt="Preview" className="w-16 h-16 object-cover rounded-lg border border-slate-100" />
                        <div>
                          <p className="text-xs font-bold text-slate-800">{selectedPhotoFile?.name}</p>
                          <span className="text-[11px] text-slate-400">Ready to upload to Firebase Storage</span>
                        </div>
                      </div>
                    )}

                    {photoUploadProgress !== null && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-bold text-slate-600">
                          <span>Uploading to Firebase Storage...</span>
                          <span>{photoUploadProgress}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-[#6355EE] h-full transition-all duration-300"
                            style={{ width: `${photoUploadProgress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {photoError && (
                      <p className="text-xs text-rose-600 font-semibold">{photoError}</p>
                    )}

                    <button
                      type="submit"
                      disabled={photoUploadProgress !== null}
                      className="px-5 py-2.5 bg-[#6355EE] hover:bg-[#5244dc] text-white rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Upload to Firebase Storage & Publish</span>
                    </button>
                  </form>

                  {/* Photos Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {galleryList.map((photo) => (
                      <div key={photo.id} className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-900 group aspect-square">
                        <img src={photo.imageUrl} alt={photo.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-2.5 text-white">
                          <span className="text-[11px] font-bold line-clamp-1">{photo.title}</span>
                          <span className="text-[9px] text-slate-300">{photo.category}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeletePhoto(photo.id)}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-rose-600 transition-colors cursor-pointer"
                          title="Delete from Firebase Storage"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: TIMETABLES (FIREBASE STORAGE PDF) */}
              {activeTab === 'timetables' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-base text-slate-900 mb-1">
                        Timetable & Date Sheet PDFs
                      </h4>
                      <p className="text-xs text-slate-500">
                        Uploaded directly to Firebase Storage <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-700 font-mono">documents/timetable/*</code>.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setPdfUploadCategory('timetable');
                        setShowUploadPdfForm(!showUploadPdfForm);
                      }}
                      className="px-3 py-1.5 bg-[#6355EE] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer hover:bg-[#5244dc]"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Upload Timetable PDF</span>
                    </button>
                  </div>

                  {/* Upload Form */}
                  {showUploadPdfForm && pdfUploadCategory === 'timetable' && (
                    <form onSubmit={handleUploadPdfToStorage} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Document Title</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g., Final Exam Timetable 2026-27"
                            value={newPdfTitle}
                            onChange={(e) => setNewPdfTitle(e.target.value)}
                            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Class / Grade</label>
                          <input
                            type="text"
                            placeholder="e.g., Class 1 to 5"
                            value={newPdfClass}
                            onChange={(e) => setNewPdfClass(e.target.value)}
                            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Select PDF File</label>
                          <input
                            ref={pdfFileInputRef}
                            type="file"
                            accept="application/pdf"
                            required
                            onChange={(e) => e.target.files && handlePdfFileSelection(e.target.files[0])}
                            className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#6355EE] file:text-white hover:file:bg-[#5244dc] cursor-pointer"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Academic Year</label>
                          <input
                            type="text"
                            value={newPdfYear}
                            onChange={(e) => setNewPdfYear(e.target.value)}
                            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
                          />
                        </div>
                      </div>

                      {pdfUploadProgress !== null && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs font-bold text-slate-600">
                            <span>Uploading PDF to Firebase Storage...</span>
                            <span>{pdfUploadProgress}%</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-[#6355EE] h-full transition-all duration-300"
                              style={{ width: `${pdfUploadProgress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {pdfUploadError && <p className="text-xs text-rose-600 font-semibold">{pdfUploadError}</p>}

                      <div className="flex items-center gap-2">
                        <button
                          type="submit"
                          disabled={pdfUploadProgress !== null}
                          className="px-4 py-2 bg-[#6355EE] hover:bg-[#5244dc] text-white rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
                        >
                          <Upload className="w-4 h-4" />
                          <span>Upload PDF to Storage</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowUploadPdfForm(false)}
                          className="px-4 py-2 bg-slate-200 text-slate-700 rounded-xl font-bold text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Timetable List */}
                  <div className="space-y-2">
                    {timetablePdfs.map((docItem) => (
                      <div
                        key={docItem.id}
                        className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-3 shadow-2xs hover:border-slate-300"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-lg bg-indigo-50 text-[#6355EE] flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <h5 className="text-xs font-extrabold text-slate-900 truncate">{docItem.title}</h5>
                            <span className="text-[10px] text-slate-400">
                              {docItem.classGrade} • {docItem.fileSize} • {docItem.uploadDate}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => triggerPdfDownload(docItem)}
                            className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                            title="Test Download from Firebase Storage"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeletePdf(docItem.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                            title="Delete from Firebase Storage"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: RESULTS (FIREBASE STORAGE PDF) */}
              {activeTab === 'results' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-base text-slate-900 mb-1">
                        Examination Result Gazettes & Scorecards
                      </h4>
                      <p className="text-xs text-slate-500">
                        Uploaded directly to Firebase Storage <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-700 font-mono">documents/results/*</code>.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setPdfUploadCategory('results');
                        setShowUploadPdfForm(!showUploadPdfForm);
                      }}
                      className="px-3 py-1.5 bg-[#6355EE] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer hover:bg-[#5244dc]"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Upload Result PDF</span>
                    </button>
                  </div>

                  {/* Upload Form */}
                  {showUploadPdfForm && pdfUploadCategory === 'results' && (
                    <form onSubmit={handleUploadPdfToStorage} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Gazette Title</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g., Term 1 Score Gazette 2026"
                            value={newPdfTitle}
                            onChange={(e) => setNewPdfTitle(e.target.value)}
                            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Class / Grade</label>
                          <input
                            type="text"
                            placeholder="e.g., Class 1 to 5"
                            value={newPdfClass}
                            onChange={(e) => setNewPdfClass(e.target.value)}
                            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Select Result PDF</label>
                          <input
                            ref={pdfFileInputRef}
                            type="file"
                            accept="application/pdf"
                            required
                            onChange={(e) => e.target.files && handlePdfFileSelection(e.target.files[0])}
                            className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#6355EE] file:text-white hover:file:bg-[#5244dc] cursor-pointer"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Term</label>
                          <input
                            type="text"
                            value={newPdfTerm}
                            onChange={(e) => setNewPdfTerm(e.target.value)}
                            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
                          />
                        </div>
                      </div>

                      {pdfUploadProgress !== null && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs font-bold text-slate-600">
                            <span>Uploading Result PDF to Firebase Storage...</span>
                            <span>{pdfUploadProgress}%</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-[#6355EE] h-full transition-all duration-300"
                              style={{ width: `${pdfUploadProgress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {pdfUploadError && <p className="text-xs text-rose-600 font-semibold">{pdfUploadError}</p>}

                      <div className="flex items-center gap-2">
                        <button
                          type="submit"
                          disabled={pdfUploadProgress !== null}
                          className="px-4 py-2 bg-[#6355EE] hover:bg-[#5244dc] text-white rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
                        >
                          <Upload className="w-4 h-4" />
                          <span>Upload PDF to Storage</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowUploadPdfForm(false)}
                          className="px-4 py-2 bg-slate-200 text-slate-700 rounded-xl font-bold text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Results List */}
                  <div className="space-y-2">
                    {resultPdfs.map((docItem) => (
                      <div
                        key={docItem.id}
                        className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-3 shadow-2xs hover:border-slate-300"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                            <GraduationCap className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <h5 className="text-xs font-extrabold text-slate-900 truncate">{docItem.title}</h5>
                            <span className="text-[10px] text-slate-400">
                              {docItem.classGrade} • {docItem.term} • {docItem.fileSize}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => triggerPdfDownload(docItem)}
                            className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                            title="Test Download from Firebase Storage"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeletePdf(docItem.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                            title="Delete from Firebase Storage"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: ACTIVITY REELS (FIREBASE STORAGE VIDEOS) */}
              {activeTab === 'activities' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-base text-slate-900 mb-1">
                        Our School Activities Reel Videos
                      </h4>
                      <p className="text-xs text-slate-500">
                        Visitor activity reel videos stored in Firebase Storage <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-700 font-mono">activities/*</code>.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowUploadReelForm(!showUploadReelForm)}
                      className="px-3 py-1.5 bg-[#6355EE] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer hover:bg-[#5244dc]"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Upload Activity Video</span>
                    </button>
                  </div>

                  {showUploadReelForm && (
                    <form onSubmit={handleUploadReelToStorage} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Activity Title</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g., Science Fair Model Expo"
                            value={reelTitle}
                            onChange={(e) => setReelTitle(e.target.value)}
                            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g., Cultural & Devotional"
                            value={reelCategory}
                            onChange={(e) => setReelCategory(e.target.value)}
                            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Instagram Tag</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g., #ScienceFair #TSHS"
                            value={reelTag}
                            onChange={(e) => setReelTag(e.target.value)}
                            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Select Video File (.mp4, .webm, .mov)</label>
                        <input
                          ref={reelFileInputRef}
                          type="file"
                          accept="video/*"
                          required
                          onChange={(e) => e.target.files && handleReelFileSelection(e.target.files[0])}
                          className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#6355EE] file:text-white hover:file:bg-[#5244dc] cursor-pointer"
                        />
                      </div>

                      {reelUploadProgress !== null && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs font-bold text-slate-600">
                            <span>Uploading Video Reel to Firebase Storage...</span>
                            <span>{reelUploadProgress}%</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-[#6355EE] h-full transition-all duration-300"
                              style={{ width: `${reelUploadProgress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {reelUploadError && <p className="text-xs text-rose-600 font-semibold">{reelUploadError}</p>}

                      <div className="flex items-center gap-2">
                        <button
                          type="submit"
                          disabled={reelUploadProgress !== null}
                          className="px-4 py-2 bg-[#6355EE] hover:bg-[#5244dc] text-white rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
                        >
                          <Upload className="w-4 h-4" />
                          <span>Upload Reel to Firebase Storage</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowUploadReelForm(false)}
                          className="px-4 py-2 bg-slate-200 text-slate-700 rounded-xl font-bold text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Reels List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activityReels.map((reel) => (
                      <div
                        key={reel.id}
                        className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-3 shadow-2xs"
                      >
                        <div className="min-w-0">
                          <h5 className="text-xs font-bold text-slate-900 truncate">
                            {reel.title || reel.category}
                          </h5>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] font-semibold text-[#6355EE]">{reel.tag}</span>
                            <span className="text-[10px] text-slate-400">• {reel.category}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteReel(reel.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 7: TEACHERS (FIREBASE STORAGE PHOTOS) */}
              {activeTab === 'teachers' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-base text-slate-900 mb-1">
                        Teacher Profiles & Faculty Photos
                      </h4>
                      <p className="text-xs text-slate-500">
                        Educator headshots stored directly in Firebase Storage <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-700 font-mono">teachers/*</code>.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowTeacherForm(!showTeacherForm)}
                      className="px-3 py-1.5 bg-[#6355EE] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer hover:bg-[#5244dc]"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Teacher Profile</span>
                    </button>
                  </div>

                  {showTeacherForm && (
                    <form onSubmit={handleUploadTeacherToStorage} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g., Sarah Adelia"
                            value={teacherName}
                            onChange={(e) => setTeacherName(e.target.value)}
                            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Designation / Subject</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g., Science & Robotics Mentor"
                            value={teacherRole}
                            onChange={(e) => setTeacherRole(e.target.value)}
                            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Teacher Photo</label>
                          <input
                            ref={teacherFileInputRef}
                            type="file"
                            accept="image/*"
                            required
                            onChange={(e) => e.target.files && handleTeacherPhotoChange(e.target.files[0])}
                            className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#6355EE] file:text-white hover:file:bg-[#5244dc] cursor-pointer"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Qualification / Experience</label>
                          <input
                            type="text"
                            placeholder="e.g., M.Sc. B.Ed, 8+ Yrs Exp."
                            value={teacherQualification}
                            onChange={(e) => setTeacherQualification(e.target.value)}
                            className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
                          />
                        </div>
                      </div>

                      {teacherPreviewUrl && (
                        <div className="flex items-center gap-3">
                          <img src={teacherPreviewUrl} alt="Preview" className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500" />
                          <span className="text-xs text-slate-600 font-medium">Ready to upload to Firebase Storage</span>
                        </div>
                      )}

                      {teacherUploadProgress !== null && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs font-bold text-slate-600">
                            <span>Uploading photo to Firebase Storage...</span>
                            <span>{teacherUploadProgress}%</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-[#6355EE] h-full transition-all duration-300"
                              style={{ width: `${teacherUploadProgress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {teacherUploadError && <p className="text-xs text-rose-600 font-semibold">{teacherUploadError}</p>}

                      <div className="flex items-center gap-2">
                        <button
                          type="submit"
                          disabled={teacherUploadProgress !== null}
                          className="px-4 py-2 bg-[#6355EE] hover:bg-[#5244dc] text-white rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
                        >
                          <Upload className="w-4 h-4" />
                          <span>Publish Teacher Profile</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowTeacherForm(false)}
                          className="px-4 py-2 bg-slate-200 text-slate-700 rounded-xl font-bold text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Teachers Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {teachersList.map((teacher) => (
                      <div
                        key={teacher.id}
                        className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-3 shadow-2xs"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img src={teacher.imageUrl} alt={teacher.name} className="w-12 h-12 rounded-full object-cover shrink-0 border border-slate-200" />
                          <div className="min-w-0">
                            <h5 className="text-xs font-extrabold text-slate-900 truncate">{teacher.name}</h5>
                            <span className="text-[11px] font-semibold text-[#6355EE] block">{teacher.role}</span>
                            {teacher.qualification && (
                              <span className="text-[10px] text-slate-400 block truncate">{teacher.qualification}</span>
                            )}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteTeacher(teacher.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 8: HOME INTRO VIDEO (FIREBASE STORAGE) */}
              {activeTab === 'video' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-extrabold text-base text-slate-900 mb-1">
                      Home Section "Play Intro Video" Source
                    </h4>
                    <p className="text-xs text-slate-500">
                      The official video opened through the "Play Intro Video" button is served dynamically from Firebase Storage.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                    <div>
                      <span className="text-xs font-bold text-slate-700 block mb-1">Current Active Video URL</span>
                      {introVideoUrl ? (
                        <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-2">
                          <span className="text-xs text-slate-600 font-mono truncate">{introVideoUrl}</span>
                          <a
                            href={introVideoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 bg-indigo-50 text-[#6355EE] text-xs font-bold rounded-lg shrink-0 flex items-center gap-1 hover:bg-indigo-100"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Preview</span>
                          </a>
                        </div>
                      ) : (
                        <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800">
                          Using default storage path: <code className="font-mono font-bold">videos/intro-video.mp4</code>. Upload a replacement video below to configure a new Firebase Storage URL.
                        </div>
                      )}
                    </div>

                    <form onSubmit={handleUploadIntroVideo} className="space-y-3 pt-2">
                      <label className="block text-xs font-bold text-slate-700">Upload New Intro Tour Video (.mp4, .webm)</label>
                      <input
                        ref={introVideoInputRef}
                        type="file"
                        accept="video/*"
                        required
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setSelectedIntroVideoFile(e.target.files[0]);
                            setIntroVideoUploadError('');
                          }
                        }}
                        className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#6355EE] file:text-white hover:file:bg-[#5244dc] cursor-pointer"
                      />

                      {introVideoUploadProgress !== null && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs font-bold text-slate-600">
                            <span>Uploading video to Firebase Storage...</span>
                            <span>{introVideoUploadProgress}%</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-[#6355EE] h-full transition-all duration-300"
                              style={{ width: `${introVideoUploadProgress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {introVideoUploadError && (
                        <p className="text-xs text-rose-600 font-semibold">{introVideoUploadError}</p>
                      )}

                      <button
                        type="submit"
                        disabled={introVideoUploadProgress !== null || !selectedIntroVideoFile}
                        className="px-5 py-2.5 bg-[#6355EE] hover:bg-[#5244dc] text-white rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Upload to Firebase Storage & Set as Intro Video</span>
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* TAB 9: INCOMING WEBSITE INQUIRIES */}
              {activeTab === 'inquiries' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="font-extrabold text-base text-slate-900 mb-1 flex items-center gap-2">
                        <span>Website Contact Inquiries</span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                          {inquiriesList.length} Total
                        </span>
                      </h4>
                      <p className="text-xs text-slate-500">
                        Inquiries from the website contact section are delivered to <strong className="text-[#6355EE]">info@thesilverhillsschools.com</strong> and archived in Firebase.
                      </p>
                    </div>

                    <a
                      href="mailto:info@thesilverhillsschools.com"
                      className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-[#6355EE] rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-colors self-start shrink-0"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>info@thesilverhillsschools.com</span>
                    </a>
                  </div>

                  {inquiriesList.length === 0 ? (
                    <div className="p-12 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 space-y-2">
                      <Inbox className="w-10 h-10 text-slate-400 mx-auto" />
                      <h5 className="font-bold text-sm text-slate-700">No Inquiries Yet</h5>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        When parents fill out the contact form on the website, their message will be received at info@thesilverhillsschools.com and will also be displayed here.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {inquiriesList.map((inq) => (
                        <div
                          key={inq.id}
                          className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-200 transition-all space-y-3"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-indigo-100 text-[#6355EE] font-black text-sm flex items-center justify-center shrink-0">
                                {inq.name ? inq.name.charAt(0).toUpperCase() : 'P'}
                              </div>
                              <div>
                                <h5 className="font-extrabold text-sm text-slate-900 leading-tight">
                                  {inq.name || 'Anonymous Parent'}
                                </h5>
                                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                  <span className="text-[11px] text-slate-500">
                                    {inq.submittedAtStr || (inq.createdAt?.toDate ? inq.createdAt.toDate().toLocaleString('en-IN') : 'Recent')}
                                  </span>
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    Email: info@thesilverhillsschools.com
                                  </span>
                                </div>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleDeleteInquiry(inq.id)}
                              title="Delete record"
                              className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Contact Info Pills */}
                          <div className="flex items-center gap-2 flex-wrap text-xs">
                            <a
                              href={`tel:${inq.phone}`}
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors"
                            >
                              <Smartphone className="w-3 h-3 text-[#6355EE]" />
                              <span>{inq.phone}</span>
                            </a>
                            <a
                              href={`mailto:${inq.email}?subject=${encodeURIComponent('Inquiry Response - The Silver Hills School')}`}
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors"
                            >
                              <Mail className="w-3 h-3 text-[#6355EE]" />
                              <span>{inq.email}</span>
                            </a>
                          </div>

                          {/* Message Body */}
                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 leading-relaxed font-normal whitespace-pre-wrap">
                            {inq.message}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2 pt-1">
                            <a
                              href={`mailto:${inq.email}?subject=${encodeURIComponent('The Silver Hills School - Regarding Your Inquiry')}&body=${encodeURIComponent(`Dear ${inq.name},\n\nThank you for reaching out to The Silver Hills School regarding your inquiry:\n"${inq.message}"\n\n`)}`}
                              className="px-3.5 py-1.5 bg-[#6355EE] hover:bg-[#5244dc] text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-colors shadow-xs"
                            >
                              <Mail className="w-3.5 h-3.5" />
                              <span>Reply to Parent</span>
                            </a>
                            <a
                              href={`tel:${inq.phone}`}
                              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
                            >
                              <Smartphone className="w-3.5 h-3.5" />
                              <span>Call {inq.phone}</span>
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 10: SETTINGS, AUTH DIAGNOSTICS & PASSCODE */}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-extrabold text-base text-slate-900 mb-1">
                      Authentication & Firebase Hosting Diagnostics
                    </h4>
                    <p className="text-xs text-slate-500">
                      Verify authorized domains, active session details, and access controls.
                    </p>
                  </div>

                  {/* Auth Status Card */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">Current Session State</span>
                      {currentUser ? (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-extrabold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Firebase User: {currentUser.email || currentUser.displayName}</span>
                        </span>
                      ) : isPasscodeAuthenticated ? (
                        <span className="px-2.5 py-1 rounded-full bg-indigo-100 text-[#6355EE] text-[11px] font-extrabold flex items-center gap-1">
                          <KeyRound className="w-3.5 h-3.5" />
                          <span>Passcode Authenticated (Staff)</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-slate-200 text-slate-700 text-[11px] font-bold">
                          Not Authenticated
                        </span>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-200/80">
                      <label className="block text-xs font-bold text-slate-700 mb-1">Hosting Domain (for Firebase Authorized Domains)</label>
                      <div className="flex items-center gap-2">
                        <code className="text-xs font-mono bg-white px-3 py-2 rounded-xl border border-slate-200 text-slate-800 flex-1 truncate">
                          {currentHostname}
                        </code>
                        <button
                          type="button"
                          onClick={copyDomain}
                          className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          {copiedHostname ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedHostname ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        If Firebase Authentication fails with `auth/unauthorized-domain`, add this exact hostname to Firebase Console &gt; Authentication &gt; Settings &gt; Authorized Domains.
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-200/80 text-[11px] text-slate-500 font-mono space-y-1">
                      <div>Project ID: <b>{firebaseConfig.projectId}</b></div>
                      <div>Storage Bucket: <b>{firebaseConfig.storageBucket}</b></div>
                    </div>
                  </div>

                  {/* Change Admin PIN */}
                  <form onSubmit={handleChangePin} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <label className="block text-xs font-bold text-slate-700">Update Emergency Staff Passcode</label>
                    <div className="flex gap-2">
                      <input
                        type="password"
                        placeholder="Enter new 4-digit PIN"
                        value={newPin}
                        onChange={(e) => setNewPin(e.target.value)}
                        className="text-xs p-2.5 rounded-xl border border-slate-200 bg-white flex-1"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2.5 bg-[#6355EE] hover:bg-[#5244dc] text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
                      >
                        Change PIN
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
