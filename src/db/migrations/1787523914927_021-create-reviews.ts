import type { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable("reviews", {
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

        user_id: {
            type: "uuid",
            notNull: true,
            references: "users(id)",
            onDelete: "CASCADE",
            onUpdate: "NO ACTION",
        },

        rating: {
            type: "integer",
            notNull: true,
        },

        review: {
            type: "varchar(750)",
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

    pgm.addConstraint("reviews", "reviews_rating_check", {
        check: "rating >= 1 AND rating <= 5",
    });

    pgm.createIndex("reviews", ["restaurant_id", "user_id"], {
        unique: true,
        name: "reviews_restaurant_user_idx",
    });

    pgm.createTrigger("reviews", "set_timestamp", {
        when: "BEFORE",
        operation: "UPDATE",
        level: "ROW",
        function: "trigger_set_timestamp",
    });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropTable("reviews");
}
