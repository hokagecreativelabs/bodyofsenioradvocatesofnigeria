import dbConnect from "@/lib/mongoose";
import Announcement from "@/models/Announcement";

export async function GET(req, { params }) {
  await dbConnect();

  try {
    const announcement = await Announcement.findById(params.id);
    if (!announcement) {
      return new Response(JSON.stringify({ success: false, message: "announcement not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ success: true, data: announcement }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500 });
  }
}

export async function PUT(req, { params }) {
  await dbConnect();

  try {
    const { id } = await params

    const body = await req.json();
    const { title, date, time, status, description } = body;

    const updatedAnnouncement = await Announcement.findByIdAndUpdate(
      id,
      { title, date, time, status, description },
      { new: true, runValidators: true }
    );

    if (!updatedAnnouncement) {
      return new Response(JSON.stringify({ success: false, message: "Announcement not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ success: true, data: updatedAnnouncement }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  await dbConnect();

  try {
    const { id } = await params

    const deletedAnnouncement = await Announcement.findByIdAndDelete(id);

    if (!deletedAnnouncement) {
      return new Response(JSON.stringify({ success: false, message: "Announcement not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ success: true, data: deletedAnnouncement }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500 });
  }
}
