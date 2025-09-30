import { ZodEnv } from "../src/classes/zod_env";
import { z } from "zod";

describe("ZodEnv", () => {
    const env = new ZodEnv({
        definitions: {
            BOOLEAN_TEST: {
                schema: z.coerce.boolean<string>(),
                type: "parseOnUsage"
            },
            STRING_TEST: {
                schema: z.string(),
                type: "parseOnUsage"
            },
            ENUM_TEST: {
                schema: z.enum(["a", "b", "c"]),
                type: "parseOnUsage"
            },
            OPTIONAL_TEST: {
                schema: z.coerce.boolean<string>().optional(),
                type: "parseOnUsage"
            },
            DEFAULT_TEST: {
                schema: z.string().default("defaultstring"),
                type: "parseAtStartup"
            },
        }
    });

    it("Verify environment variables", () => {
        expect(env.get("BOOLEAN_TEST")).toBe(true);
        expect(env.get("STRING_TEST")).toBe("justastring");
        expect(env.get("ENUM_TEST")).toBe("a");
        expect(env.get("OPTIONAL_TEST")).toBe(undefined);
        expect(env.get("DEFAULT_TEST")).toBe("defaultstring");
    });
});

