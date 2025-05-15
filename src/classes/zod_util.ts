import { z } from "zod";
import { ZodFirstPartyTypeMap } from "../types";

export class ZodUtil {
    /**
     * Create a Zod object where all values of an enum or string union are required.
     * @param keys - The keys of the object, pass array of strings, or an enum.
     * @param value - The value schema of the object.
     * */
    static enumRecord<
        T extends string,
        V extends z.ZodType
    >(
        keys: Record<string, T> | Array<T>,
        value: V
    ): z.ZodObject<{ [K in T]: V }> {
        let keyArray: Array<T>;
        if (Array.isArray(keys)) {
            keyArray = keys;
        }
        else {
            keyArray = Object.values(keys);
        }
        return z.object(
            Object.fromEntries(
                keyArray.map((key) => [key, value])
            ) as { [K in T]: V }
        );
    }

    /** Creates an array schema with preset refinement ensuring all elements are unique. */
    static uniqueArray<T extends z.ZodArray<z.ZodTypeAny>>(arraySchema: T) {
        return arraySchema.refine(
            this.refineUniqueArray,
            "Duplicate values found in unique array.",
        ) as z.ZodEffects<T>;
    }

    /** Refines an array schema to be unique. */
    private static refineUniqueArray<T>(array: Array<T>) {
        const seen = new Set<T>();
        for (const item of array) {
            if (seen.has(item)) {
                return false;
            }
            seen.add(item);
        }
        return true;
    }

    /** Unwraps a schema to its base type. */
    static unwrapSchema(schema: z.ZodTypeAny) {
        let result = schema;
        while (true) {
            if (
                result._def.typeName === z.ZodFirstPartyTypeKind.ZodOptional ||
                result._def.typeName === z.ZodFirstPartyTypeKind.ZodNullable ||
                result._def.typeName === z.ZodFirstPartyTypeKind.ZodDefault
            ) {
                result = result._def.innerType;
            }
            else if (result._def.typeName === z.ZodFirstPartyTypeKind.ZodEffects) {
                result = result._def.schema;
            }
            else {
                break;
            }
        }
        return result;
    }

    /** @returns boolean of whether the provided schema is of a given type. */
    static isSchemaOfType<K extends z.ZodFirstPartyTypeKind>(
        schema: z.ZodTypeAny,
        type: K
    ): schema is ZodFirstPartyTypeMap[K] {
        return schema._def.typeName === type;
    }
}