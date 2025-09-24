import z from "zod";

export type ZodStringLike =
    z.ZodString |
    z.ZodEnum<Record<string, string>> |
    z.ZodLiteral<string> |
    z.coerce.ZodCoercedNumber |
    z.coerce.ZodCoercedBoolean;

export type ZodPossiblyOptional<T extends z.ZodType> = T | z.ZodOptional<T>;

export type ZodPossiblyDefault<T extends z.ZodType> = T | z.ZodDefault<T>;