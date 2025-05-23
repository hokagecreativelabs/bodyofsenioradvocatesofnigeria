import dbConnect from "@/lib/mongoose";
import Event from "@/models/Event";

export async function GET(req, { params }) {
  await dbConnect();

  try {
    const event = await Event.findById(params.id);
    if (!event) {
      return new Response(JSON.stringify({ success: false, message: "Event not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ success: true, data: event }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500 });
  }
}

export async function PUT(req, { params }) {
  await dbConnect();

  try {
    const body = await req.json();
    const { title, date, time, location, status, description } = body;

    const updatedEvent = await Event.findByIdAndUpdate(
      params.id,
      { title, date, time, location, status, description },
      { new: true, runValidators: true }
    );

    if (!updatedEvent) {
      return new Response(JSON.stringify({ success: false, message: "Event not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ success: true, data: updatedEvent }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  await dbConnect();

  try {
    const deletedEvent = await Event.findByIdAndDelete(params.id);

    if (!deletedEvent) {
      return new Response(JSON.stringify({ success: false, message: "Event not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ success: true, data: deletedEvent }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500 });
  }
}
