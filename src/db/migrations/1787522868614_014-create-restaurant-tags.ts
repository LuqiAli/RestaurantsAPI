import type { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable("restaurant_tags", {
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

        tag_id: {
            type: "uuid",
            notNull: true,
            references: "tags(id)",
            onDelete: "CASCADE",
            onUpdate: "NO ACTION",
        },

        created_at: {
            type: "timestamptz",
            notNull: true,
            default: pgm.func("now()"),
        },
    });

    // Prevent the same tag from being attached to the same restaurant twice.
    pgm.createIndex(
        "restaurant_tags",
        ["restaurant_id", "tag_id"],
        {
            unique: true,
            name: "restaurant_tags_restaurant_tag_idx",
        }
    );
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropTable("restaurant_tags");
}
