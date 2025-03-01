import { setupStorage } from '../src/utils/setup-storage';

// Run the setup
setupStorage()
  .then(() => {
    console.log('Storage setup completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Storage setup failed:', error);
    process.exit(1);
  });
