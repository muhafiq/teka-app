CREATE TABLE `attendances` (
    `id` text PRIMARY KEY NOT NULL,
    `student_id` text NOT NULL,
    `date` integer NOT NULL,
    `created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
    `updated_at` integer,
    FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
PRAGMA foreign_keys = OFF;
--> statement-breakpoint
CREATE TABLE `__new_sub_events` (
    `id` text PRIMARY KEY NOT NULL,
    `title` text NOT NULL,
    `description` text,
    `event_id` text NOT NULL,
    `created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
    `updated_at` integer,
    FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO
    `__new_sub_events` (
        "id",
        "title",
        "description",
        "event_id",
        "created_at",
        "updated_at"
    )
SELECT
    "id",
    "title",
    "description",
    "event_id",
    "created_at",
    "updated_at"
FROM `sub_events`;
--> statement-breakpoint
DROP TABLE `sub_events`;
--> statement-breakpoint
ALTER TABLE `__new_sub_events` RENAME TO `sub_events`;
--> statement-breakpoint
PRAGMA foreign_keys = ON;