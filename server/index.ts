import app from './app';

(async () => {
  try {
    const port = process.env.SERVER_PORT || 3200;
    app.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  } catch (error) {
    console.error('Not connected to server:', error);
  }
})();