"use client";

import { useActionState, useState } from "react";
import { createEvent } from "@/lib/actions/event";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function CreateEventForm({userId}) {
  const [error, formAction, isPending] = useActionState(createEvent, undefined);
  const [subEvents, setSubEvents] = useState([
    { title: "", description: "", images: [] },
  ]);

  const removeSubEvent = (index) => {
    const updated = subEvents.filter((_, i) => i !== index);
    setSubEvents(updated);
  };

  const handleSubEventChange = (index, field, value) => {
    const updated = [...subEvents];
    updated[index][field] = value;
    setSubEvents(updated);
  };

  const handleFileChange = (index, files) => {
    const updated = [...subEvents];
    updated[index].images = files;
    setSubEvents(updated);
  };

  const addSubEvent = () => {
    setSubEvents([...subEvents, { title: "", description: "", images: [] }]);
  };

  return (
    <form action={formAction} className="max-w-2xl mx-auto py-8 px-4 space-y-6" encType="multipart/form-data">
      <input type="hidden" name="userId" value={userId} />
      <div>
        <h2 className="text-2xl font-bold">Tambah Kegiatan</h2>
        <p className="text-muted-foreground text-sm">
          Isikan informasi kegiatan sekolah di bawah ini.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="eventName">Nama Kegiatan</Label>
        <Input id="eventName" name="eventName" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">Tanggal Kegiatan</Label>
        <Input id="date" name="date" type="date" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Jenis Kegiatan</Label>
        <Select name="type" required>
          <SelectTrigger>
            <SelectValue placeholder="Pilih jenis kegiatan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="class">Kegiatan Kelas</SelectItem>
            <SelectItem value="school">Kegiatan Sekolah</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Deskripsi</Label>
        <Textarea id="description" name="description" rows={4} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Thumbnail Kegiatan</Label>
        <Input id="image" name="image" type="file" accept="image/*" />
      </div>

      <hr />

      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Sub-Kegiatan</h3>
        {subEvents.map((sub, i) => (
          <div key={i} className="border p-4 rounded-md space-y-3 bg-muted/30 relative">
            {/* Tombol Hapus */}
            {subEvents.length > 1 && (
              <button
                type="button"
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm"
                onClick={() => removeSubEvent(i)}
              >
                Hapus
              </button>
            )}

            <div>
              <Label>Judul Sub-Kegiatan</Label>
              <Input
                name={`sub_title_${i}`}
                value={sub.title}
                onChange={(e) => handleSubEventChange(i, "title", e.target.value)}
              />
            </div>
            <div>
              <Label>Deskripsi Sub-Kegiatan</Label>
              <Textarea
                name={`sub_desc_${i}`}
                rows={3}
                value={sub.description}
                onChange={(e) => handleSubEventChange(i, "description", e.target.value)}
              />
            </div>
            <div>
              <Label>Gambar Sub-Kegiatan</Label>
              <Input
                name={`sub_images_${i}`}
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleFileChange(i, e.target.files)}
              />
            </div>
          </div>
        ))}

        <Button type="button" variant="outline" onClick={addSubEvent}>
          + Tambah Sub-Kegiatan
        </Button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button type="submit" disabled={isPending}>
        {isPending ? "Menyimpan..." : "Simpan"}
      </Button>
    </form>
  );
}