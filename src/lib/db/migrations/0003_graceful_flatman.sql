DROP INDEX "classrooms_wali_kelas_unique";--> statement-breakpoint
DROP INDEX "teachers_nip_unique";--> statement-breakpoint
DROP INDEX "users_phone_number_unique";--> statement-breakpoint
ALTER TABLE `finances` ALTER COLUMN "date" TO "date" integer NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `classrooms_wali_kelas_unique` ON `classrooms` (`wali_kelas`);--> statement-breakpoint
CREATE UNIQUE INDEX `teachers_nip_unique` ON `teachers` (`nip`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_phone_number_unique` ON `users` (`phone_number`);