export default defineNuxtRouteMiddleware(async () => {
  const { user, isAdmin, loading } = useAuth();

  // Wait for auth state to finish loading before checking permissions
  if (loading.value) {
    await Promise.race([
      new Promise<void>((resolve) => {
        const stop = watch(loading, (val) => {
          if (!val) { stop(); resolve(); }
        }, { immediate: true });
      }),
      new Promise<void>((resolve) => setTimeout(resolve, 3000)),
    ]);
  }

  if (!user.value || !isAdmin.value) {
    return navigateTo('/connexion');
  }
});
