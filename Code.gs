// ===== GOOGLE APPS SCRIPT BACKEND =====
// Community Portal - Backend API
// Deploy as web app with access to anyone

// ===== CONFIGURATION =====
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE'; // Replace with your Google Sheet ID
const SHEET_NAMES = {
  users: 'Users',
  leaders: 'Leaders',
  donations: 'Donations',
  messages: 'Messages'
};

// ===== MAIN HANDLER =====
function doPost(e) {
  try {
    // If the request is OPTIONS, we need to handle it for CORS preflight
    if (e.postData === null) {
      return ContentService.createTextOutput('')
        .setMimeType(ContentService.MimeType.TEXT)
        .setHeader('Access-Control-Allow-Origin', '*')
        .setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
        .setHeader('Access-Control-Allow-Headers', 'Content-Type');
    }
    
    const data = JSON.parse(e.postData.contents);
    const endpoint = e.parameter.endpoint;

    const response = handleEndpoint(endpoint, data);
    return ContentService.createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader('Access-Control-Allow-Origin', '*')
      .setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
      .setHeader('Access-Control-Allow-Headers', 'Content-Type');
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    success: false,
    error: 'Use POST requests only'
  }))
  .setMimeType(ContentService.MimeType.JSON)
  .setHeader('Access-Control-Allow-Origin', '*')
  .setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
  .setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// ===== ENDPOINT ROUTER =====
function handleEndpoint(endpoint, data) {
  switch (endpoint) {
    // Auth
    case 'signup':
      return handleSignup(data);
    case 'login':
      return handleLogin(data);

    // Leaders
    case 'leaders/get':
      return handleGetLeaders();
    case 'leaders/create':
      return handleCreateLeader(data);
    case 'leaders/update':
      return handleUpdateLeader(data);
    case 'leaders/delete':
      return handleDeleteLeader(data);

    // Donations
    case 'donations/get':
      return handleGetDonations(data);
    case 'donations/update':
      return handleUpdateDonation(data);

    // Messages
    case 'messages/create':
      return handleCreateMessage(data);
    case 'messages/get':
      return handleGetMessages();

    // Stats
    case 'stats/get':
      return handleGetStats();

    default:
      return { success: false, error: 'Unknown endpoint' };
  }
}

// ===== UTILITY FUNCTIONS =====
function getSheet(sheetName) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  return ss.getSheetByName(sheetName);
}

function getSheetData(sheetName) {
  const sheet = getSheet(sheetName);
  if (!sheet) return [];
  const data = sheet.getDataRange().getValues();
  return data.length > 1 ? data.slice(1) : [];
}

function getSheetHeaders(sheetName) {
  const sheet = getSheet(sheetName);
  if (!sheet) return [];
  const data = sheet.getDataRange().getValues();
  return data[0] || [];
}

function getColumnIndex(sheetName, columnName) {
  const headers = getSheetHeaders(sheetName);
  return headers.indexOf(columnName);
}

function findRowByValue(sheetName, columnName, value) {
  const sheet = getSheet(sheetName);
  const data = sheet.getDataRange().getValues();
  const colIndex = getColumnIndex(sheetName, columnName);

  for (let i = 1; i < data.length; i++) {
    if (data[i][colIndex] === value) {
      return { row: i + 1, data: data[i] };
    }
  }
  return null;
}

function generateId() {
  return 'ID_' + Utilities.getUuid();
}

function generateTimestamp() {
  return new Date().toISOString();
}

// SHA-256 Hash (using Apps Script native function)
function hashPassword(password) {
  const signature = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    password
  );
  return Utilities.base64Encode(signature);
}

function verifyPassword(password, hash) {
  return hashPassword(password) === hash;
}

