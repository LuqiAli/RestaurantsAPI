import type { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable("session", {
        sid: {
            type: "varchar",
            primaryKey: true,
            notNull: true,
        },

        sess: {
            type: "json",
            notNull: true,
        },

        expire: {
            type: "timestamptz(6)",
            notNull: true,
        },
    });

    pgm.createIndex("session", ["expire"], {
        name: "IDX_session_expire",
    });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropTable("session");
}
