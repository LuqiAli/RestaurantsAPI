import type { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable("restaurant_addresses", {
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

        address_id: {
            type: "uuid",
            notNull: true,
            references: "addresses(id)",
            onDelete: "CASCADE",
            onUpdate: "NO ACTION",
        },
    });

    pgm.createIndex(
        "restaurant_addresses",
        ["restaurant_id", "address_id"],
        {
            unique: true,
            name: "restaurant_addresses_restaurant_address_idx",
        }
    );
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropTable("restaurant_addresses");
}
