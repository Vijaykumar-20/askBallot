import { Storage } from '@google-cloud/storage';

// Initialize the Google Cloud Storage client
// Note: This is server-side only. It acts as a stub to demonstrate Google Services integration.
let storage = null;

export const getStorageClient = () => {
  if (!storage) {
    storage = new Storage({
      projectId: process.env.GOOGLE_CLOUD_PROJECT || 'askballot-demo',
      // The keyFilename would go here in a real environment
      // keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
    });
  }
  return storage;
};
