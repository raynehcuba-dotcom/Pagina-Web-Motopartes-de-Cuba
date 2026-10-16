import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  collection,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  getDocFromServer,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { Repuesto } from '../types';
import { REPUESTOS } from '../data/repuestos';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

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

/**
 * Validate connection to Firestore on boot
 */
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore is running in offline mode or waiting for connection.');
      return false;
    }
    // Any other error (e.g. permission denied on test doc) still proves connectivity to the server
    return true;
  }
}

/**
 * Subscribe to real-time repuestos catalog in Firestore
 */
export function subscribeToRepuestos(
  onUpdate: (repuestos: Repuesto[]) => void,
  onError?: (err: Error) => void
) {
  const colRef = collection(db, 'repuestos');
  return onSnapshot(
    colRef,
    (snapshot) => {
      if (snapshot.empty) {
        onUpdate([]);
        return;
      }
      const items: Repuesto[] = [];
      snapshot.forEach((docSnap) => {
        items.push(docSnap.data() as Repuesto);
      });
      onUpdate(items);
    },
    (error) => {
      if (onError) {
        onError(error);
      }
      handleFirestoreError(error, OperationType.GET, 'repuestos');
    }
  );
}

/**
 * Seed initial catalog data into Firestore if empty
 */
export async function seedInitialCatalogIfEmpty(): Promise<boolean> {
  const path = 'repuestos';
  try {
    const snap = await getDocs(collection(db, path));
    if (snap.empty) {
      console.log('Seeding initial Motopartes catalog into Firestore...');
      for (const item of REPUESTOS) {
        await setDoc(doc(db, path, item.id), {
          ...item,
          updatedAt: new Date().toISOString(),
        });
      }
      return true;
    }
    return false;
  } catch (error) {
    console.warn('Notice: Catalog seeding skipped or restricted by rules:', error);
    return false;
  }
}

/**
 * Update stock and price of a product in real-time
 */
export async function updateRepuestoStock(
  repuestoId: string,
  stock: 'disponible' | 'bajo_stock' | 'encargo',
  stockCount: number
): Promise<void> {
  const path = `repuestos/${repuestoId}`;
  try {
    await updateDoc(doc(db, 'repuestos', repuestoId), {
      stock,
      stockCount,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

/**
 * Update prices in CUP and USD
 */
export async function updateRepuestoPrice(
  repuestoId: string,
  priceCUP: number,
  priceUSD: number
): Promise<void> {
  const path = `repuestos/${repuestoId}`;
  try {
    await updateDoc(doc(db, 'repuestos', repuestoId), {
      priceCUP,
      priceUSD,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

/**
 * Add or overwrite a repuesto in the database
 */
export async function saveRepuesto(repuesto: Repuesto): Promise<void> {
  const path = `repuestos/${repuesto.id}`;
  try {
    await setDoc(doc(db, 'repuestos', repuesto.id), {
      ...repuesto,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Delete a repuesto from Firestore
 */
export async function deleteRepuestoFromDb(repuestoId: string): Promise<void> {
  const path = `repuestos/${repuestoId}`;
  try {
    await deleteDoc(doc(db, 'repuestos', repuestoId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Admin authentication
 */
const ADMIN_EMAILS = ['raynehcuba@gmail.com'];

export async function loginWithGoogle(): Promise<User | null> {
  const provider = new GoogleAuthProvider();
  try {
    const cred = await signInWithPopup(auth, provider);
    return cred.user;
  } catch (error) {
    console.error('Google login error:', error);
    throw error;
  }
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

export function isUserAdmin(user: User | null): boolean {
  if (!user || !user.email) return false;
  return ADMIN_EMAILS.includes(user.email.toLowerCase());
}
