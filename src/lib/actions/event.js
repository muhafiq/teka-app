"use server";

import { auth } from "@/auth";
import { db } from "../db";
import { eventImages, events } from "../db/schema";
import { role } from "@/helpers/schema";
import { redirect } from "next/navigation";
import { uploadToCloudinary } from "../cloudinary";

export async function createEvent(prevState, formData) {
  try {
    const { user } = await auth();
    if (!user || user.role === role.parent) {
      throw Error("Unauthorized.");
    }

    const data = Object.fromEntries(formData);
    const [newEvent] = await db
      .insert(events)
      .values({
        eventName: data.eventName,
        description: data.description,
        date: data.date,
        type: data.type,
        createdBy: user.id,
      })
      .returning({ id: events.id });

    const image = formData.get("image");
    const imageUrl = await uploadToCloudinary(image, "events");

    await db.insert(eventImages).values({
      eventId: newEvent.id,
      imageUrl,
    });
  } catch (error) {
    console.error(error);
    return "Gagal membuat kegiatan, silahkan coba kembali!";
  }
  return redirect("/dashboard/events?success=1");
}
