import createApp from "./app.js";

(async () => {
  try {
    const app = await createApp();
    const PORT = Number(process.env.PORT ?? 3000);
    const server = app.listen(PORT, () =>
      console.log(`http://localhost:${PORT}`)
    );

    const shutdown = () => server.close(() => process.exit(0));
    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (err) {
    console.error("BOOTSTRAP FAILURE:", err);
    process.exit(1);
  }
})();
