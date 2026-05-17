import { validateParserOutput } from "@/lib/agents/parser";

const validClause = { id: 1, text: "You agree to arbitration.", type: "Arbitration", section: "Section 9" };

describe("validateParserOutput", () => {
  it("parses a valid array of clauses", () => {
    const result = validateParserOutput([validClause]);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(1);
    expect(result[0].text).toBe("You agree to arbitration.");
    expect(result[0].type).toBe("Arbitration");
    expect(result[0].section).toBe("Section 9");
  });

  it("throws if input is not an array", () => {
    expect(() => validateParserOutput({ clauses: [] })).toThrow("Agent 1: expected JSON array");
  });

  it("throws if an item is not an object", () => {
    expect(() => validateParserOutput(["string item"])).toThrow();
  });

  it("throws if id is missing", () => {
    expect(() => validateParserOutput([{ text: "some text", type: "Other", section: null }])).toThrow("missing id");
  });

  it("throws if text is empty", () => {
    expect(() => validateParserOutput([{ id: 1, text: "  ", type: "Other", section: null }])).toThrow("missing text");
  });

  it("passes through unrecognized type values as-is (no server-side validation)", () => {
    const result = validateParserOutput([{ id: 1, text: "Test clause.", type: "UnknownType", section: null }]);
    expect(result[0].type).toBe("UnknownType");
  });

  it("handles null section", () => {
    const result = validateParserOutput([{ id: 1, text: "Test.", type: "NDA", section: null }]);
    expect(result[0].section).toBeNull();
  });

  it("handles missing section by defaulting to null", () => {
    const result = validateParserOutput([{ id: 1, text: "Test.", type: "NDA" }]);
    expect(result[0].section).toBeNull();
  });

  it("parses multiple clauses maintaining order", () => {
    const input = [
      { id: 1, text: "First.", type: "NDA", section: null },
      { id: 2, text: "Second.", type: "Non_Compete", section: "Section 2" },
      { id: 3, text: "Third.", type: "Arbitration", section: null },
    ];
    const result = validateParserOutput(input);
    expect(result.map((c) => c.id)).toEqual([1, 2, 3]);
  });
});
