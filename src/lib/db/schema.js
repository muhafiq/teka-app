import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql, relations } from "drizzle-orm";

/** timestamp helper */
const timestamps = {
  createdAt: text("created_at")
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updateAt: integer("updated_at", { mode: "timestamp" }).$onUpdate(
    () => new Date()
  ),
};

/** schema database */
export const users = sqliteTable("users", {
  id: text("id")
    .primaryKey()
    .$default(() => crypto.randomUUID()),
  name: text("name").notNull(),
  role: text("role").notNull(), // enum: admin, teacher, parent
  phoneNumber: text("phone_number").notNull().unique(),
  password: text("password").notNull(),
  ...timestamps,
});

export const teachers = sqliteTable("teachers", {
  id: text("id")
    .primaryKey()
    .$default(() => crypto.randomUUID()),
  nip: text("nip").notNull().unique(),
  gender: text("gender").notNull(),
  religion: text("religion").notNull(),
  address: text("address").notNull(),
  joinedDate: integer("joined_date", { mode: "timestamp" }).notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  ...timestamps,
});

export const parents = sqliteTable("parents", {
  id: text("id")
    .primaryKey()
    .$default(() => crypto.randomUUID()),
  isWali: integer("is_wali", { mode: "boolean" })
    .notNull()
    .default(sql`0`),
  income: integer("income").notNull(),
  job: text("job").notNull(),
  religion: text("religion"),
  address: text("address").notNull(),
  gender: text("gender").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  ...timestamps,
});

export const students = sqliteTable("students", {
  id: text("id")
    .primaryKey()
    .$default(() => crypto.randomUUID()),
  name: text("name").notNull(),
  gender: text("gender").notNull(),
  religion: text("religion").notNull(),
  address: text("address").notNull(),
  kartuKeluarga: text("kartu_keluarga").notNull(),
  aktaKelahiran: text("akta_kelahiran").notNull(),
  spesificDesease: text("spesific_desease"),
  birthDate: text("birth_date").notNull(),
  birthPlace: text("birth_place").notNull(),
  nation: text("nation").notNull(),
  parentId: text("parent_id")
    .notNull()
    .references(() => parents.id),
  classroomId: text("classroom_id")
    .notNull()
    .references(() => classrooms.id),
  disabled: text("disabled", { mode: "boolean" })
    .notNull()
    .default(sql`0`),
  ...timestamps,
});

export const classrooms = sqliteTable("classrooms", {
  id: text("id")
    .primaryKey()
    .$default(() => crypto.randomUUID()),
  capacity: integer("capacity").notNull(),
  location: text("location").notNull(),
  type: text("type").notNull(),
  waliKelas: text("wali_kelas")
    .references(() => teachers.id)
    .unique(),
  ...timestamps,
});

export const events = sqliteTable("events", {
  id: text("id")
    .primaryKey()
    .$default(() => crypto.randomUUID()),
  eventName: text("event_name").notNull(),
  description: text("description"),
  date: text("date").notNull(),
  type: text("type").notNull(),
  createdBy: text("created_by")
    .notNull()
    .references(() => users.id),
  ...timestamps,
});

export const eventImages = sqliteTable("event_images", {
  id: text("id")
    .primaryKey()
    .$default(() => crypto.randomUUID()),
  eventId: text("event_id")
    .notNull()
    .references(() => events.id),
  imageUrl: text("image_url").notNull(),
  ...timestamps,
});

export const finances = sqliteTable("finances", {
  id: text("id")
    .primaryKey()
    .$default(() => crypto.randomUUID()),
  type: text("type").notNull(), // enum: expense, income
  category: text("category").notNull(), // spp, gaji, rekreasi
  description: text("description"),
  amount: integer("amount").notNull(),
  date: text("date").notNull(),
  studentId: text("student_id").references(() => students.id),
  ...timestamps,
});

/** relations helper for query */
export const usersRelations = relations(users, ({ one, many }) => ({
  teacher: one(teachers, {
    fields: [users.id],
    references: [teachers.userId],
  }),
  parent: one(parents, {
    fields: [users.id],
    references: [parents.userId],
  }),
  events: many(events, {
    relationName: "event_creator",
  }),
}));

export const teachersRelations = relations(teachers, ({ one, many }) => ({
  user: one(users, {
    fields: [teachers.userId],
    references: [users.id],
  }),
  classroom: one(classrooms, {
    fields: [teachers.id],
    references: [classrooms.waliKelas],
  }),
}));

export const parentsRelations = relations(parents, ({ one, many }) => ({
  user: one(users, {
    fields: [parents.userId],
    references: [users.id],
  }),
  students: many(students, {
    relationName: "parent_students",
  }),
}));

export const studentsRelations = relations(students, ({ one, many }) => ({
  parent: one(parents, {
    fields: [students.parentId],
    references: [parents.id],
  }),
  classroom: one(classrooms, {
    fields: [students.classroomId],
    references: [classrooms.id],
  }),
  finances: many(finances),
}));

export const classroomsRelations = relations(classrooms, ({ one, many }) => ({
  waliKelas: one(teachers, {
    fields: [classrooms.waliKelas],
    references: [teachers.id],
  }),
  students: many(students),
}));

export const eventsRelations = relations(events, ({ one, many }) => ({
  creator: one(users, {
    fields: [events.createdBy],
    references: [users.id],
  }),
  images: many(eventImages),
}));

export const eventImagesRelations = relations(eventImages, ({ one }) => ({
  event: one(events, {
    fields: [eventImages.eventId],
    references: [events.id],
  }),
}));

export const financesRelations = relations(finances, ({ one }) => ({
  student: one(students, {
    fields: [finances.studentId],
    references: [students.id],
  }),
}));
