import type { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable("notifications", {
        id: {
            type: "uuid",
            primaryKey: true,
            default: pgm.func("gen_random_uuid()"),
        },

        user_id: {
            type: "uuid",
            notNull: true,
            references: "users(id)",
            onDelete: "CASCADE",
            onUpdate: "NO ACTION",
        },

        type: {
            type: "notification_type",
        },

        description: {
            type: "varchar(255)",
        },

        link: {
            type: "varchar(75)",
        },

        created_at: {
            type: "timestamptz",
            notNull: true,
            default: pgm.func("now()"),
        },

        updated_at: {
            type: "timestamptz",
            notNull: true,
            default: pgm.func("now()"),
        },

        is_read: {
            type: "boolean",
            default: false,
        },
    });

    pgm.createTrigger("notifications", "set_timestamp", {
        when: "BEFORE",
        operation: "UPDATE",
        level: "ROW",
        function: "trigger_set_timestamp",
    });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropTable("email_verification_tokens");
}
