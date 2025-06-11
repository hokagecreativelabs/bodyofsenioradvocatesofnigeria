import mongoose from 'mongoose';
import * as XLSX from 'xlsx';

// Import your User model
import User from '@/models/user.model'; // Adjust path as needed

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;

async function connectToDatabase() {
  if (mongoose.connections[0].readyState) {
    return;
  }
  
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

// Validate Excel row data
function validateRowData(row, rowIndex) {
  const errors = [];
  
  if (!row.id) {
    errors.push(`Row ${rowIndex + 2}: ID is required`);
  }
  
  if (!row.name) {
    errors.push(`Row ${rowIndex + 2}: Name is required`);
  }
  
  if (!row.fullName) {
    errors.push(`Row ${rowIndex + 2}: Full Name is required`);
  }
  
  if (!row.email) {
    errors.push(`Row ${rowIndex + 2}: Email is required`);
  } else {
    // Email validation using same regex as your schema
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(row.email)) {
      errors.push(`Row ${rowIndex + 2}: Invalid email format`);
    }
  }
  
  if (row.elevationYear && (isNaN(row.elevationYear) || row.elevationYear < 1900 || row.elevationYear > new Date().getFullYear())) {
    errors.push(`Row ${rowIndex + 2}: Invalid elevation year`);
  }
  
  if (row.callUpNumber && typeof row.callUpNumber !== 'string' && !row.callUpNumber.toString().trim()) {
    errors.push(`Row ${rowIndex + 2}: Call-up number must be a valid string`);
  }
  
  if (row.debitBalance && (isNaN(row.debitBalance) || row.debitBalance < 0)) {
    errors.push(`Row ${rowIndex + 2}: Debit balance cannot be negative`);
  }
  
  return errors;
}

// Generate activation token and expiry
function generateActivationToken() {
  const crypto = require('crypto');
  const token = crypto.randomBytes(32).toString('hex');
  const expiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
  return { token, expiry };
}

// Transform Excel data to match your User model
function transformRowData(row) {
  // Handle callUpNumber to avoid null duplicate key issues
  let callUpNumber;
  if (row.callUpNumber && row.callUpNumber.toString().trim()) {
    callUpNumber = row.callUpNumber.toString().trim();
  }
  // If callUpNumber is empty/null, we don't set it (leave it undefined)
  // This way Mongoose won't save it as null, avoiding the unique constraint issue

  // Generate activation token for new users
  const { token, expiry } = generateActivationToken();

  return {
    // Custom id from Excel (keeping as string to match your schema)
    id: row.id?.toString().trim(),
    
    // Required fields
    name: row.name?.toString().trim(),
    fullName: row.fullName?.toString().trim(),
    email: row.email?.toString().trim().toLowerCase(),
    
    // Optional fields
    elevationYear: row.elevationYear ? parseInt(row.elevationYear) : undefined,
    ...(callUpNumber && { callUpNumber }), // Only include if we have a value
    
    // Financial field
    debitBalance: row.debitBalance ? parseFloat(row.debitBalance) : 0,
    
    // Activation fields for new users
    activationToken: token,
    activationTokenExpiresAt: expiry,
    
    // Default values for other fields
    isActive: false,
    invitationSent: false,
    lastError: "",
    role: "user"
    
    // Note: _id, createdAt, updatedAt will be handled by Mongoose automatically
  };
}

