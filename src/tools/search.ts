import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { PhysicistApiClient } from "../client/index.js";

export function registerSearchTools(server: McpServer, client: PhysicistApiClient): void {
  server.tool(
    "search",
    "Unified cross-catalog semantic or keyword search across subatomic particles and quantum states in the Physicist comparative physics manifold.",
    {
      q: z.string().describe("Search query text (e.g. 'heavy gauge boson with electroweak coupling', 'color-singlet ground state baryon')"),
      mode: z.enum(["semantic", "keyword", "auto"]).optional().default("auto").describe("Search mode: semantic (pgvector cosine similarity), keyword (text matching), or auto"),
      target_type: z.enum(["all", "subatomic_particle", "quantum_state"]).optional().default("all").describe("Filter search results by entity type: all, subatomic_particle, or quantum_state"),
      limit: z.number().int().min(1).max(100).optional().default(20).describe("Maximum number of results to return (1-100)")
    },
    async ({ q, mode, target_type, limit }) => {
      try {
        const results = await client.search({ q, mode, target_type, limit });
        return {
          content: [{ type: "text", text: JSON.stringify(results, null, 2) }]
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [{ type: "text", text: `Search failed: ${err.message || String(err)}` }]
        };
      }
    }
  );

  server.tool(
    "find_counterparts",
    "Find nearest physical counterparts or symmetry analogs to a specified subatomic particle or quantum state using 1024-dimensional pgvector cosine distance.",
    {
      entity_type: z.enum(["subatomic_particle", "quantum_state"]).describe("Entity type to find counterparts for: subatomic_particle or quantum_state"),
      id: z.number().int().positive().describe("ID of the subatomic particle or quantum state"),
      limit: z.number().int().min(1).max(100).optional().default(10).describe("Number of nearest neighbors to return (default: 10)"),
      particle_group_id: z.number().int().positive().optional().describe("Optional particle group ID to filter counterpart candidates"),
      subatomic_particle_id: z.number().int().positive().optional().describe("Optional subatomic particle ID to filter counterpart candidates (for quantum state counterparts)"),
      include_embedding: z.boolean().optional().default(false).describe("Whether to include raw 1024-float vector embeddings in results")
    },
    async ({ entity_type, id, limit, particle_group_id, subatomic_particle_id, include_embedding }) => {
      try {
        if (entity_type === "subatomic_particle") {
          const neighbors = await client.getSubatomicParticleNeighbors(id, { limit, particle_group_id, include_embedding });
          return {
            content: [{ type: "text", text: JSON.stringify(neighbors, null, 2) }]
          };
        } else {
          const neighbors = await client.getQuantumStateNeighbors(id, { limit, subatomic_particle_id, particle_group_id, include_embedding });
          return {
            content: [{ type: "text", text: JSON.stringify(neighbors, null, 2) }]
          };
        }
      } catch (err: any) {
        return {
          isError: true,
          content: [{ type: "text", text: `Finding counterparts failed: ${err.message || String(err)}` }]
        };
      }
    }
  );
}
