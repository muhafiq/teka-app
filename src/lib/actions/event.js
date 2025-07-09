"use server";

import { db } from "@/lib/db";
import { events, subEvents, eventImages } from "@/lib/db/schema";
import { v4 as uuidv4 } from "uuid";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { deleteFromCloudinary, uploadToCloudinary } from "@/lib/cloudinary";
import { z } from "zod";
import { eq } from "drizzle-orm";

export async function createEvent(prevState, formData) {
  try {
    const eventId = uuidv4();
    const createdBy = formData.get("userId"); // Ganti dengan ID user login sesungguhnya

    // 1. Upload thumbnail utama (opsional)
    // 2. Simpan event utama
    const [newEvent] = await db
      .insert(events)
      .values({
        id: eventId,
        eventName: formData.get("eventName")?.toString() || "",
        description: formData.get("description")?.toString() || "",
        date: formData.get("date")?.toString() || "",
        type: formData.get("type")?.toString() || "",
        createdBy,
      })
      .returning({ id: events.id });

    const mainImage = formData.get("image");
    if (mainImage instanceof File && mainImage.size > 0) {
      const imageUrl = await uploadToCloudinary(mainImage, "events");

      await db.insert(eventImages).values({
        imageUrl,
        eventId,
        // ❌ subEventId tidak dikirim jika tidak ada
      });
    }

    // 3. Loop sub-event (jika ada)
    for (let i = 0; ; i++) {
      const title = formData.get(`sub_title_${i}`);
      const desc = formData.get(`sub_desc_${i}`);
      if (!title && !desc) break;

      const subId = uuidv4();

      // Insert sub-event
      await db.insert(subEvents).values({
        id: subId,
        title: title?.toString() || "",
        description: desc?.toString() || "",
        eventId,
      });

      // Upload gambar sub-event (opsional)
      const images = formData.getAll(`sub_images_${i}`);
      for (const img of images) {
        if (img instanceof File && img.size > 0) {
          const imageUrl = await uploadToCloudinary(img, "events");

          await db.insert(eventImages).values({
            imageUrl,
            eventId,
            subEventId: subId, // ✅ hanya dikirim jika memang ada
          });
        }
      }
    }
  } catch (err) {
    console.error("CREATE EVENT ERROR:", err?.message || err);
    return `Terjadi kesalahan saat menyimpan kegiatan.`;
  }
  // 4. Selesai
  revalidatePath("/dashboard/events");
  redirect("/dashboard/events");
}

export async function deleteEvent(prevState, formData) {
  try {
    const eventId = formData.get("eventId");

    const validated = z.string().min(20).safeParse(eventId);

    if (!validated.success) {
      return {
        success: false,
        message: "ID Kegiatan tidak valid!",
        errors: validated.error.flatten().fieldErrors,
      };
    }

    await db.delete(subEvents).where(eq(subEvents.eventId, validated.data));
    const urls = await db
      .delete(eventImages)
      .where(eq(eventImages.eventId, validated.data))
      .returning({ url: eventImages.imageUrl });
    await db.delete(events).where(eq(events.id, validated.data));

    urls.map(async (url) => {
      await deleteFromCloudinary(url.url);
    });

    return {
      success: true,
      message: "Berhasil menghapus kegiatan",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Terjadi kesalahan saat menghapus kegiatan.",
    };
  }
}
