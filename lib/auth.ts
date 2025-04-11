export async function logout() {
  await fetch('/api/auth', { method: 'DELETE' });
  window.location.href = '/login';
}