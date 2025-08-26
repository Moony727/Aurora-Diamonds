document.addEventListener('DOMContentLoaded', function() {
    // Translation data
    const translations = {
        en: {
            tabDiamonds: "Buy Diamonds",
            tabMemberships: "Memberships",
            diamondsTitle: "Diamond Packs",
            diamonds: "Diamonds",
            membershipsTitle: "Membership Plans",
            miniWeekly: "Mini Weekly",
            weekly: "Weekly",
            monthly: "Monthly",
            weeklyPass: "Weekly Pass",
            monthlyPass: "Monthly Pass",
            purchaseDetails: "Purchase Details",
            item: "Item",
            price: "Price",
            buyNow: "Buy Now",
            name: "Name",
            whatsapp: "WhatsApp Number",
            purchaseSuccess: "Purchase successful! We'll contact you soon.",
            fieldRequired: "This field is required",
            errorTitle: "Error",
            successTitle: "Success",
            okButton: "OK"
        },
        ru: {
            tabDiamonds: "Купить Алмазы",
            tabMemberships: "Подписки",
            diamondsTitle: "Наборы Алмазов",
            diamonds: "Алмазы",
            membershipsTitle: "Планы Подписок",
            miniWeekly: "Weekly Lite",
            weekly: "Weekly",
            monthly: "Montly",
            weeklyPass: "Недельный Пропуск",
            monthlyPass: "Месячный Пропуск",
            purchaseDetails: "Детали Покупки",
            item: "Товар",
            price: "Цена",
            buyNow: "Купить Сейчас",
            name: "Имя",
            whatsapp: "Номер WhatsApp",
            purchaseSuccess: "Покупка успешна! Мы свяжемся с вами в ближайшее время.",
            fieldRequired: "Это поле обязательно для заполнения",
            errorTitle: "Ошибка",
            successTitle: "Успех",
            okButton: "OK"
        },
        az: {
            tabDiamonds: "Elmas Al",
            tabMemberships: "Üzvlüklər",
            diamondsTitle: "Elmas Paketləri",
            diamonds: "Elmas",
            membershipsTitle: "Üzvlük Planları",
            miniWeekly: "Mini Həftəlik",
            weekly: "Həftəlik",
            monthly: "Aylıq",
            weeklyPass: "Həftəlik Keçid",
            monthlyPass: "Aylıq Keçid",
            purchaseDetails: "Alış Detalları",
            item: "Məhsul",
            price: "Qiymət",
            buyNow: "İndi Al",
            name: "Ad",
            whatsapp: "WhatsApp Nömrəsi",
            purchaseSuccess: "Alış uğurla başa çatdı! Tezliklə sizinlə əlaqə saxlanılacaq.",
            fieldRequired: "Bu xana mütləqdir",
            errorTitle: "Xəta",
            successTitle: "Uğurlu",
            okButton: "Oldu"
        }

    };

    // App state
    let currentLang = 'en';

    // DOM elements
    const pageLoader = document.getElementById('pageLoader');
    const welcomeScreen = document.getElementById('welcomeScreen');
    const appContainer = document.getElementById('appContainer');
    const themeToggle = document.getElementById('themeToggle');
    const langToggle = document.getElementById('langToggle');
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanels = document.querySelectorAll('.tab-panel');
    const diamondCards = document.querySelectorAll('.diamond-card');
    const membershipCards = document.querySelectorAll('.membership-card');
    const purchaseModal = document.getElementById('purchaseModal');
    const closeModal = document.getElementById('closeModal');
    const purchaseForm = document.getElementById('purchaseForm');

    // Telegram Bot Configuration
    const TELEGRAM_BOT_TOKEN = '8399411682:AAHBkaAkVhPd0tag4d4Q7AdJpnctqFTeR1w'; // Replace with your bot token
    const TELEGRAM_CHAT_ID = '-1003071169212'; // Replace with your chat ID

    // Cookie functions
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    function setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
    }

    // Language functions
    function setLanguage(lang) {
        currentLang = lang;
        setCookie('language', lang, 30);
        langToggle.innerHTML = `<i class="fas fa-globe"></i> ${lang.toUpperCase()}`;
        
        document.querySelectorAll('[data-lang]').forEach(element => {
            const key = element.getAttribute('data-lang');
            if (translations[lang][key]) {
                element.textContent = translations[lang][key];
            }
        });
    }

    // Theme functions
    function toggleTheme() {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        setCookie('theme', isDark ? 'dark' : 'light', 30);
        themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    }

    // Show notification using SweetAlert2
    function showNotification(title, message, type = 'success') {
        Swal.fire({
            title: title,
            text: message,
            icon: type,
            confirmButtonText: translations[currentLang].okButton,
            confirmButtonColor: getComputedStyle(document.documentElement).getPropertyValue('--primary-color'),
            timer: 3000,
            timerProgressBar: true,
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            }
        });
    }

    // Loader functions
    function showLoader() {
        pageLoader.style.display = 'flex';
    }

    function hideLoader() {
        pageLoader.style.display = 'none';
    }

    // Send message to Telegram bot
    async function sendToTelegram(message) {
        try {
            const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: TELEGRAM_CHAT_ID,
                    text: message,
                    parse_mode: 'HTML'
                })
            });
            
            if (!response.ok) {
                throw new Error('Failed to send message');
            }
            
            return true;
        } catch (error) {
            console.error('Error sending to Telegram:', error);
            return false;
        }
    }

    // Tab switching
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));
            
            button.classList.add('active');
            document.getElementById(button.getAttribute('data-tab')).classList.add('active');
        });
    });

    // Diamond/Membership card click
    diamondCards.forEach(card => {
        card.addEventListener('click', () => {
            const diamonds = card.getAttribute('data-diamonds');
            const price = card.getAttribute('data-price');
            
            document.getElementById('itemName').textContent = `${diamonds} ${translations[currentLang].diamonds}`;
            document.getElementById('itemPrice').textContent = price;
            purchaseModal.classList.add('active');
        });
    });

    membershipCards.forEach(card => {
        card.addEventListener('click', () => {
            const membership = card.getAttribute('data-membership');
            const price = card.getAttribute('data-price');
            
            document.getElementById('itemName').textContent = membership;
            document.getElementById('itemPrice').textContent = price;
            purchaseModal.classList.add('active');
        });
    });

    // Modal close
    closeModal.addEventListener('click', () => {
        purchaseModal.classList.remove('active');
    });

    // Purchase form
    purchaseForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const userName = document.getElementById('userName').value.trim();
        const userPhone = document.getElementById('userPhone').value.trim();
        
        // Validate fields
        if (!userName) {
            showNotification(
                translations[currentLang].errorTitle,
                translations[currentLang].fieldRequired + ': ' + translations[currentLang].name,
                'error'
            );
            return;
        }
        
        if (!userPhone) {
            showNotification(
                translations[currentLang].errorTitle,
                translations[currentLang].fieldRequired + ': ' + translations[currentLang].whatsapp,
                'error'
            );
            return;
        }
        
        // Show loader
        showLoader();
        
        // Prepare message for Telegram
        const itemName = document.getElementById('itemName').textContent;
        const itemPrice = document.getElementById('itemPrice').textContent;
        const message = `
<b>New Order!</b>

<b>Item:</b> ${itemName}
<b>Price:</b> ${itemPrice} AZN
<b>Name:</b> ${userName}
<b>WhatsApp:</b> +${userPhone}
        `;
        
        // Send to Telegram
        const telegramSuccess = await sendToTelegram(message);
        
        // Simulate processing time
        setTimeout(() => {
            hideLoader();
            purchaseModal.classList.remove('active');
            
            if (telegramSuccess) {
                showNotification(
                    translations[currentLang].successTitle,
                    translations[currentLang].purchaseSuccess,
                    'success'
                );
            } else {
                showNotification(
                    translations[currentLang].errorTitle,
                    'Failed to send order. Please try again.',
                    'error'
                );
            }
            
            purchaseForm.reset();
        }, 2000);
    });

    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === purchaseModal) {
            purchaseModal.classList.remove('active');
        }
    });

    // Theme toggle event listener
    themeToggle.addEventListener('click', toggleTheme);

    // Language toggle event listener
    langToggle.addEventListener('click', function() {
        const langs = ['en', 'ru', 'az'];
        const currentIndex = langs.indexOf(currentLang);
        const nextIndex = (currentIndex + 1) % langs.length;
        setLanguage(langs[nextIndex]);
    });

    // Initialize app
    function initApp() {
        // Set theme from cookie
        const savedTheme = getCookie('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }

        // Set language from cookie
        const savedLang = getCookie('language');
        if (savedLang && translations[savedLang]) {
            setLanguage(savedLang);
        } else {
            setLanguage('en');
        }

        // Hide welcome screen after a delay
        setTimeout(() => {
            welcomeScreen.classList.add('hidden');
            setTimeout(() => {
                welcomeScreen.style.display = 'none';
                appContainer.style.display = 'block';
            }, 800);
        }, 3000);

        // Hide initial loader after a short delay
        setTimeout(() => {
            hideLoader();
        }, 2000);
    }

    // Start the app
    initApp();
});
