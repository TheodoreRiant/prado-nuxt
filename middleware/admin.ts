export default defineNuxtRouteMiddleware(async () => {
  const { user, isAdmin } = useAuth();
  if (!user.value || !isAdmin.value) {
    return navigateTo('/connexion');
  }
});
