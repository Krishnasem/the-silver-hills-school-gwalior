import { db, auth } from '../firebase';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';
import {
  uploadFileToStorage,
  deleteFileFromStorage,
  downloadFileFromUrl,
} from './firebaseStorage';

export interface AcademicPdfDocument {
  id: string;
  title: string;
  category: 'timetable' | 'results' | 'notice';
  classGrade: string;
  description: string;
  academicYear: string;
  term: string;
  fileName: string;
  fileSize: string;
  downloadUrl?: string; // Firebase Storage public URL
  storagePath?: string; // Firebase Storage reference path
  fileDataUrl?: string; // Legacy fallback
  uploadDate: string;
  downloadCount: number;
}

const STORAGE_KEY = 'tshs_academic_pdfs_v2';
const UPDATE_EVENT = 'tshs_academic_pdfs_updated';

export const INITIAL_PDF_DOCUMENTS: AcademicPdfDocument[] = [
  {
    id: 'pdf-tt-1',
    title: 'Mid-Term Assessment Examination Schedule & Timetable 2026-27',
    category: 'timetable',
    classGrade: 'Class 1 to 5',
    description: 'Official comprehensive date-sheet covering morning sessions, reporting instructions, and hall allotments.',
    academicYear: '2026-2027',
    term: 'Mid-Term (Term 1)',
    fileName: 'Mid_Term_Datesheet_2026_Official.pdf',
    fileSize: '1.2 MB',
    downloadUrl: '',
    uploadDate: '2026-08-20',
    downloadCount: 142,
  },
  {
    id: 'pdf-tt-2',
    title: 'Kindergarten & Pre-Primary Activity Week Timetable',
    category: 'timetable',
    classGrade: 'Playgroup to UKG',
    description: 'Joyful sensory art, phonics recitation, and motor coordination assessment timetable for early learners.',
    academicYear: '2026-2027',
    term: 'Semester 1',
    fileName: 'Kindergarten_Assessment_Routine.pdf',
    fileSize: '850 KB',
    downloadUrl: '',
    uploadDate: '2026-08-22',
    downloadCount: 88,
  },
  {
    id: 'pdf-res-1',
    title: 'Term 1 Scholastic Assessment Gazette & Merit Roll',
    category: 'results',
    classGrade: 'Class 1 to 5',
    description: 'Official verified class score gazette with aggregate letter grades, co-scholastic remarks, and pass percentages.',
    academicYear: '2025-2026',
    term: 'Half-Yearly Examination',
    fileName: 'Term1_Scholastic_Merit_Gazette.pdf',
    fileSize: '2.1 MB',
    downloadUrl: '',
    uploadDate: '2025-11-15',
    downloadCount: 310,
  },
  {
    id: 'pdf-res-2',
    title: 'Annual Academic Progress Report & Promotion List 2025',
    category: 'results',
    classGrade: 'All Classes',
    description: 'Complete annual report card summary and grade promotion list validated by the Examination Controller.',
    academicYear: '2024-2025',
    term: 'Annual Term Examination',
    fileName: 'Annual_Promotion_List_2024-25.pdf',
    fileSize: '3.4 MB',
    downloadUrl: '',
    uploadDate: '2025-03-28',
    downloadCount: 524,
  },
];

let isFirestorePdfsSyncInitialized = false;

function initFirestorePdfsSync() {
  if (isFirestorePdfsSyncInitialized || typeof window === 'undefined') return;
  isFirestorePdfsSyncInitialized = true;

  try {
    const colRef = collection(db, 'academicDocuments');
    onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const remoteDocs: AcademicPdfDocument[] = [];
          snapshot.forEach((docSnap) => {
            remoteDocs.push({
              id: docSnap.id,
              ...(docSnap.data() as Omit<AcademicPdfDocument, 'id'>),
            });
          });
          // Sort by uploadDate descending
          remoteDocs.sort((a, b) => b.uploadDate.localeCompare(a.uploadDate));

          localStorage.setItem(STORAGE_KEY, JSON.stringify(remoteDocs));
          window.dispatchEvent(new CustomEvent(UPDATE_EVENT, { detail: remoteDocs }));
        } else {
          // Seed initial documents to Firestore only if staff is logged in
          if (auth.currentUser) {
            INITIAL_PDF_DOCUMENTS.forEach((d) => {
              const dRef = doc(db, 'academicDocuments', d.id);
              setDoc(dRef, d).catch(() => {});
            });
          }
        }
      },
      (err) => {
        // Fall back cleanly to local cache
        console.warn('Firestore academicDocuments notice (operating from cache):', err?.message || err);
      }
    );
  } catch (err) {
    console.warn('Could not initialize academicDocuments Firestore sync:', err);
  }
}

