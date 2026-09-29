import type { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable("email_verification_tokens", {
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

        token_hash: {
            type: "varchar(100)",
            notNull: true,
        },

        created_at: {
            type: "timestamptz",
            notNull: true,
            default: pgm.func("now()"),
        },

        expires_at: {
            type: "timestamptz",
            notNull: true,
            default: pgm.func("now() + interval '1 hour'"),
        },
    });

    pgm.createIndex("email_verification_tokens", ["token_hash"], {
        unique: true,
        name: "email_verification_tokens_token_hash_idx",
    });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropTable("email_verification_tokens");
}
