import type { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable("order_items", {
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

        item_id: {
            type: "uuid",
            notNull: true,
            references: "menu_items(id)",
            onDelete: "RESTRICT",
            onUpdate: "NO ACTION",
        },

        quantity: {
            type: "integer",
            notNull: true,
        },

        item_price: {
            type: "numeric(10,2)",
            notNull: true,
        },

        item_name: {
            type: "varchar(100)",
            notNull: true,
        },
    });

    pgm.addConstraint("order_items", "order_items_quantity_check", {
        check: "quantity > 0",
    });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropTable("order_items");
}
