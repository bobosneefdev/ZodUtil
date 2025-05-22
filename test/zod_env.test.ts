import { ZodEnv } from "../src/classes/zod_env";
import { z } from "zod";

describe("ZodEnv", () => {
    const env = new ZodEnv({
        BOOLEAN_TEST: {
            schema: z.boolean(),
            type: "throwOnUsage"
        },
        STRING_TEST: {
            schema: z.string(),
            type: "throwOnUsage"
        },
        ENUM_TEST: {
            schema: z.enum(["a", "b", "c"]),
            type: "throwOnUsage"
        },
        OPTIONAL_TEST: {
            schema: z.boolean().optional(),
            type: "throwOnUsage"
        },
        DEFAULT_TEST: {
            schema: z.string().default("defaultstring"),
            type: "throwOnStartup"
        },
    });

    it("Verify environment variables", () => {
        expect(env.get("BOOLEAN_TEST")).toBe(true);
        expect(env.get("STRING_TEST")).toBe("justastring");
        expect(env.get("ENUM_TEST")).toBe("a");
        expect(env.get("OPTIONAL_TEST")).toBe(undefined);
        expect(env.get("DEFAULT_TEST")).toBe("defaultstring");
    });
});

