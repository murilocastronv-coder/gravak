"use strict";

const { pgSchema, serial, varchar, text, timestamp, uniqueIndex } = require("drizzle-orm/pg-core");

/**
 * Keep Gravak's account data isolated from existing applications sharing
 * the Forge PostgreSQL instance. Never create or alter public.accounts.
 */
const gravakSchema = pgSchema("gravak_test");

const accounts = gravakSchema.table(
    "accounts",
    {
        id: serial("id").primaryKey(),
        account: varchar("account", { length: 32 }).notNull(),
        hash: varchar("hash", { length: 60 }).notNull(),
        name: varchar("name", { length: 32 }).notNull(),
        character: text("character").notNull(),
        createdAt: timestamp("created_at").defaultNow(),
        updatedAt: timestamp("updated_at").defaultNow(),
    },
    (table) => ({
        accountNameUnique: uniqueIndex("account_name_unique").on(table.account, table.name),
    })
);

module.exports = { accounts };
