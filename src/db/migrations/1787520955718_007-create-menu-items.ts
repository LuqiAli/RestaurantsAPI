import type { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable("menu_items", {
        id: {
            type: "uuid",
            primaryKey: true,
            default: pgm.func("gen_random_uuid()"),
        },

        menu_id: {
            type: "uuid",
            notNull: true,
            references: "menu_sections(id)",
            onDelete: "CASCADE",
            onUpdate: "NO ACTION",
        },

        name: {
            type: "varchar(100)",
            notNull: true,
        },

        description: {
            type: "varchar(255)",
        },

        price: {
            type: "numeric(10,2)",
            notNull: true,
        },
        
        restaurant_id: {
            type: "uuid",
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

    pgm.createTrigger("menu_items", "set_timestamp", {
        when: "BEFORE",
        operation: "UPDATE",
        level: "ROW",
        function: "trigger_set_timestamp",
    });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropTable("menu_items");
}
