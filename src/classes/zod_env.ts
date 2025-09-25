import z from "zod"
import env from "dotenv";
env.config();

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

export type ZodEnvValueSchemaBase =
    z.ZodString |
    z.ZodNumber |
    z.ZodEnum<Record<any, string | number>> |
    z.ZodLiteral<string | number> |
    z.coerce.ZodCoercedBoolean |
    z.coerce.ZodCoercedNumber;

export type ZodEnvValueSchema =
    ZodEnvValueSchemaBase |
    z.ZodOptional<ZodEnvValueSchemaBase> |
    z.ZodDefault<ZodEnvValueSchemaBase>;

export type ZodEnvDefinition<T extends ZodEnvValueSchema = ZodEnvValueSchema> = {
    schema: T,
    type: "parseAtStartup" | "parseOnUsage",
    defaultValue?: NonNullable<z.infer<T>>,
}