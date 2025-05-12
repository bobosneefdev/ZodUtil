import { z } from "zod";
import "dotenv/config";
import { ZodUtil } from "./zod_util";

type ZodEnvBaseSchema =
    | z.ZodString
    | z.ZodNumber
    | z.ZodNativeEnum<any>
    | z.ZodEnum<any>
    | z.ZodBoolean;

export type ZodEnvSchema =
    | ZodEnvBaseSchema
    | z.ZodOptional<ZodEnvBaseSchema>
    | z.ZodDefault<ZodEnvBaseSchema>;

export type ZodEnvSchemaRecord = Record<string, ZodEnvSchema>;

type ZodEnvInferredSchemaRecord<T extends ZodEnvSchemaRecord> = {
    [K in keyof T]: z.infer<T[K]>
};

export class ZodEnv<T extends ZodEnvSchemaRecord> {
    readonly schemas: T;
    private readonly values: ZodEnvInferredSchemaRecord<T>;

    constructor(schemas: T) {
        this.schemas = schemas;
        const errors: string[] = [];
        this.values = Object.entries(schemas).reduce(
            (p, [key, schema]) => {
                const unwrappedSchema = ZodUtil.unwrapSchema(schema);
                const isBoolean = ZodUtil.isSchemaOfType(unwrappedSchema, z.ZodFirstPartyTypeKind.ZodBoolean);
                const value = isBoolean ? this.convertBoolean(process.env[key]) : process.env[key];
                const safeParsed = schema.safeParse(value);
                if (!safeParsed.success) {
                    errors.push(`Environment variable "${key}" is not set or is invalid: ${safeParsed.error.message}`);
                }
                p[key] = safeParsed.data;
                return p;
            },
            {} as any
        ) as ZodEnvInferredSchemaRecord<T>;
        if (errors.length > 0) {
            throw new Error(errors.join("\n"));
        }
    }

    private convertBoolean(str?: string) {
        if (str === undefined) {
            return undefined;
        }
        const lower = str?.toLowerCase();
        if (lower === "true") {
            return true;
        }
        else if (lower === "false") {
            return false;
        }
        else {
            return undefined;
        }
    }

    get<K extends keyof T>(key: K): ZodEnvInferredSchemaRecord<T>[K] {
        return this.values[key];
    }
}