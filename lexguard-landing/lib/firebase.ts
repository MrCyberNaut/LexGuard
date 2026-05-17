import { initializeApp, cert, getApps, App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

// On Google Cloud Run: uses Application Default Credentials (ADC) automatically.
// The Cloud Run service account must have "Cloud Datastore User" IAM role.
// Set FIREBASE_PROJECT_ID env var in Cloud Run to lexguard-ai-2026.
//
// For local dev: set FIREBASE_SERVICE_ACCOUNT_KEY to the JSON key string.

function getFirebaseAdminApp(): App {
  if (getApps().length > 0) return getApps()[0];

  const projectId = process.env.FIREBASE_PROJECT_ID ?? process.env.GCLOUD_PROJECT;

  try {
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (serviceAccountKey) {
      const serviceAccount = JSON.parse(serviceAccountKey);
      return initializeApp({ credential: cert(serviceAccount), projectId });
    }
    // Cloud Run: ADC via metadata server — no key file required
    return initializeApp({ projectId });
  } catch (error) {
    console.warn("[firebase] init warning:", error);
    return initializeApp({ projectId });
  }
}

const adminApp = getFirebaseAdminApp();
const db = getFirestore(adminApp);
const auth = getAuth(adminApp);

export { db, auth };
