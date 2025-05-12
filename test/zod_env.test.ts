import { ZodEnv } from "../src/classes/zod_env";
import { z } from "zod";

describe("ZodEnv", () => {
    const env = new ZodEnv({
        BOOLEAN_TEST: z.boolean(),
        STRING_TEST: z.string(),
        ENUM_TEST: z.enum(["a", "b", "c"]),
        OPTIONAL_TEST: z.boolean().optional(),
        DEFAULT_TEST: z.string().default("defaultstring"),
    });

    it("Verify environment variables", () => {
        expect(env.get("BOOLEAN_TEST")).toBe(true);
        expect(env.get("STRING_TEST")).toBe("justastring");
        expect(env.get("ENUM_TEST")).toBe("a");
        expect(env.get("OPTIONAL_TEST")).toBe(undefined);
        expect(env.get("DEFAULT_TEST")).toBe("defaultstring");
    });
});

