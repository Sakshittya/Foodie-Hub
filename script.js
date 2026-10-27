const money = value => `₹${Number(value).toFixed(2)}`;
async function api(url, options = {}) {
  const response = await fetch(url, { credentials:'same-origin', headers:{'Content-Type':'application/json', ...(options.headers || {})}, ...options });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) { const error = new Error(data.error || 'Request failed.'); error.loginRequired = data.loginRequired; throw error; }
  return data;
}
function showMessage(target, message, type='danger') {
  const node = typeof target === 'string' ? document.getElementById(target) : target;
  if (node) { node.textContent = message; node.className = `text-${type} text-center mt-2`; }
}
async function updateCartCount() {
  const count = document.getElementById('cartCount'); if (!count) return;
  try { const data = await api('/api/cart'); count.textContent = data.count; }
  catch (error) { count.textContent = '0'; }
}
async function updateNavbar() {
  try {
    const {user} = await api('/api/auth/me');
    const login = document.getElementById('loginLink'); const logout = document.getElementById('logoutButton');
    if (login) login.classList.toggle('d-none', !!user);
    if (logout) logout.classList.toggle('d-none', !user);
  } catch(e) { /* navbar remains usable if the API is unavailable */ }
}
async function loadFoods() {
  const container = document.getElementById('foodContainer'); if (!container) return;
  const message = document.getElementById('menuMessage');
  try {
    const {foods} = await api('/api/foods');
    if (message) message.textContent = foods.length ? '' : 'No menu items are available right now.';
    container.innerHTML = foods.map(food => `<div class="col-md-4 col-sm-6"><div class="card food-card shadow-sm">
      <img src="${escapeHtml(food.image_url)}" alt="${escapeHtml(food.name)}" loading="lazy"><div class="card-body text-center">
      <h6 class="mb-1">${escapeHtml(food.name)}</h6><p>${money(food.price)}</p>
      <button class="btn btn-success btn-sm" data-add-food="${food.id}">Add to Cart</button></div></div></div>`).join('');
  } catch (error) { if (message) { message.textContent = 'Unable to load the menu. Please check the server and try again.'; message.className = 'text-center text-danger'; } }
}
function escapeHtml(value) { return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
async function addToCart(foodId) {
  try { await api('/api/cart', {method:'POST',body:JSON.stringify({foodId:Number(foodId),quantity:1})}); await updateCartCount(); alert('Added to your cart!'); }
  catch(error) { if(error.loginRequired) { sessionStorage.setItem('foodiehubReturnTo','index.html'); location.href='login.html'; } else alert(error.message); }
}
document.addEventListener('click', async event => {
  const add = event.target.closest('[data-add-food]'); if (add) addToCart(add.dataset.addFood);
  if (event.target.closest('#logoutButton')) {
    try { await api('/api/auth/logout',{method:'POST',body:'{}'}); location.href='index.html'; }
    catch(error) { alert(error.message); }
  }
});
document.addEventListener('DOMContentLoaded', () => { loadFoods(); updateCartCount(); updateNavbar(); });