// ===== AUTH HANDLERS =====
function handleSignup(data) {
  // Validate input
  if (!data.name || !data.email || !data.phone || !data.address || !data.password) {
    return { success: false, error: 'Missing required fields' };
  }

  // Check if user already exists
  const existingUser = findRowByValue(SHEET_NAMES.users, 'email', data.email);
  if (existingUser) {
    return { success: false, error: 'Email already registered' };
  }

  try {
    const sheet = getSheet(SHEET_NAMES.users);
    const newRow = [
      generateId(),
      data.name,
      data.phone,
      data.email,
      data.address,
      hashPassword(data.password)
    ];

    sheet.appendRow(newRow);

    return { success: true, message: 'User registered successfully' };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

function handleLogin(data) {
  if (!data.email || !data.password) {
    return { success: false, error: 'Email and password required' };
  }

  try {
    const user = findRowByValue(SHEET_NAMES.users, 'email', data.email);

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    const headers = getSheetHeaders(SHEET_NAMES.users);
    const passwordHashIndex = getColumnIndex(SHEET_NAMES.users, 'passwordHash');

    if (!verifyPassword(data.password, user.data[passwordHashIndex])) {
      return { success: false, error: 'Invalid password' };
    }

    const nameIndex = getColumnIndex(SHEET_NAMES.users, 'name');
    return {
      success: true,
      user: {
        email: data.email,
        name: user.data[nameIndex],
        role: 'user'
      }
    };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

// ===== LEADER HANDLERS =====
function handleGetLeaders() {
  try {
    const sheet = getSheet(SHEET_NAMES.leaders);
    if (!sheet) return { success: false, error: 'Leaders sheet not found' };

    const data = sheet.getDataRange().getValues();
    const headers = data[0];

    const leaders = [];
    for (let i = 1; i < data.length; i++) {
      if (data[i][0]) { // Check if ID exists
        leaders.push({
          id: data[i][0],
          name: data[i][1],
          title: data[i][2],
          photoURL: data[i][3],
          description: data[i][4]
        });
      }
    }

    return { success: true, leaders: leaders };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

function handleCreateLeader(data) {
  if (!data.name || !data.title || !data.photoURL || !data.description) {
    return { success: false, error: 'Missing required fields' };
  }

  try {
    const sheet = getSheet(SHEET_NAMES.leaders);
    const newRow = [
      generateId(),
      data.name,
      data.title,
      data.photoURL,
      data.description
    ];

    sheet.appendRow(newRow);
    return { success: true, message: 'Leader created' };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

function handleUpdateLeader(data) {
  if (!data.id || !data.name || !data.title || !data.photoURL || !data.description) {
    return { success: false, error: 'Missing required fields' };
  }

  try {
    const sheet = getSheet(SHEET_NAMES.leaders);
    const sheetData = sheet.getDataRange().getValues();

    for (let i = 1; i < sheetData.length; i++) {
      if (sheetData[i][0] === data.id) {
        sheet.getRange(i + 1, 1, 1, 5).setValues([[
          data.id,
          data.name,
          data.title,
          data.photoURL,
          data.description
        ]]);
        return { success: true, message: 'Leader updated' };
      }
    }

    return { success: false, error: 'Leader not found' };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

function handleDeleteLeader(data) {
  if (!data.id) {
    return { success: false, error: 'Leader ID required' };
  }

  try {
    const sheet = getSheet(SHEET_NAMES.leaders);
    const sheetData = sheet.getDataRange().getValues();

    for (let i = 1; i < sheetData.length; i++) {
      if (sheetData[i][0] === data.id) {
        sheet.deleteRow(i + 1);
        return { success: true, message: 'Leader deleted' };
      }
    }

    return { success: false, error: 'Leader not found' };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

// ===== DONATION HANDLERS =====
function handleGetDonations(data) {
  try {
    const sheet = getSheet(SHEET_NAMES.donations);
    if (!sheet) return { success: false, error: 'Donations sheet not found' };

    const sheetData = sheet.getDataRange().getValues();
    const headers = sheetData[0];

    let donations = [];

    if (data.allRecords) {
      // Admin: get all donations
      for (let i = 1; i < sheetData.length; i++) {
        if (sheetData[i][0]) {
          donations.push({
            id: sheetData[i][0],
            email: sheetData[i][1],
            month: sheetData[i][2],
            status: sheetData[i][3]
          });
        }
      }
    } else if (data.email) {
      // User: get own donations
      for (let i = 1; i < sheetData.length; i++) {
        if (sheetData[i][1] === data.email) {
          donations.push({
            id: sheetData[i][0],
            email: sheetData[i][1],
            month: sheetData[i][2],
            status: sheetData[i][3]
          });
        }
      }
    }

    return { success: true, donations: donations };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

function handleUpdateDonation(data) {
  if (!data.id || !data.status) {
    return { success: false, error: 'Missing required fields' };
  }

  try {
    const sheet = getSheet(SHEET_NAMES.donations);
    const sheetData = sheet.getDataRange().getValues();

    for (let i = 1; i < sheetData.length; i++) {
      if (sheetData[i][0] === data.id) {
        sheet.getRange(i + 1, 4).setValue(data.status);
        return { success: true, message: 'Donation updated' };
      }
    }

    return { success: false, error: 'Donation not found' };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

// ===== MESSAGE HANDLERS =====
function handleCreateMessage(data) {
  if (!data.name || !data.phone || !data.address || !data.message) {
    return { success: false, error: 'Missing required fields' };
  }

  try {
    const sheet = getSheet(SHEET_NAMES.messages);
    const newRow = [
      generateId(),
      data.name,
      data.phone,
      data.address,
      data.message,
      generateTimestamp()
    ];

    sheet.appendRow(newRow);
    return { success: true, message: 'Message saved' };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

function handleGetMessages() {
  try {
    const sheet = getSheet(SHEET_NAMES.messages);
    if (!sheet) return { success: false, error: 'Messages sheet not found' };

    const sheetData = sheet.getDataRange().getValues();

    const messages = [];
    for (let i = 1; i < sheetData.length; i++) {
      if (sheetData[i][0]) {
        messages.push({
          id: sheetData[i][0],
          name: sheetData[i][1],
          phone: sheetData[i][2],
          address: sheetData[i][3],
          message: sheetData[i][4],
          timestamp: sheetData[i][5],
          read: sheetData[i][6] || false
        });
      }
    }

    return { success: true, messages: messages };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

// ===== STATS HANDLERS =====
function handleGetStats() {
  try {
    const usersSheet = getSheet(SHEET_NAMES.users);
    const leadersSheet = getSheet(SHEET_NAMES.leaders);
    const messagesSheet = getSheet(SHEET_NAMES.messages);
    const donationsSheet = getSheet(SHEET_NAMES.donations);

    const getUserCount = () => {
      const data = usersSheet.getDataRange().getValues();
      return Math.max(0, data.length - 1);
    };

    const getLeaderCount = () => {
      const data = leadersSheet.getDataRange().getValues();
      return Math.max(0, data.length - 1);
    };

    const getMessageCount = () => {
      const data = messagesSheet.getDataRange().getValues();
      return Math.max(0, data.length - 1);
    };

    const getDonationCount = () => {
      const data = donationsSheet.getDataRange().getValues();
      return Math.max(0, data.length - 1);
    };

    return {
      success: true,
      userCount: getUserCount(),
      leaderCount: getLeaderCount(),
      messageCount: getMessageCount(),
      donationCount: getDonationCount()
    };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

// ===== TEST FUNCTION =====
function testDeployment() {
  const result = handleGetStats();
  Logger.log('Deployment test: ' + JSON.stringify(result));
}
