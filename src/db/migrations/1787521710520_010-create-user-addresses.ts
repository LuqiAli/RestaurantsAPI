import type { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable("user_addresses", {
        id: {
            type: "uuid",
            primaryKey: true,
            default: pgm.func("gen_random_uuid()"),
        },

        user_id: {
            type: "uuid",
            notNull: true,
            references: "users(id)",
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

        type: {
            type: "user_addresses_type",
            notNull: true,
        },

        is_primary: {
            type: "boolean",
            default: false,
        },
    });
    
    pgm.createIndex(
        "user_addresses",
        ["user_id", "type"],
        {
            unique: true,
            where: "is_primary = true",
            name: "user_addresses_one_primary_per_type_idx",
        }
    );
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropTable("user_addresses");
}
