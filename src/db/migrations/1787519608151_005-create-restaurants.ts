import type { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable("restaurants", {
        id: {
            type: "uuid",
            primaryKey: true,
            default: pgm.func("gen_random_uuid()"),
        },

        name: {
            type: "varchar(100)",
            notNull: true,
            unique: true,
        },

        website: {
            type: "varchar(500)",
            notNull: true,
        },

        phone: {
            type: "bigint",
            notNull: true,
            unique: true,
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
    });

    pgm.createTrigger("restaurants", "set_timestamp", {
        when: "BEFORE",
        operation: "UPDATE",
        level: "ROW",
        function: "trigger_set_timestamp",
    });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropTable("restaurants");
}
