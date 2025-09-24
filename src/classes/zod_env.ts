import z from "zod"
import { ZodPossiblyDefault, ZodPossiblyOptional, ZodStringLike } from "../types"
import env from "dotenv";

export class ZodEnv<T extends ZodEnvOptions> {
    readonly options: T;
    private cache: Record<string, any>;

    constructor(options: T) {
        this.options = options;
        this.cache = {};

        for (const [key, definition] of Object.entries(this.options.definitions)) {
            if (definition.type === "parseAtStartup") {
                const value = this.parseValue(key);
                this.cache[key] = value;
            }
        }
    }

    get<K extends keyof T["definitions"] & string>(key: K, options?: { bypassCache?: boolean }) {
        if (!options?.bypassCache && this.cache[key]) {
            return this.cache[key];
        }
        const value = this.parseValue(key);
        this.cache[key] = value;
        return value;
    }

    private parseValue(key: keyof T["definitions"] & string) {
        const definition = this.options.definitions[key];
        const value = process.env[key] ?? definition.defaultValue;
        const parse = definition.schema.safeParse(value);
        if (!parse.success) {
            throw new Error(`Failed to parse environment variable "${key}": ${parse.error.issues}`);
        }
        return parse.data;
    }
}

export type ZodEnvOptions = {
    definitions: Record<string, ZodEnvDefinition>,
}

export type ZodEnvDefinitionDefault = ZodPossiblyDefault<ZodStringLike> | ZodPossiblyOptional<ZodStringLike>;

export type ZodEnvDefinition<T extends ZodEnvDefinitionDefault = ZodEnvDefinitionDefault> = {
    schema: T,
    type: "parseAtStartup" | "parseOnUsage",
    defaultValue?: NonNullable<z.infer<T>>,
}