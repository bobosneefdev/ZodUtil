import z from "zod"

export class ZodEnv<T extends ZodEnvOptions> {
    readonly options: T;
    private cache: Record<string, any>;

    constructor(
        options: T,
        inject?: ZodEnvInjection<T>,
    ) {
        if (inject) this.inject(inject);
        this.options = options;
        this.cache = {};

        for (const [key, definition] of Object.entries(this.options.definitions)) {
            if (definition.type === "parseAtStartup") {
                const value = this.parseValue(key);
                this.cache[key] = value;
            }
        }
    }

    get<K extends keyof T["definitions"] & string>(
        key: K,
        options?: { bypassCache?: boolean }
    ): z.infer<T["definitions"][K]["schema"]> {
        if (!options?.bypassCache && this.cache[key]) {
            return this.cache[key];
        }
        const value = this.parseValue(key);
        this.cache[key] = value;
        return value;
    }

    private inject(inject: ZodEnvInjection<T>) {
        for (const [key, value] of Object.entries(inject)) {
            if (value === undefined) continue;
            const str = String(value);
            process.env[key] = str;
        }
    }

    private parseValue<K extends keyof T["definitions"] & string>(key: K): z.infer<T["definitions"][K]["schema"]> {
        const definition = this.options.definitions[key];
        const value = process.env[key] ?? definition.defaultValue;
        const parse = definition.schema.safeParse(value);
        if (!parse.success) {
            throw new Error(`Failed to parse environment variable "${key}": ${JSON.stringify(parse.error.issues, null, 2)}`);
        }
        return parse.data as z.infer<T["definitions"][K]["schema"]>;
    }
}

export type ZodEnvInjection<T extends ZodEnvOptions> = {
    [K in keyof T["definitions"] & string]?: z.infer<T["definitions"][K]["schema"]>;
};

export type ZodEnvOptions = {
    definitions: Record<string, ZodEnvDefinition>,
}

export type PossibleZodPipe<T extends z.ZodType> = T | z.ZodPipe<T>;

export type ZodEnvValueSchemaBase =
    z.ZodType<string> |
    PossibleZodPipe<z.ZodCoercedNumber<string>> |
    PossibleZodPipe<z.ZodCoercedBoolean<string>> |
    z.coerce.ZodCoercedDate<string>;

export type ZodEnvValueSchema =
    ZodEnvValueSchemaBase |
    z.ZodOptional<ZodEnvValueSchemaBase> |
    z.ZodDefault<ZodEnvValueSchemaBase>;

export type ZodEnvDefinition<T extends ZodEnvValueSchema = ZodEnvValueSchema> = {
    schema: T,
    type: "parseAtStartup" | "parseOnUsage",
    defaultValue?: NonNullable<z.infer<T>>,
}