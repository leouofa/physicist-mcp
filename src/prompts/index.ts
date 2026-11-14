import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function registerPrompts(server: McpServer): void {
  server.prompt(
    "comparative_particle_analysis",
    "Prompt template for comparing two subatomic particles or quantum states across particle groups using gauge invariants, spin-statistics, and semantic manifold distance.",
    {
      entity_a: z.string().describe("First subatomic particle or quantum state name (e.g. 'Proton' or 'Helicity +1/2 Right-Handed')"),
      entity_b: z.string().describe("Second subatomic particle or quantum state name (e.g. 'Neutron' or 'Helicity -1/2 Left-Handed')"),
      entity_type: z
        .enum(["subatomic_particle", "quantum_state"])
        .optional()
        .default("subatomic_particle")
        .describe("Entity type to compare: subatomic_particle or quantum_state (default: subatomic_particle)"),
      focus_theme: z
        .string()
        .optional()
        .describe("Optional thematic lens (e.g. 'electroweak symmetry breaking', 'isospin doublet symmetry', 'mass hierarchy')")
    },
    ({ entity_a, entity_b, entity_type = "subatomic_particle", focus_theme }) => {
      const themeInstruction = focus_theme
        ? `Focus specifically through the thematic lens of: "${focus_theme}".`
        : "Analyze shared gauge symmetries, spin-statistics, decay channels, and structural multiplet convergence.";

      const detailTool = entity_type === "quantum_state" ? "get_quantum_state" : "get_subatomic_particle";

      return {
        description: `Comparative particle physics analysis of ${entity_a} vs. ${entity_b}`,
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text:
                `Please conduct a rigorous comparative theoretical and phenomenological particle physics analysis between ${entity_a} and ${entity_b} (${entity_type}) using the Physicist computational framework.\n\n` +
                `1. Query Physicist using the 'search' and '${detailTool}' tools to retrieve their structured profiles, thematic tags, and particle group context.\n` +
                `2. Use 'find_counterparts' (entity_type='${entity_type}') to examine where each falls on the 1024-dimensional pgvector cosine distance manifold.\n` +
                `3. ${themeInstruction}\n` +
                `4. Cite specific thematic tags, quantum numbers, cosine distances, and cross-multiplet structural parallels.`
            }
          }
        ]
      };
    }
  );

  server.prompt(
    "quantum_cluster_monograph",
    "Prompt template to draft an academic physics treatise based on Physicist archetype clusters and frozen snapshots.",
    {
      snapshot_id: z.string().describe("ID of the frozen cluster snapshot to synthesize"),
      thematic_prompt: z.string().describe("Theoretical, phenomenological, or symmetry research inquiry to address")
    },
    ({ snapshot_id, thematic_prompt }) => {
      return {
        description: `Physics synthesis monograph based on Snapshot #${snapshot_id}`,
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text:
                `You are an expert theoretical physicist and high-energy phenomenologist specializing in gauge field theories, multiplet manifolds, and comparative quantum state synthesis.\n\n` +
                `Research Inquiry: "${thematic_prompt}"\n\n` +
                `1. Inspect cluster snapshot #${snapshot_id} using 'get_cluster_snapshot' or resource 'physicist://snapshots/${snapshot_id}'.\n` +
                `2. Examine the discovered archetype cluster groups, shared physical themes, and constituent subatomic particles or quantum states.\n` +
                `3. Check if any synthesis reports exist via 'list_cluster_reports' or initiate a new report via 'create_cluster_report' (and optionally 'generate_deep_synthesis').\n` +
                `4. Compose an academic monograph synthesizing cross-multiplet patterns with formal citations to cluster numbers and member physical entities.`
            }
          }
        ]
      };
    }
  );
}
