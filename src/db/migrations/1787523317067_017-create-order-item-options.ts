import type { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable("order_item_options", {
        id: {
            type: "uuid",
            primaryKey: true,
            default: pgm.func("gen_random_uuid()"),
        },

        order_id: {
            type: "uuid",
            notNull: true,
            references: "orders(id)",
            onDelete: "SET NULL",
            onUpdate: "NO ACTION",
        },

        item_option_id: {
            type: "uuid",
            notNull: true,
        },

        item_option_name: {
            type: "varchar(100)",
            notNull: true,
        },

        item_option_price: {
            type: "numeric(10,2)",
            notNull: true,
        },

        order_item_id: {
            type: "uuid",
            notNull: true,
            references: "order_items(id)",
            onDelete: "SET NULL",
            onUpdate: "NO ACTION",
        },
    });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropTable("order_item_options");
}
