// ===== CONFIGURATION =====
const GAS_URL = 'https://script.google.com/macros/s/AKfycbztEzhX_eP45DewTTneRu1msjNfGPzxCneyHOk-2NjoTe56uRwufQ1AGZIrz8CTEfcw/exec'; // Replace with your deployed GAS URL
const ADMIN_EMAIL = 'community@gmail.com';
const ADMIN_PASSWORD = 'admin@community';

let currentUser = null;
let currentUserRole = null;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    loadLeaders();
    loadStats();
    checkAuthStatus();
});

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Hamburger Menu
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // Message Form
    const messageForm = document.getElementById('messageForm');
    if (messageForm) {
        messageForm.addEventListener('submit', handleMessageSubmit);
    }

    // Login Form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLoginSubmit);
    }

    // Signup Form
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignupSubmit);
    }

    // Leader Form (Admin)
    const leaderForm = document.getElementById('leaderForm');
    if (leaderForm) {
        leaderForm.addEventListener('submit', handleLeaderSubmit);
    }

    // Donation Status Form (Admin)
    const donationStatusForm = document.getElementById('donationStatusForm');
    if (donationStatusForm) {
        donationStatusForm.addEventListener('submit', handleDonationStatusSubmit);
    }
}

// ===== PAGE SWITCHING =====
function switchPage(pageName) {
    // Close hamburger menu
    const navMenu = document.getElementById('navMenu');
    navMenu.classList.remove('active');

    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));

    // Show selected page
    const selectedPage = document.getElementById(pageName);
    if (selectedPage) {
        selectedPage.classList.add('active');

        // Load page-specific data
        if (pageName === 'donation') {
            document.getElementById('donationTableBody').innerHTML = '<tr><td colspan="4" class="text-center">Enter your email to view donation status</td></tr>';
            // if a user is logged in, prefill their email and immediately load their records
            if (currentUser && currentUser.role === 'user') {
                const emailInput = document.getElementById('donationEmail');
                if (emailInput) {
                    emailInput.value = currentUser.email;
                    loadDonationStatus();
                }
            }
        } else if (pageName === 'admin') {
            loadAdminDashboard();
        }
    }

    // Scroll to top
    window.scrollTo(0, 0);
}

function switchAdminTab(tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.admin-tab-content');
    tabContents.forEach(content => content.classList.remove('active'));

    // Remove active class from all buttons
    const tabButtons = document.querySelectorAll('.admin-tab-btn');
    tabButtons.forEach(button => button.classList.remove('active'));

    // Show selected tab
    const selectedTab = document.getElementById(tabName + 'Tab');
    if (selectedTab) {
        selectedTab.classList.add('active');
    }

    // Add active class to clicked button
    event.target.classList.add('active');

    // Load tab-specific data
    if (tabName === 'leaders') {
        loadAdminLeaders();
    } else if (tabName === 'donations') {
        loadAdminDonations();
    } else if (tabName === 'messages') {
        loadAdminMessages();
    }
}

// ===== AUTH FUNCTIONS =====
function checkAuthStatus() {
    const authData = localStorage.getItem('authData');
    if (authData) {
        const user = JSON.parse(authData);
        currentUser = user;
        updateNavigation();
    }
}

function updateNavigation() {
    const authNavItem = document.getElementById('authNavItem');
    const adminNavItem = document.getElementById('adminNavItem');
    const logoutNavItem = document.getElementById('logoutNavItem');

    if (currentUser) {
        authNavItem.style.display = 'none';
        logoutNavItem.style.display = 'block';

        if (currentUser.role === 'admin') {
            adminNavItem.style.display = 'block';
        }
    } else {
        authNavItem.style.display = 'block';
        logoutNavItem.style.display = 'none';
        adminNavItem.style.display = 'none';
    }
}

function logout() {
    localStorage.removeItem('authData');
    currentUser = null;
    currentUserRole = null;
    updateNavigation();
    switchPage('home');
    showNotification('Logged out successfully', 'success');
}

