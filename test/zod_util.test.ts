import { z } from "zod";
import { ZodUtil } from "../src/classes/zod_util";

describe("ZodUtil", () => {
    const uniqueArraySchema = ZodUtil.uniqueArray(z.array(z.enum(["a", "b", "c"])));
    
    it(
        "Successfully parse a truly unique array.",
        () => {
            const goodData = ["a", "b", "c"];
            const goodParse = uniqueArraySchema.safeParse(goodData);
            expect(goodParse.success).toBe(true);
        }
    );

    it(
        "Fail to parse an array with duplicate values.",
        () => {
            const badData = ["a", "b", "c", "a"];
            const badParse = uniqueArraySchema.safeParse(badData);
            expect(badParse.success).toBe(false);
        }
    );
});