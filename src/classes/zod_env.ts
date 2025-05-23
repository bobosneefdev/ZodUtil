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

export type ZodEnvSchemaConfigRecord = Record<string, ZodEnvSchemaConfig>;

export class ZodEnv<T extends ZodEnvSchemaConfigRecord> {
    readonly configRecord: T;
    private readonly cache: Record<string, any>;

    constructor(configRecord: T) {
        this.configRecord = configRecord;
        this.cache = {};

        const errorStrs: string[] = [];
        for (const [key, config] of Object.entries(this.configRecord)) {
            if (config.type === "throwOnUsage") {
                continue;
            }
            const errorStr = this.addValueToCache(key);
            if (errorStr) {
                errorStrs.push(errorStr);
            }
        }
        if (errorStrs.length > 0) {
            throw new Error(errorStrs.join("\n\n"));
        }
    }

    /** Returns an error string if one exists, null on success. */
    private addValueToCache(key: keyof T & string) {
        const unwrappedSchema = ZodUtil.unwrapSchema(this.configRecord[key].schema);
        let value: string | number | boolean | undefined = process.env[key];
        if (ZodUtil.isSchemaOfType(unwrappedSchema, z.ZodFirstPartyTypeKind.ZodBoolean)) {
            value = this.convertBoolean(value);
        }
        else if (ZodUtil.isSchemaOfType(unwrappedSchema, z.ZodFirstPartyTypeKind.ZodNumber)) {
            value = this.convertNumber(value);
        }
        const safeParsed = this.configRecord[key].schema.safeParse(value);
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

    get<K extends keyof T & string>(key: K): z.infer<T[K]["schema"]> {
        if (!this.cache[key]) {
            const errorStr = this.addValueToCache(key);
            if (errorStr) {
                throw new Error(errorStr);
            }
        }
        return this.cache[key];
    }
}