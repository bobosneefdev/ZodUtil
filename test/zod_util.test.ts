import { z } from "zod";
import { ZodUtil } from "../src/classes/zod_util";

describe(
    "ZodUtil",
    () => {
        const uniqueArraySchema = ZodUtil.uniqueArray(z.array(z.enum(["a", "b", "c"])));
        
        it(
            "Successfully parse a truly unique array.",
            () => {
                const goodData = ["a", "b", "c"];
                const goodParse = uniqueArraySchema.safeParse(goodData);
                expect(goodParse.success).toBe(true);
            }
        )

        it(
            "Fail to parse an array with duplicate values.",
            () => {
                const badData = ["a", "b", "c", "a"];
                const badParse = uniqueArraySchema.safeParse(badData);
                expect(badParse.success).toBe(false);
            }
        )

        enum StrictRecordEnum {
            A = "a",
            B = "b",
            C = "c",
        }
        const strictEnumRecordSchema = ZodUtil.enumRecord(StrictRecordEnum, z.string());

        it(
            "Successfully parse a strict enum record.",
            () => {
                const goodData: Record<StrictRecordEnum, string> = {
                    [StrictRecordEnum.A]: "ayy",
                    [StrictRecordEnum.B]: "bee",
                    [StrictRecordEnum.C]: "see"
                };
                const goodParse = strictEnumRecordSchema.safeParse(goodData);
                expect(goodParse.success).toBe(true);
            }
        )

        it(
            "Fail to parse a strict enum record with missing values.",
            () => {
                const badData: Partial<Record<StrictRecordEnum, string>> = {
                    [StrictRecordEnum.A]: "ayy",
                    [StrictRecordEnum.B]: "bee"
                };
                const badParse = strictEnumRecordSchema.safeParse(badData);
                expect(badParse.success).toBe(false);
            }
        )

        const strictRecordArray = ["a", "b", "c"];
        const arrayRecordSchema = ZodUtil.enumRecord(
            strictRecordArray,
            z.string()
        );

        it(
            "Successfully parse a strict array record.",
            () => {
                const goodData: Record<typeof strictRecordArray[number], string> = {
                    a: "ayy",
                    b: "bee",
                    c: "see"
                };
                const goodParse = arrayRecordSchema.safeParse(goodData);
                expect(goodParse.success).toBe(true);
            }
        )

        it(
            "Fail to parse a strict array record with missing values.",
            () => {
                const badData: Partial<Record<typeof strictRecordArray[number], string>> = {
                    a: "ayy",
                    b: "bee"
                };
                const badParse = arrayRecordSchema.safeParse(badData);
                expect(badParse.success).toBe(false);
            }
        )

        const basicSchema = z.enum(["a", "b", "c"]);
        it(
            "Validate the type of a schema.",
            () => {
                expect(ZodUtil.isSchemaOfType(basicSchema, z.ZodFirstPartyTypeKind.ZodEnum)).toBe(true);
            }
        )

        it(
            "Unwrap a schema and verify it's the expected type.",
            () => {
                const wrappedSchema = z.enum(["a", "b", "c"])
                    .refine((data) => data.length === 1)
                    .default("a");
                const unwrapSchema = ZodUtil.unwrapSchema(wrappedSchema);
                expect(ZodUtil.isSchemaOfType(unwrapSchema, z.ZodFirstPartyTypeKind.ZodEnum)).toBe(true);
            }
        )
    }
)