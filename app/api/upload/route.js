import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

// Configure Cloudinary with timeout settings
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  // Add timeout configuration
  timeout: 60000, // 60 seconds timeout
});

export async function POST(req) {
  try {
    console.log("Upload API called");
    
    // Verify Cloudinary configuration
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error("Missing Cloudinary configuration");
      return NextResponse.json({ 
        error: "Server configuration error" 
      }, { status: 500 });
    }

    // Get the form data from the request
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      console.error("No file in request");
      return NextResponse.json({ 
        error: "No file uploaded" 
      }, { status: 400 });
    }

    console.log("File received:", {
      name: file.name,
      size: file.size,
      type: file.type
    });

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ 
        error: "Invalid file type. Please upload an image." 
      }, { status: 400 });
    }

    // Validate file size (reduce to 3MB for faster uploads)
    if (file.size > 3 * 1024 * 1024) {
      return NextResponse.json({ 
        error: "File too large. Please upload an image smaller than 3MB." 
      }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    console.log("Starting Cloudinary upload...");

    // Create a promise with explicit timeout handling
    const uploadPromise = new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "events",
          resource_type: "image",
          // Reduced transformations for faster processing
          transformation: [
            { width: 600, height: 600, crop: "limit" }, // Smaller size
            { quality: "auto:low" }, // Lower quality for faster upload
            { fetch_format: "auto" }
          ],
          // Add upload options for better reliability
          chunk_size: 6000000, // 6MB chunks
          timeout: 60000, // 60 second timeout
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            reject(error);
          } else {
            console.log("Cloudinary upload success:", {
              public_id: result.public_id,
              secure_url: result.secure_url
            });
            resolve(result);
          }
        }
      );

      // Set a timeout for the upload stream
      const timeoutId = setTimeout(() => {
        uploadStream.destroy();
        reject(new Error('Upload timeout after 50 seconds'));
      }, 50000);

      uploadStream.on('progress', (bytesUploaded, bytesTotal) => {
        console.log(`Upload progress: ${Math.round((bytesUploaded / bytesTotal) * 100)}%`);
      });

      uploadStream.on('end', () => {
        clearTimeout(timeoutId);
      });

      uploadStream.end(buffer);
    });

    // Race the upload against a timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), 55000);
    });

    const result = await Promise.race([uploadPromise, timeoutPromise]);

    return NextResponse.json({
      message: "Upload successful",
      url: result.secure_url,
      public_id: result.public_id,
    });

  } catch (error) {
    console.error("Upload error:", error);
    
    // Handle specific timeout errors
    if (error.message?.includes('timeout') || error.message?.includes('Timeout') || error.http_code === 499) {
      return NextResponse.json({
        error: "Upload timeout. Please try again or check your internet connection."
      }, { status: 408 }); // Request Timeout status
    }

    return NextResponse.json({
      error: error.message || "Upload failed"
    }, { status: 500 });
  }
}

// Alternative approach using direct upload with base64
export async function uploadWithBase64(file) {
  try {
    // Convert to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;

    // Upload using base64 string (sometimes more reliable)
    const result = await cloudinary.uploader.upload(base64, {
      folder: "events",
      transformation: [
        { width: 600, height: 600, crop: "limit" },
        { quality: "auto:low" },
        { fetch_format: "auto" }
      ],
      timeout: 60000,
    });

    return result;
  } catch (error) {
    throw error;
  }
}

// Handle GET request to check API status
export async function GET() {
  return NextResponse.json({ 
    message: "Upload API is working",
    timestamp: new Date().toISOString(),
    cloudinary_config: {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? "configured" : "missing",
      api_key: process.env.CLOUDINARY_API_KEY ? "configured" : "missing",
      api_secret: process.env.CLOUDINARY_API_SECRET ? "configured" : "missing",
    }
  });
}