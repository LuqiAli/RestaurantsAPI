import type { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable("users", {
        id: {
            type: "uuid",
            primaryKey: true,
            default: pgm.func("gen_random_uuid()"),
        },

        name: {
            type: "varchar(100)",
            notNull: true,
            unique: true,
        },

        password: {
            type: "varchar(255)",
            notNull: true,
        },

        email: {
            type: "varchar(255)",
            notNull: true,
        },
        
        phone: {
            type: "varchar(30)",
            notNull: true,
        },
        
        roles: {
            type: "varchar(100)[]",
            default: pgm.func("ARRAY['USER']::varchar(100)[]"),
        },
        
        email_verified: {
            type: "boolean",
            notNull: true,
            default: false,
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

    pgm.createTrigger("users", "set_timestamp", {
        when: "BEFORE",
        operation: "UPDATE",
        level: "ROW",
        function: "trigger_set_timestamp",
    });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropTable("users");
}
