import type { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable("orders", {
        id: {
            type: "uuid",
            primaryKey: true,
            default: pgm.func("gen_random_uuid()"),
        },

        restaurant_id: {
            type: "uuid",
            references: "restaurants(id)",
            onDelete: "SET NULL",
            onUpdate: "NO ACTION",
        },

        user_id: {
            type: "uuid",
            references: "users(id)",
            onDelete: "SET NULL",
            onUpdate: "NO ACTION",
        },

        is_delivery: {
            type: "boolean",
            notNull: true,
        },

        status: {
            type: "order_status",
            notNull: true,
            default: pgm.func("'processing'::order_status"),
        },
        
        total_amount: {
            type: "numeric(10,2)",
            notNull: true,
        },
        
        name: {
            type: "varchar(100)",
            notNull: true,
        },
        
        phone: {
            type: "varchar(30)",
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

    pgm.createTrigger("orders", "set_timestamp", {
        when: "BEFORE",
        operation: "UPDATE",
        level: "ROW",
        function: "trigger_set_timestamp",
    });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropTable("orders");
}
