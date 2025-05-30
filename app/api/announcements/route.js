import dbConnect from "@/lib/mongoose";
import Announcement from "@/models/Announcement";

export async function GET() {
  await dbConnect();

  try {
    const announcements = await Announcement.find({});
    return new Response(JSON.stringify({ 
        success: true, 
        data: announcements }), { 
      status: 200 
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
        success: false, 
        message: error.message }), { 
            status: 500 
        });
  }
}

export async function POST(req) {
  await dbConnect();

  try {
    const body = await req.json();
    const { title, date, time, status, description } = body;

    if (!title || !date || !time || !status || !description) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: "Missing required fields" }), { 
        status: 400 
        });
    }

    const announcement = new Announcement({ 
      title, 
      date, 
      time, 
      status, 
      description: description.trim(), 
    });

    await announcement.save();

    return new Response(JSON.stringify({ 
        success: true, 
        data: announcement }), { 
            status: 201 
        });
  } catch (error) {
    return new Response(JSON.stringify({ 
        success: false, 
        message: error.message }), { 
            status: 500 
        });
  }
}