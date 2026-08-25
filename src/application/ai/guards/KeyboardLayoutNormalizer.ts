/**
 * Converts Persian text typed on English keyboard layout to actual Persian.
 *
 * Example: "sghl" → "سلام", "خوشحالم" stays as-is
 *
 * Persian keyboard layout mapping (English → Persian):
 * q→ض w→ص e→ث r→ق t→ف y→غ u→ع i→ه o→خ p→ح
 * a→ش s→س d→ی f→ب g→ل h→ا j→ت k→ن l→م ;→ک '→گ
 * z→ظ x→ط c→ز v→ر b→ذ n→د m→پ ,→و .→.
 */
export class KeyboardLayoutNormalizer {

    private static readonly LAYOUT_MAP: Record<string, string> = {
        q: "ض", w: "ص", e: "ث", r: "ق", t: "ف",
        y: "غ", u: "ع", i: "ه", o: "خ", p: "ح",
        "[": "ج", "]": "چ",
        a: "ش", s: "س", d: "ی", f: "ب", g: "ل",
        h: "ا", j: "ت", k: "ن", l: "م", ";": "ک", "'": "گ",
        z: "ظ", x: "ط", c: "ز", v: "ر", b: "ذ",
        n: "د", m: "پ", ",": "و", ".": "."
    };

    /**
     * Detect if text is likely typed on English keyboard trying to write Persian.
     * Returns true if the text contains mostly ASCII chars that map to Persian.
     */
    static isPersianOnEnglishKeyboard(text: string): boolean {
        const normalized = text.trim().toLowerCase();

        // If already contains Persian characters, don't convert
        if (/[\u0600-\u06FF]/.test(normalized)) {
            return false;
        }

        // If it's a command (starts with /), don't convert
        if (normalized.startsWith("/")) {
            return false;
        }

        // Count how many characters map to Persian
        let persianMapped = 0;
        let total = 0;

        for (const char of normalized) {
            if (/[a-z\[\\];',.]/.test(char)) {
                total++;
                if (this.LAYOUT_MAP[char]) {
                    persianMapped++;
                }
            }
        }

        // If most characters map to Persian, it's likely Persian on English keyboard
        return total > 0 && (persianMapped / total) > 0.5;
    }

    /**
     * Convert English keyboard Persian to actual Persian characters.
     */
    static normalize(text: string): string {
        if (!this.isPersianOnEnglishKeyboard(text)) {
            return text;
        }

        return text
            .split("")
            .map(char => {
                const lower = char.toLowerCase();
                const persian = this.LAYOUT_MAP[lower];
                if (persian) {
                    // Preserve case (though Persian doesn't have case)
                    return persian;
                }
                return char;
            })
            .join("");
    }
}
