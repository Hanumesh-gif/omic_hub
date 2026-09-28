import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDocFromServer,
  setDoc,
  getDoc,
  collection,
  onSnapshot,
  deleteDoc,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { UserProfile, JobApplication, ActivityItem } from '../types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
/* CRITICAL: Must pass firebaseConfig.firestoreDatabaseId */
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const googleProvider = new GoogleAuthProvider();

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test Connection on startup
export async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase connection: client appears offline.');
    }
  }
}

// Kick off connection check
testFirestoreConnection();

// Google Sign-In with popup
export async function signInWithGoogle(): Promise<User> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Failed to sign in with Google:', error);
    throw error;
  }
}

// Sign-Out
export async function logOutFromFirebase(): Promise<void> {
  await signOut(auth);
}

// Sync user profile with Firestore
export async function syncUserProfile(user: UserProfile): Promise<void> {
  const path = `users/${user.id}`;
  try {
    const now = new Date().toISOString();
    await setDoc(
      doc(db, 'users', user.id),
      {
        id: user.id,
        name: user.name || 'Bioinformatician',
        email: user.email || '',
        avatar: user.avatar || '',
        role: user.role || 'Bioinformatics Student',
        targetRole: user.targetRole || 'Computational Biologist',
        experienceLevel: user.experienceLevel || 'Entry-Level',
        targetIndustry: user.targetIndustry || 'Bioinformatics & Computational Genomics',
        location: user.location || 'Remote / Hybrid',
        atsScore: user.atsScore || 75,
        isResumeUploaded: !!user.isResumeUploaded,
        uploadedResumeFileName: user.uploadedResumeFileName || '',
        uploadedAt: user.uploadedAt || now,
        learningHours: user.learningHours || 0,
        completedSkillsCount: user.completedSkillsCount || 0,
        createdAt: now,
        updatedAt: now,
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Fetch user profile from Firestore
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const path = `users/${userId}`;
  try {
    const snap = await getDoc(doc(db, 'users', userId));
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

// Save application to Firestore
export async function saveApplicationToFirestore(
  userId: string,
  app: JobApplication
): Promise<void> {
  const path = `users/${userId}/applications/${app.id}`;
  try {
    await setDoc(doc(db, 'users', userId, 'applications', app.id), {
      ...app,
      userId,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Delete application from Firestore
export async function deleteApplicationFromFirestore(
  userId: string,
  appId: string
): Promise<void> {
  const path = `users/${userId}/applications/${appId}`;
  try {
    await deleteDoc(doc(db, 'users', userId, 'applications', appId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// Subscribe to applications in Firestore
export function subscribeToApplications(
  userId: string,
  callback: (apps: JobApplication[]) => void
) {
  const path = `users/${userId}/applications`;
  const q = collection(db, 'users', userId, 'applications');
  return onSnapshot(
    q,
    (snapshot) => {
      const apps: JobApplication[] = [];
      snapshot.forEach((d) => {
        apps.push(d.data() as JobApplication);
      });
      callback(apps);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

// Save Chat Message to Firestore
export async function saveChatMessageToFirestore(
  userId: string,
  message: { id: string; role: string; model: string; text: string; timestamp: string }
): Promise<void> {
  const path = `users/${userId}/chat_messages/${message.id}`;
  try {
    await setDoc(doc(db, 'users', userId, 'chat_messages', message.id), {
      ...message,
      userId,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}