async function handleLoginSubmit(e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    // Check for admin login
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        currentUser = {
            email: email,
            name: 'Admin',
            role: 'admin'
        };
        localStorage.setItem('authData', JSON.stringify(currentUser));
        updateNavigation();
        switchPage('admin');
        showNotification('Admin login successful!', 'success');
        document.getElementById('loginForm').reset();
        return;
    }

    // Regular user login - call GAS
    try {
        showNotification('Logging in...', 'success');
        const response = await callGAS('login', { email, password });

        if (response.success) {
            currentUser = response.user;
            localStorage.setItem('authData', JSON.stringify(currentUser));
            updateNavigation();
            switchPage('home');
            showNotification('Login successful!', 'success');
            document.getElementById('loginForm').reset();
        } else {
            showNotification(response.error || 'Login failed', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showNotification('Error during login: ' + error.message, 'error');
    }
}

async function handleSignupSubmit(e) {
    e.preventDefault();

    const userData = {
        name: document.getElementById('signupName').value,
        email: document.getElementById('signupEmail').value,
        phone: document.getElementById('signupPhone').value,
        address: document.getElementById('signupAddress').value,
        password: document.getElementById('signupPassword').value
    };

    try {
        showNotification('Creating account...', 'success');
        const response = await callGAS('signup', userData);

        if (response.success) {
            showNotification('Account created! Please login.', 'success');
            document.getElementById('signupForm').reset();
            setTimeout(() => switchPage('login'), 1500);
        } else {
            showNotification(response.error || 'Signup failed', 'error');
        }
    } catch (error) {
        console.error('Signup error:', error);
        showNotification('Error during signup: ' + error.message, 'error');
    }
}

// ===== MESSAGE FUNCTIONS =====
async function handleMessageSubmit(e) {
    e.preventDefault();

    const messageData = {
        name: document.getElementById('msgName').value,
        phone: document.getElementById('msgPhone').value,
        address: document.getElementById('msgAddress').value,
        message: document.getElementById('msgContent').value
    };

    try {
        showNotification('Sending message...', 'success');
        const response = await callGAS('messages/create', messageData);

        if (response.success) {
            showNotification('Message sent successfully! Thank you!', 'success');
            document.getElementById('messageForm').reset();
            setTimeout(() => switchPage('home'), 1500);
        } else {
            showNotification(response.error || 'Failed to send message', 'error');
        }
    } catch (error) {
        console.error('Message error:', error);
        showNotification('Error sending message: ' + error.message, 'error');
    }
}

// ===== LEADERS FUNCTIONS =====
async function loadLeaders() {
    try {
        const response = await callGAS('leaders/get', {});

        if (response.success && response.leaders) {
            const leadersGrid = document.getElementById('leadersGrid');
            const statLeaders = document.getElementById('statLeaders');

            if (leadersGrid) {
                leadersGrid.innerHTML = response.leaders.map(leader => `
                    <div class="leader-card" onclick="openLeaderModal('${leader.id}', '${leader.name}', '${leader.title}', '${leader.photoURL}', '${leader.description}')">
                        <img src="${leader.photoURL}" alt="${leader.name}" class="leader-image" onerror="this.src='https://via.placeholder.com/300x250?text=${leader.name}'">
                        <div class="leader-info">
                            <h3>${leader.name}</h3>
                            <p class="title">${leader.title}</p>
                            <p>${leader.description.substring(0, 100)}...</p>
                        </div>
                    </div>
                `).join('');
            }

            if (statLeaders) {
                statLeaders.textContent = response.leaders.length;
            }
        }
    } catch (error) {
        console.error('Error loading leaders:', error);
    }
}

function openLeaderModal(id, name, title, photoURL, description) {
    document.getElementById('leaderName').textContent = name;
    document.getElementById('leaderTitle').textContent = title;
    document.getElementById('leaderPhoto').src = photoURL;
    document.getElementById('leaderDescription').textContent = description;
    openModal('leaderModal');
}

// Admin: Load leaders for management
async function loadAdminLeaders() {
    try {
        const response = await callGAS('leaders/get', {});

        if (response.success && response.leaders) {
            const tableBody = document.getElementById('leadersTableBody');
            tableBody.innerHTML = response.leaders.map(leader => `
                <tr>
                    <td>${leader.name}</td>
                    <td>${leader.title}</td>
                    <td style="max-width: 200px; word-break: break-all;">${leader.photoURL}</td>
                    <td>
                        <div class="action-buttons">
                            <button class="action-btn action-edit" onclick="editLeader('${leader.id}', '${leader.name}', '${leader.title}', '${leader.photoURL}', '${leader.description}')">Edit</button>
                            <button class="action-btn action-delete" onclick="deleteLeader('${leader.id}')">Delete</button>
                        </div>
                    </td>
                </tr>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading admin leaders:', error);
    }
}

// viewer modal — keeps the earlier definition intact
// (the first openLeaderModal defined above is the one actually used)

// helper to open the admin form modal for add/edit
function openLeaderFormModal(id = null, name = '', title = '', photoURL = '', description = '') {
    document.getElementById('leaderFormTitle').textContent = id ? 'Edit Leader' : 'Add New Leader';
    document.getElementById('leaderId').value = id || '';
    document.getElementById('leaderInputName').value = name;
    document.getElementById('leaderInputTitle').value = title;
    document.getElementById('leaderInputPhoto').value = photoURL;
    document.getElementById('leaderInputDesc').value = description;
    openModal('leaderFormModal');
}

function editLeader(id, name, title, photoURL, description) {
    document.getElementById('leaderFormTitle').textContent = 'Edit Leader';
    document.getElementById('leaderId').value = id;
    document.getElementById('leaderInputName').value = name;
    document.getElementById('leaderInputTitle').value = title;
    document.getElementById('leaderInputPhoto').value = photoURL;
    document.getElementById('leaderInputDesc').value = description;
    openModal('leaderFormModal');
}

async function handleLeaderSubmit(e) {
    e.preventDefault();

    const leaderId = document.getElementById('leaderId').value;
    const leaderData = {
        name: document.getElementById('leaderInputName').value,
        title: document.getElementById('leaderInputTitle').value,
        photoURL: document.getElementById('leaderInputPhoto').value,
        description: document.getElementById('leaderInputDesc').value
    };

    try {
        let endpoint = 'leaders/create';
        if (leaderId) {
            leaderData.id = leaderId;
            endpoint = 'leaders/update';
        }

        const response = await callGAS(endpoint, leaderData);

        if (response.success) {
            showNotification(leaderId ? 'Leader updated!' : 'Leader added!', 'success');
            closeModal('leaderFormModal');
            document.getElementById('leaderForm').reset();
            document.getElementById('leaderId').value = '';
            document.getElementById('leaderFormTitle').textContent = 'Add New Leader';
            loadLeaders();
            loadAdminLeaders();
        } else {
            showNotification(response.error || 'Failed to save leader', 'error');
        }
    } catch (error) {
        console.error('Leader error:', error);
        showNotification('Error: ' + error.message, 'error');
    }
}

async function deleteLeader(id) {
    if (confirm('Are you sure you want to delete this leader?')) {
        try {
            const response = await callGAS('leaders/delete', { id });

            if (response.success) {
                showNotification('Leader deleted!', 'success');
                loadLeaders();
                loadAdminLeaders();
            } else {
                showNotification(response.error || 'Failed to delete leader', 'error');
            }
        } catch (error) {
            console.error('Delete error:', error);
            showNotification('Error: ' + error.message, 'error');
        }
    }
}

// ===== DONATION FUNCTIONS =====
async function loadDonationStatus() {
    const email = document.getElementById('donationEmail').value;

    if (!email) {
        showNotification('Please enter your email', 'error');
        return;
    }

    try {
        const response = await callGAS('donations/get', { email });

        if (response.success && response.donations) {
            const tableBody = document.getElementById('donationTableBody');
            tableBody.innerHTML = response.donations.map(donation => `
                <tr>
                    <td>${donation.month}</td>
                    <td>
                        <span class="status-badge status-${donation.status}">
                            ${donation.status === 'paid' ? '✓ Paid' : donation.status === 'pending' ? '⏳ Pending' : '✗ Unpaid'}
                        </span>
                    </td>
                    <td>${donation.amount || '-'}</td>
                    <td>
                        ${donation.status === 'pending' ? '<span class="text-muted">Awaiting confirmation</span>' : '-'}
                    </td>
                </tr>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading donations:', error);
        showNotification('Error loading donations: ' + error.message, 'error');
    }
}

// Admin: Load donations for management
async function loadAdminDonations() {
    try {
        const response = await callGAS('donations/get', { allRecords: true });

        if (response.success && response.donations) {
            const tableBody = document.getElementById('adminDonationsTableBody');
            tableBody.innerHTML = response.donations.map(donation => {
                const amtDisplay = donation.amount ? donation.amount : '-';
                const amtValue = donation.amount ? donation.amount : '';
                return `
                <tr>
                    <td>${donation.userName || '<em>unknown</em>'}</td>
                    <td>${donation.email}</td>
                    <td>${donation.userPhone || '-'}</td>
                    <td>${donation.month}</td>
                    <td>${amtDisplay}</td>
                    <td>
                        <span class="status-badge status-${donation.status}">
                            ${donation.status === 'paid' ? '✓ Paid' : donation.status === 'pending' ? '⏳ Pending' : '✗ Unpaid'}
                        </span>
                    </td>
                    <td>
                        <button class="action-btn action-edit" onclick="editDonationStatus('${donation.id}', '${donation.userName || ''}', '${donation.email}', '${donation.userPhone || ''}', '${donation.month}', '${amtValue}', '${donation.status}')">Update</button>
                    </td>
                </tr>
            `;
            }).join('');
        }
    } catch (error) {
        console.error('Error loading admin donations:', error);
    }
}

function editDonationStatus(id, userName, email, phone, month, amount, status) {
    document.getElementById('donationId').value = id;
    document.getElementById('donationUserName').value = userName;
    document.getElementById('donationUserEmail').value = email;
    document.getElementById('donationUserPhone').value = phone;
    document.getElementById('donationMonth').value = month;
    document.getElementById('donationAmount').value = amount;
    document.getElementById('donationStatusSelect').value = status;
    openModal('donationStatusModal');
}

async function handleDonationStatusSubmit(e) {
    e.preventDefault();

    const donationData = {
        id: document.getElementById('donationId').value,
        amount: document.getElementById('donationAmount').value,
        status: document.getElementById('donationStatusSelect').value,
        isAdmin: currentUser && currentUser.role === 'admin'
    };

    try {
        if (!donationData.isAdmin) {
            showNotification('You are not authorized to update donation information', 'error');
            return;
        }
        const response = await callGAS('donations/update', donationData);

        if (response.success) {
            showNotification('Donation updated successfully!', 'success');
            closeModal('donationStatusModal');
            document.getElementById('donationStatusForm').reset();
            loadAdminDonations();
        } else {
            showNotification(response.error || 'Failed to update', 'error');
        }
    } catch (error) {
        console.error('Update error:', error);
        showNotification('Error: ' + error.message, 'error');
    }
}

// ===== MESSAGE FUNCTIONS (Admin) =====
async function loadAdminMessages() {
    try {
        const response = await callGAS('messages/get', {});

        if (response.success && response.messages) {
            const tableBody = document.getElementById('messagesTableBody');
            tableBody.innerHTML = response.messages.map(message => `
                <tr>
                    <td>${message.name}</td>
                    <td>${message.phone}</td>
                    <td>${new Date(message.timestamp).toLocaleDateString()}</td>
                    <td>
                        <span class="status-badge" style="background: #e3f2fd; color: #1976d2;">
                            ${message.read ? 'Read' : 'Unread'}
                        </span>
                    </td>
                    <td>
                        <button class="action-btn action-view" onclick="viewMessage('${message.id}', '${message.name}', '${message.phone}', '${message.address}', '${message.message}', '${message.timestamp}')">View</button>
                    </td>
                </tr>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading messages:', error);
    }
}

function viewMessage(id, name, phone, address, message, timestamp) {
    document.getElementById('messageViewName').textContent = name;
    document.getElementById('messageViewPhone').textContent = phone;
    document.getElementById('messageViewAddress').textContent = address;
    document.getElementById('messageViewDate').textContent = new Date(timestamp).toLocaleString();
    document.getElementById('messageViewContent').textContent = message;
    openModal('messageModal');
}

// ===== STATS FUNCTIONS =====
async function loadStats() {
    try {
        const response = await callGAS('stats/get', {});

        if (response.success) {
            document.getElementById('statUsers').textContent = response.userCount || 0;
            document.getElementById('statDonations').textContent = response.donationCount || 0;
            document.getElementById('statMessages').textContent = response.messageCount || 0;
            document.getElementById('statLeaders').textContent = response.leaderCount || 0;
        }
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// ===== ADMIN DASHBOARD =====
async function loadAdminDashboard() {
    if (!currentUser || currentUser.role !== 'admin') {
        switchPage('home');
        return;
    }

    try {
        const response = await callGAS('stats/get', {});

        if (response.success) {
            document.getElementById('adminStatUsers').textContent = response.userCount || 0;
            document.getElementById('adminStatLeaders').textContent = response.leaderCount || 0;
            document.getElementById('adminStatMessages').textContent = response.messageCount || 0;
            document.getElementById('adminStatDonations').textContent = response.donationCount || 0;
        }
        
        // Load the admin tables data
        loadAdminLeaders();
        loadAdminDonations();
        loadAdminMessages();
    } catch (error) {
        console.error('Error loading admin dashboard:', error);
    }
}

// ===== MODAL FUNCTIONS =====
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

// Close modal when clicking outside
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
});

// ===== NOTIFICATION FUNCTIONS =====
function showNotification(message, type = 'success') {
    const notification = document.getElementById(type === 'success' ? 'successNotification' : 'errorNotification');
    const textElement = document.getElementById(type === 'success' ? 'notificationText' : 'errorText');

    textElement.textContent = message;
    notification.classList.add('active');

    setTimeout(() => {
        notification.classList.remove('active');
    }, 3000);
}

function closeNotification(type = 'success') {
    const notification = document.getElementById(type === 'success' ? 'successNotification' : 'errorNotification');
    notification.classList.remove('active');
}

// ===== GOOGLE APPS SCRIPT API CALLS =====
async function callGAS(endpoint, data) {
    if (!GAS_URL || GAS_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
        // For demo purposes, return mock data
        return handleMockGASCall(endpoint, data);
    }

    try {
        const url = `${GAS_URL}?endpoint=${endpoint}`;
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'text/plain' // Using text/plain to avoid CORS preflight
            }
        });

        return await response.json();
    } catch (error) {
        console.error('GAS call error:', error);
        throw error;
    }
}

// Mock data for demo/testing

// keep some state so that signup/login create a donation record and admin actions persist
const mockUsers = [];
const mockDonations = [];

function handleMockGASCall(endpoint, data) {
    // Sample mock leaders
    const mockLeaders = [
        {
            id: '1',
            name: 'John Smith',
            title: 'Community President',
            photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
            description: 'John has been leading our community for 5 years with dedication and vision.'
        },
        {
            id: '2',
            name: 'Sarah Johnson',
            title: 'Finance Manager',
            photoURL: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
            description: 'Sarah manages our finances with transparency and accountability.'
        },
        {
            id: '3',
            name: 'Michael Brown',
            title: 'Event Coordinator',
            photoURL: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
            description: 'Michael organizes community events that bring us all together.'
        }
    ];

    switch (endpoint) {
        case 'leaders/get':
            return { success: true, leaders: mockLeaders };

        case 'signup':
            // store user and create a placeholder donation
            if (data && data.email) {
                mockUsers.push({ email: data.email, name: data.name });
                mockDonations.push({
                    id: String(mockDonations.length + 1),
                    email: data.email,
                    month: new Date().toLocaleString('default', { month: 'long' }),
                    status: 'pending',
                    amount: ''
                });
            }
            return { success: true, message: 'User created successfully' };

        case 'login':
            if (data.email && data.password) {
                // ensure donation if missing
                const exists = mockDonations.some(d => d.email === data.email);
                if (!exists) {
                    mockDonations.push({
                        id: String(mockDonations.length + 1),
                        email: data.email,
                        month: new Date().toLocaleString('default', { month: 'long' }),
                        status: 'pending',
                        amount: ''
                    });
                }
                return {
                    success: true,
                    user: {
                        email: data.email,
                        name: 'User',
                        role: 'user'
                    }
                };
            }
            return { success: false, error: 'Invalid credentials' };

        case 'messages/create':
            return { success: true, message: 'Message saved' };

        case 'messages/get':
            return {
                success: true,
                messages: [
                    {
                        id: '1',
                        name: 'Sample Message',
                        phone: '123-456-7890',
                        address: 'Sample Address',
                        message: 'This is a sample message',
                        timestamp: new Date(),
                        read: false
                    }
                ]
            };

        case 'donations/get':
            if (data.allRecords) {
                // return the mockDonations with some user info
                const users = mockUsers.reduce((acc, u) => {
                    acc[u.email] = u;
                    return acc;
                }, {});
                const enriched = mockDonations.map(d => ({
                    ...d,
                    userName: users[d.email] ? users[d.email].name : '',
                    userPhone: ''
                }));
                return { success: true, donations: enriched };
            } else if (data.email) {
                const donationsForUser = mockDonations.filter(d => d.email === data.email);
                return { success: true, donations: donationsForUser };
            }
            return { success: true, donations: [] };

        case 'donations/update':
            // update mock donation entry
            const idx = mockDonations.findIndex(d => d.id === data.id);
            if (idx !== -1) {
                if (data.status) mockDonations[idx].status = data.status;
                if (data.amount !== undefined) mockDonations[idx].amount = data.amount;
            }
            return { success: true, message: 'Donation updated' };

        case 'stats/get':
            return {
                success: true,
                userCount: mockUsers.length,
                leaderCount: mockLeaders.length,
                messageCount: 12,
                donationCount: mockDonations.length
            };

        default:
            return { success: false, error: 'Unknown endpoint' };
    }
}

// ===== SHA-256 HASH FUNCTION (for password hashing) =====
async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// ===== UTILITY FUNCTIONS =====
function formatDate(timestamp) {
    return new Date(timestamp).toLocaleDateString();
}

function formatTime(timestamp) {
    return new Date(timestamp).toLocaleTimeString();
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

console.log('Community Portal loaded successfully');
