import type { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable("menu_item_sections", {
        id: {
            type: "uuid",
            primaryKey: true,
            default: pgm.func("gen_random_uuid()"),
        },

        restaurant_id: {
            type: "uuid",
            notNull: true,
            references: "restaurants(id)",
            onDelete: "CASCADE",
            onUpdate: "NO ACTION",
        },

        menu_item_id: {
            type: "uuid",
            notNull: true,
            references: "menu_items(id)",
            onDelete: "CASCADE",
            onUpdate: "NO ACTION",
        },

        name: {
            type: "varchar(25)",
        },
        
        required: {
            type: "boolean",
            notNull: true,
        },
        
        multiple: {
            type: "boolean",
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

    pgm.createTrigger("menu_item_sections", "set_timestamp", {
        when: "BEFORE",
        operation: "UPDATE",
        level: "ROW",
        function: "trigger_set_timestamp",
    });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropTable("menu_item_sections");
}
