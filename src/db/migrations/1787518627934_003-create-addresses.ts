import type { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable("addresses", {
        id: {
            type: "uuid",
            primaryKey: true,
            default: pgm.func("gen_random_uuid()"),
        },

        address_1: {
            type: "varchar(100)",
            notNull: true,
        },

        address_2: {
            type: "varchar(100)",
        },

        address_3: {
            type: "varchar(100)",
        },

        city: {
            type: "varchar(100)",
            notNull: true,
        },

        town: {
            type: "varchar(100)",
        },

        postcode: {
            type: "varchar(20)",
            notNull: true,
        },

        country: {
            type: "varchar(100)",
            notNull: true,
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

    pgm.createTrigger("addresses", "set_timestamp", {
        when: "BEFORE",
        operation: "UPDATE",
        level: "ROW",
        function: "trigger_set_timestamp",
    });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropTable("addresses");
}
