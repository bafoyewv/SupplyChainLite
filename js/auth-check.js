// Vaqtinchalik autentifikatsiya tekshiruvini o'chirib qo'yamiz
document.addEventListener('DOMContentLoaded', function() {
    // Odatda bu yerda token tekshiriladi va foydalanuvchi login qilmagan bo'lsa,
    // login sahifasiga yo'naltiriladi. Hozircha bu tekshiruvni o'chirib qo'yamiz.
    
    // Foydalanuvchi ma'lumotlarini vaqtinchalik to'ldiramiz
    const userNameElement = document.getElementById('user-name');
    if (userNameElement) {
        userNameElement.textContent = 'Test User';
    }
    
    // Logout tugmasini o'chirib qo'yamiz
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Logout funksiyasi hozircha o\'chirilgan');
        });
    }
    
    // Orqaga qaytish tugmasi uchun
    const backBtn = document.getElementById('back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            window.location.href = 'products.html';
        });
    }
    
    // Bekor qilish tugmasi uchun
    const cancelBtn = document.getElementById('cancel-btn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            window.location.href = 'products.html';
        });
    }
});