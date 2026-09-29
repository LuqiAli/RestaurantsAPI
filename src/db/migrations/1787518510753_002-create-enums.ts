import type { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createType("notification_type", [
        "informational",
        "success",
        "warning",
        "error",
    ]);

    pgm.createType("order_status", [
        "processing",
        "received",
        "preparing",
        "delivery",
        "cancelled",
    ]);

    pgm.createType("tag_type", [
        "cuisine",
        "dishes",
        "dietary",
        "type",
    ]);

    pgm.createType("user_addresses_type", [
        "billing",
        "delivery",
    ]);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropType("user_addresses_type");
    pgm.dropType("tag_type");
    pgm.dropType("order_status");
    pgm.dropType("notification_type");
}
