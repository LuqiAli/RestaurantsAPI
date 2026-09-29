import type { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable("order_addresses", {
        id: {
            type: "uuid",
            primaryKey: true,
            default: pgm.func("gen_random_uuid()"),
        },

        order_id: {
            type: "uuid",
            notNull: true,
            references: "orders(id)",
            onDelete: "CASCADE",
            onUpdate: "NO ACTION",
        },

        address_1: {
            type: "varchar(50)",
            notNull: true,
        },

        address_2: {
            type: "varchar(50)",
        },

        address_3: {
            type: "varchar(50)",
        },

        city: {
            type: "varchar(50)",
            notNull: true,
        },

        town: {
            type: "varchar(50)",
        },

        postcode: {
            type: "varchar(10)",
            notNull: true,
        },

        country: {
            type: "varchar(50)",
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

    pgm.createTrigger("order_addresses", "set_timestamp", {
        when: "BEFORE",
        operation: "UPDATE",
        level: "ROW",
        function: "trigger_set_timestamp",
    });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropTable("order_addresses");
}

