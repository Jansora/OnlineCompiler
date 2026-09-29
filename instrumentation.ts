export async function register() {
  if (process.env.NEXT_RUNTIME !== "edge") {
    const { initializeAdmin } = await import("./lib/server/auth");
    await initializeAdmin();
  }
}
