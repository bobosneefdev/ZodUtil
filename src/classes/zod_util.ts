import { z } from "zod";

export class ZodUtil {
    /** Creates an array schema with preset refinement ensuring all elements are unique. */
    static uniqueArray<T extends z.ZodArray<z.ZodTypeAny>>(arraySchema: T) {
        return arraySchema.refine(
            (array) => {
                const seen = new Set();
                for (const value of array) {
                    if (seen.has(value)) return false;
                    seen.add(value);
                }
                return true;
            },
            "Duplicate values found in unique array."
        );
    }
}