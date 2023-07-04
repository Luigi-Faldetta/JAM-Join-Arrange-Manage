import { server } from "./app";

(async () => {
  try {
    const port = process.env.PORT || 3200;
    server.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  } catch (error) {
    console.error('Not connected to server:', error);
  }
})();