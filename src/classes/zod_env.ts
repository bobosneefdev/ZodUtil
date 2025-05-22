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

export type ZodEnvSchemaType =
    | "throwOnStartup"
    | "throwOnUsage";

export type ZodEnvSchemaConfig = {
    schema: ZodEnvSchema,
    type: ZodEnvSchemaType
}

export type ZodEnvSchemaRecord = Record<string, ZodEnvSchemaConfig>;

type ZodEnvInferredSchemaRecord<T extends ZodEnvSchemaRecord> = {
    [K in keyof T]: z.infer<T[K]["schema"]>
};

export class ZodEnv<T extends ZodEnvSchemaRecord> {
    readonly schemas: T;
    private readonly cache: Record<string, any>;

    constructor(schemas: T) {
        this.schemas = schemas;
        this.cache = {};

        const errorStrs: string[] = [];
        for (const [key, schema] of Object.entries(schemas)) {
            if (schema.type === "throwOnUsage") {
                continue;
            }
            const errorStr = this.addValueToCache(key, schema);
            if (errorStr) {
                errorStrs.push(errorStr);
            }
        }
        if (errorStrs.length > 0) {
            throw new Error(errorStrs.join("\n\n"));
        }
    }

    private addValueToCache(key: string, config: ZodEnvSchemaConfig) {
        const unwrappedSchema = ZodUtil.unwrapSchema(config.schema);
        let value: string | number | boolean | undefined = process.env[key];
        if (ZodUtil.isSchemaOfType(unwrappedSchema, z.ZodFirstPartyTypeKind.ZodBoolean)) {
            value = this.convertBoolean(value);
        }
        else if (ZodUtil.isSchemaOfType(unwrappedSchema, z.ZodFirstPartyTypeKind.ZodNumber)) {
            value = this.convertNumber(value);
        }
        const safeParsed = config.schema.safeParse(value);
        if (!safeParsed.success) {
            return `Environment variable "${key}" is not set or is invalid: ${safeParsed.error.message}`;
        }
        this.cache[key] = safeParsed.data;
        return null;
    }

    private convertNumber(str?: string) {
        if (str === undefined) {
            return undefined;
        }
        const num = Number(str);
        if (isNaN(num)) {
            return undefined;
        }
        return num;
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

    get<K extends keyof T & string>(key: K): ZodEnvInferredSchemaRecord<T>[K] {
        if (!this.cache[key]) {
            const errorStr = this.addValueToCache(key, this.schemas[key]);
            if (errorStr) {
                throw new Error(errorStr);
            }
        }
        return this.cache[key];
    }
}