// Named export for POST method
export async function POST(request) {
  console.log('POST request received');
  
  try {
    // Connect to database
    console.log('Connecting to database...');
    await connectToDatabase();
    console.log('Database connected');

    // Check content type
    const contentType = request.headers.get('content-type');
    console.log('Content-Type:', contentType);

    if (!contentType || !contentType.includes('multipart/form-data')) {
      console.log('Invalid content type');
      return Response.json({ 
        error: 'Content-Type must be multipart/form-data',
        receivedContentType: contentType 
      }, { status: 400 });
    }

    // Get the form data from the request
    console.log('Parsing form data...');
    const formData = await request.formData();
    console.log('Form data keys:', Array.from(formData.keys()));
    
    // Check for sendInvites flag (optional parameter)
    const shouldSendInvites = formData.get('sendInvites') !== 'false'; // Default to true
    console.log('Should send invites:', shouldSendInvites);
    
    // Try different field names that might be used
    const file = formData.get('excel') || formData.get('file') || formData.get('excelFile');
    console.log('File found:', file ? 'Yes' : 'No');
    
    if (!file) {
      console.log('No file uploaded');
      return Response.json({ 
        error: 'No Excel file uploaded',
        availableFields: Array.from(formData.keys()),
        hint: 'Make sure to send the file with field name "excel", "file", or "excelFile"'
      }, { status: 400 });
    }

    console.log('File details:', {
      name: file.name,
      size: file.size,
      type: file.type
    });

    // Validate file type
    if (!file.name.match(/\.(xlsx|xls)$/i)) {
      return Response.json({ 
        error: 'Invalid file type. Please upload an Excel file (.xlsx or .xls)',
        receivedType: file.type,
        receivedName: file.name
      }, { status: 400 });
    }

    // Convert File to buffer and read directly
    console.log('Converting file to buffer...');
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    console.log('Buffer size:', buffer.length);

    // Read and parse Excel file directly from buffer (no temporary file needed)
    console.log('Reading Excel file from buffer...');
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    console.log('Excel file read, sheet name:', sheetName);
    
    // Convert to JSON with header row
    const jsonData = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      defval: ''
    });
    console.log('Converted to JSON, rows:', jsonData.length);

    if (jsonData.length < 2) {
      return Response.json({ 
        error: 'Excel file must contain at least header row and one data row',
        rowsFound: jsonData.length
      }, { status: 400 });
    }

    // Get headers and validate required columns
    const headers = jsonData[0];
    console.log('Headers found:', headers);
    
    const requiredHeaders = ['id', 'name', 'fullName', 'email'];
    const optionalHeaders = ['elevationYear', 'callUpNumber', 'debitBalance'];
    
    const missingHeaders = requiredHeaders.filter(header => !headers.includes(header));
    if (missingHeaders.length > 0) {
      return Response.json({ 
        error: `Missing required columns: ${missingHeaders.join(', ')}`,
        foundHeaders: headers,
        requiredHeaders: requiredHeaders,
        optionalHeaders: optionalHeaders
      }, { status: 400 });
    }

    // Convert rows to objects
    const dataRows = jsonData.slice(1).map(row => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index];
      });
      return obj;
    }).filter(row => row.id); // Filter out empty rows

    console.log('Data rows after filtering:', dataRows.length);

    if (dataRows.length === 0) {
      return Response.json({ 
        error: 'No valid data rows found',
        totalRows: jsonData.length - 1,
        hint: 'Make sure your data rows have values in the "id" column'
      }, { status: 400 });
    }

    // Validate all rows
    console.log('Validating rows...');
    const validationErrors = [];
    dataRows.forEach((row, index) => {
      const errors = validateRowData(row, index);
      validationErrors.push(...errors);
    });

    if (validationErrors.length > 0) {
      return Response.json({ 
        error: 'Validation failed', 
        details: validationErrors.slice(0, 10), // Limit to first 10 errors
        totalErrors: validationErrors.length
      }, { status: 400 });
    }

    // Transform data
    console.log('Transforming data...');
    const transformedData = dataRows.map(transformRowData);

    // Check for duplicate IDs in database
    console.log('Checking for duplicate IDs...');
    const existingUsers = await User.find(
      { id: { $in: transformedData.map(item => item.id) } },
      { id: 1 }
    );

    if (existingUsers.length > 0) {
      const duplicateIds = existingUsers.map(user => user.id);
      return Response.json({
        error: 'Duplicate IDs found in database',
        duplicateIds: duplicateIds
      }, { status: 400 });
    }

    // Check for duplicate emails in database
    console.log('Checking for duplicate emails...');
    const existingEmails = await User.find(
      { email: { $in: transformedData.map(item => item.email) } },
      { email: 1 }
    );

    if (existingEmails.length > 0) {
      const duplicateEmails = existingEmails.map(user => user.email);
      return Response.json({
        error: 'Duplicate emails found in database',
        duplicateEmails: duplicateEmails
      }, { status: 400 });
    }

    // Insert data in order using Mongoose
    console.log('Inserting users...');
    const insertedUsers = [];
    for (const userData of transformedData) {
      try {
        const user = new User(userData);
        const savedUser = await user.save();
        insertedUsers.push({
          _id: savedUser._id,
          id: savedUser.id,
          name: savedUser.name,
          fullName: savedUser.fullName,
          email: savedUser.email
        });
      } catch (error) {
        console.error('Error saving user:', error);
        throw new Error(`Failed to save user with ID ${userData.id}: ${error.message}`);
      }
    }

    console.log('Import completed successfully');

    // Prepare response
    const response = {
      message: 'Data imported successfully',
      insertedCount: insertedUsers.length,
      insertedUsers: insertedUsers,
      invitesSent: false,
      inviteResults: null
    };

    // Send invites if requested (default behavior)
    if (shouldSendInvites && insertedUsers.length > 0) {
      try {
        console.log('Sending invites to imported users...');
        
        // Get the base URL from the request
        const url = new URL(request.url);
        const baseUrl = `${url.protocol}//${url.host}`;
        const sendInvitesUrl = `${baseUrl}/api/send-invites`;

        const inviteResponse = await fetch(sendInvitesUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(request.headers.get('authorization') && {
              'authorization': request.headers.get('authorization')
            })
          },
          body: JSON.stringify({
            userIds: insertedUsers.map(user => user._id.toString())
          })
        });

        if (!inviteResponse.ok) {
          throw new Error(`Send-invites failed: ${inviteResponse.status}`);
        }

        const inviteResults = await inviteResponse.json();
        
        response.invitesSent = true;
        response.inviteResults = inviteResults;
        response.message = 'Data imported and invitations sent successfully';
        
      } catch (inviteError) {
        console.error('Failed to send invites after import:', inviteError);
        
        response.message = 'Data imported successfully, but failed to send invitations';
        response.inviteError = inviteError.message;
      }
    }

    return Response.json(response);

  } catch (error) {
    console.error('Import error:', error);
    
    return Response.json({ 
      error: 'Import failed', 
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}

// Add a GET method for testing
export async function GET() {
  return Response.json({ 
    message: 'User import API is working',
    methods: ['POST'],
    expectedFields: ['excel', 'file'],
    optionalFields: ['sendInvites'], // Set to 'false' to skip automatic invites
    requiredColumns: ['id', 'name', 'fullName', 'email'],
    optionalColumns: ['elevationYear', 'callUpNumber', 'debitBalance'],
    defaultBehavior: 'Automatically sends invites after import unless sendInvites=false'
  });
}