import { initializeApp, cert, getApps, App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

// Google Cloud / Firebase Admin Initialization
// In production on Google Cloud Run, it can use Application Default Credentials automatically
// if the service account has Firestore access.
// For local development, we supply a FIREBASE_SERVICE_ACCOUNT_KEY env var.

function getFirebaseAdminApp(): App {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  try {
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    
    if (serviceAccountKey) {
      // Parse the JSON key
      const serviceAccount = JSON.parse(serviceAccountKey);
      return initializeApp({
        credential: cert(serviceAccount)
      });
    } else {
      // Fallback to Application Default Credentials (e.g. native Google Cloud Run environment)
      return initializeApp();
    }
  } catch (error) {
    console.warn("Firebase Admin Initialization Warning:", error);
    // Initialize default app for build phases
    return initializeApp();
  }
}

const adminApp = getFirebaseAdminApp();
const db = getFirestore(adminApp);
const auth = getAuth(adminApp);

export { db, auth };
