import {
  storage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  listAll,
  getMetadata,
} from '../firebase';

export interface StorageUploadResult {
  downloadUrl: string;
  storagePath: string;
  fileName: string;
  fileSizeFormatted: string;
}

export interface StorageFolderFileItem {
  name: string;
  fullPath: string;
  downloadUrl: string;
  contentType?: string;
  customMetadata?: Record<string, string>;
  timeCreated?: string;
}

/**
 * Format bytes into human readable KB / MB
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

function inferContentType(file: File | Blob, storagePath: string): string | undefined {
  if (file instanceof File && file.type) return file.type;
  const lower = (file instanceof File ? file.name : storagePath).toLowerCase();
  if (lower.endsWith('.mp4') || lower.endsWith('.m4v')) return 'video/mp4';
  if (lower.endsWith('.webm')) return 'video/webm';
  if (lower.endsWith('.mov')) return 'video/quicktime';
  if (lower.endsWith('.pdf')) return 'application/pdf';
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg';
  return undefined;
}

/**
 * Upload any File or Blob to a specific Firebase Storage path with upload progress tracking
 */
export function uploadFileToStorage(
  storagePath: string,
  file: File | Blob,
  onProgress?: (progressPercent: number) => void,
  customMetadata?: Record<string, string>
): Promise<StorageUploadResult> {
  return new Promise((resolve, reject) => {
    try {
      const storageRef = ref(storage, storagePath);
      const contentType = inferContentType(file, storagePath);
      const metadata =
        contentType || customMetadata
          ? {
              ...(contentType ? { contentType } : {}),
              ...(customMetadata ? { customMetadata } : {}),
            }
          : undefined;

      const uploadTask = metadata
        ? uploadBytesResumable(storageRef, file, metadata)
        : uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          if (onProgress && snapshot.totalBytes > 0) {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            onProgress(Math.round(progress));
          }
        },
        (error) => {
          console.error(`Firebase Storage upload error at [${storagePath}]:`, error);
          reject(error);
        },
        async () => {
          try {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            const originalName = file instanceof File ? file.name : storagePath.split('/').pop() || 'file';
            resolve({
              downloadUrl,
              storagePath,
              fileName: originalName,
              fileSizeFormatted: formatBytes(file.size),
            });
          } catch (urlErr) {
            reject(urlErr);
          }
        }
      );
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * List all files inside a Firebase Storage folder along with download URLs and metadata
 */
export async function listStorageFolderFiles(folderPath: string): Promise<StorageFolderFileItem[]> {
  try {
    const folderRef = ref(storage, folderPath);
    const result = await listAll(folderRef);
    const items = await Promise.all(
      result.items.map(async (itemRef) => {
        try {
          const [downloadUrl, meta] = await Promise.all([
            getDownloadURL(itemRef),
            getMetadata(itemRef).catch(() => null),
          ]);
          return {
            name: itemRef.name,
            fullPath: itemRef.fullPath,
            downloadUrl,
            contentType: meta?.contentType,
            customMetadata: meta?.customMetadata,
            timeCreated: meta?.timeCreated,
          } as StorageFolderFileItem;
        } catch {
          return null;
        }
      })
    );
    return items.filter((item): item is StorageFolderFileItem => item !== null && Boolean(item.downloadUrl));
  } catch (err) {
    console.warn(`Could not list storage folder [${folderPath}]:`, err);
    return [];
  }
}

/**
 * Retrieve public download URL for a storage path if it exists
 */
export async function getStorageDownloadUrl(storagePath: string): Promise<string | null> {
  try {
    const storageRef = ref(storage, storagePath);
    return await getDownloadURL(storageRef);
  } catch (err: any) {
    // If object does not exist or permission denied, return null gracefully
    return null;
  }
}

/**
 * Delete a file from Firebase Storage
 */
export async function deleteFileFromStorage(storagePath: string): Promise<boolean> {
  try {
    const storageRef = ref(storage, storagePath);
    await deleteObject(storageRef);
    return true;
  } catch (err) {
    console.warn(`Could not delete storage object at [${storagePath}]:`, err);
    return false;
  }
}

/**
 * Robust visitor download handler:
 * Fetches the remote Firebase Storage URL as a Blob to force an actual file download with the intended filename.
 * Falls back to anchor link if CORS blocks blob fetch.
 */
export async function downloadFileFromUrl(url: string, targetFilename: string): Promise<void> {
  if (!url) return;

  try {
    // Try fetching as blob for guaranteed native download with exact filename
    const response = await fetch(url, { mode: 'cors' });
    if (!response.ok) {
      throw new Error(`Fetch failed with status ${response.status}`);
    }
    const blob = await response.blob();
    const objectUrl = window.URL.createObjectURL(blob);

    const anchor = document.createElement('a');
    anchor.href = objectUrl;
    anchor.download = targetFilename || 'TSHS-Document.pdf';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    // Clean up memory
    setTimeout(() => window.URL.revokeObjectURL(objectUrl), 1000);
  } catch (err) {
    console.warn('Blob download fallback to direct anchor click:', err);
    // Direct anchor fallback
    const fallbackAnchor = document.createElement('a');
    fallbackAnchor.href = url;
    fallbackAnchor.target = '_blank';
    fallbackAnchor.rel = 'noopener noreferrer';
    fallbackAnchor.download = targetFilename || 'TSHS-Document.pdf';
    document.body.appendChild(fallbackAnchor);
    fallbackAnchor.click();
    document.body.removeChild(fallbackAnchor);
  }
}
