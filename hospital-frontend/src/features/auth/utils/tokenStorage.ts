
export const tokenStorage = {
  get(): string | null {
    const storedAuth = localStorage.getItem("auth");
    if (!storedAuth) return null;

    try {
      const session = JSON.parse(storedAuth);
      return session.token ?? null;
    } catch {
      return null;
    }
  },
};