import { server } from "./app";

(async () => {
  try {
    const port = process.env.PORT || 3200;
    
    // Check for email configuration
    if (!process.env.JAM_EMAIL || !process.env.JAM_PW) {
      console.warn('⚠️  WARNING: Email credentials not configured!');
      console.warn('   Password reset functionality will not work.');
      console.warn('   Please set JAM_EMAIL and JAM_PW environment variables.');
      console.warn('   See .env.example for instructions on setting up Gmail App Password.');
    }
    
    server.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  } catch (error) {
    console.error('Not connected to server:', error);
  }
})();