export function getStoredPdfDocuments(): AcademicPdfDocument[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading PDF documents from storage:', e);
  }
  return INITIAL_PDF_DOCUMENTS;
}

/**
 * Uploads a PDF to Firebase Storage and saves its metadata to Firestore
 */
export async function uploadAndSavePdfDocument(
  file: File,
  meta: {
    title: string;
    category: 'timetable' | 'results' | 'notice';
    classGrade: string;
    description: string;
    academicYear: string;
    term: string;
  },
  onProgress?: (percent: number) => void
): Promise<AcademicPdfDocument> {
  const docId = `pdf-${Date.now()}`;
  const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const storagePath = `documents/${meta.category}/${docId}_${cleanFileName}`;

  // 1. Upload file binary directly to Firebase Storage
  const { downloadUrl, fileSizeFormatted } = await uploadFileToStorage(storagePath, file, onProgress);

  // 2. Prepare Firestore document
  const newDoc: AcademicPdfDocument = {
    id: docId,
    title: meta.title.trim(),
    category: meta.category,
    classGrade: meta.classGrade || 'All Classes',
    description: meta.description.trim(),
    academicYear: meta.academicYear || '2026-2027',
    term: meta.term || 'General',
    fileName: file.name,
    fileSize: fileSizeFormatted,
    downloadUrl,
    storagePath,
    uploadDate: new Date().toISOString().split('T')[0],
    downloadCount: 0,
  };

  // 3. Save to Firestore
  try {
    const docRef = doc(db, 'academicDocuments', docId);
    await setDoc(docRef, newDoc);
  } catch (e) {
    console.warn('Could not write doc to Firestore (local update applied):', e);
  }

  // 4. Update local cache
  const current = getStoredPdfDocuments();
  const updated = [newDoc, ...current.filter((d) => d.id !== docId)];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent(UPDATE_EVENT, { detail: updated }));

  return newDoc;
}

/**
 * Saves or updates a document in Firestore & local cache
 */
export async function savePdfDocumentToCloud(docData: AcademicPdfDocument): Promise<AcademicPdfDocument[]> {
  const current = getStoredPdfDocuments();
  const updated = [docData, ...current.filter((d) => d.id !== docData.id)];

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(UPDATE_EVENT, { detail: updated }));
  } catch (e) {
    console.error('Error storing PDF locally:', e);
  }

  try {
    const docRef = doc(db, 'academicDocuments', docData.id);
    await setDoc(docRef, docData);
  } catch (e) {
    console.warn('Could not save academic document to Firestore:', e);
  }

  return updated;
}

/**
 * Deletes a document from Firebase Storage and Firestore
 */
export async function deletePdfDocumentFromCloud(id: string): Promise<AcademicPdfDocument[]> {
  const current = getStoredPdfDocuments();
  const targetDoc = current.find((d) => d.id === id);

  // Delete from Firebase Storage if path is stored
  if (targetDoc?.storagePath) {
    deleteFileFromStorage(targetDoc.storagePath).catch(() => {});
  }

  const updated = current.filter((d) => d.id !== id);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(UPDATE_EVENT, { detail: updated }));
  } catch (e) {
    console.error('Error deleting PDF locally:', e);
  }

  try {
    const docRef = doc(db, 'academicDocuments', id);
    await deleteDoc(docRef);
  } catch (e) {
    console.warn('Could not delete academic document from Firestore:', e);
  }

  return updated;
}

/**
 * Helper to download an academic or notice PDF document from Firebase Storage
 */
export async function triggerPdfDownload(docItem: AcademicPdfDocument): Promise<void> {
  const url = docItem.downloadUrl || docItem.fileDataUrl;
  const fileName = docItem.fileName || `${docItem.title}.pdf`;
  if (!url) {
    console.warn('No download URL available for document:', docItem.title);
    return;
  }
  await downloadFileFromUrl(url, fileName);
}

export function subscribeToPdfDocuments(callback: (docs: AcademicPdfDocument[]) => void): () => void {
  initFirestorePdfsSync();

  const handler = (e: Event) => {
    const customEvt = e as CustomEvent<AcademicPdfDocument[]>;
    if (customEvt.detail) {
      callback(customEvt.detail);
    } else {
      callback(getStoredPdfDocuments());
    }
  };

  window.addEventListener(UPDATE_EVENT, handler);
  window.addEventListener('storage', handler);

  return () => {
    window.removeEventListener(UPDATE_EVENT, handler);
    window.removeEventListener('storage', handler);
  };
}
