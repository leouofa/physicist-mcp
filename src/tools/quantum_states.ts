import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { PhysicistApiClient } from "../client/index.js";

export function registerQuantumStateTools(server: McpServer, client: PhysicistApiClient): void {
  server.tool(
    "list_quantum_states",
    "List quantum states and eigenmodes registered in Physicist with filtering by subatomic particle, particle group, themes, and embedding status.",
    {
      subatomic_particle_id: z.number().int().positive().optional().describe("Filter by parent Subatomic Particle ID"),
      particle_group_id: z.number().int().positive().optional().describe("Filter by parent Particle Group ID"),
      theme: z.string().optional().describe("Filter by quantum state or symmetry theme tag"),
      q: z.string().optional().describe("Search query matching quantum state name or description"),
      embedded: z.boolean().optional().describe("Filter by embedding presence (true for embedded only, false for missing)"),
      include_embedding: z.boolean().optional().default(false).describe("Include raw 1024-float vector embedding"),
      limit: z.number().int().min(1).max(500).optional().default(50).describe("Pagination limit (default: 50)"),
      offset: z.number().int().min(0).optional().default(0).describe("Pagination offset (default: 0)")
    },
    async ({ subatomic_particle_id, particle_group_id, theme, q, embedded, include_embedding, limit, offset }) => {
      try {
        const result = await client.listQuantumStates({
          subatomic_particle_id,
          particle_group_id,
          theme,
          q,
          embedded,
          include_embedding,
          limit,
          offset
        });
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [{ type: "text", text: `Failed to list quantum states: ${err.message || String(err)}` }]
        };
      }
    }
  );

  server.tool(
    "get_quantum_state",
    "Retrieve details of a single quantum state including parent subatomic particle and particle group metadata.",
    {
      id: z.number().int().positive().describe("Quantum State ID"),
      include_embedding: z.boolean().optional().default(false).describe("Include raw 1024-float vector embedding")
    },
    async ({ id, include_embedding }) => {
      try {
        const quantumState = await client.getQuantumState(id, { include_embedding });
        return {
          content: [{ type: "text", text: JSON.stringify(quantumState, null, 2) }]
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [{ type: "text", text: `Failed to get quantum state ${id}: ${err.message || String(err)}` }]
        };
      }
    }
  );

  server.tool(
    "create_quantum_state",
    "Create a new quantum state or eigenmode under a subatomic particle.",
    {
      subatomic_particle_id: z.number().int().positive().describe("Parent Subatomic Particle ID"),
      name: z.string().min(1).describe("Quantum state name (e.g. 'Helicity +1/2 Right-Handed', 'Color Singlet', 'Ground Eigenstate')"),
      description: z.string().optional().describe("Quantum numbers, projection eigenvalues, wavefunctions, and symmetry representations"),
      themes: z.array(z.string()).optional().describe("Thematic tags (e.g. ['spin-projection', 'chirality', 'eigenmode'])")
    },
    async ({ subatomic_particle_id, name, description, themes }) => {
      try {
        const quantumState = await client.createQuantumState({ subatomic_particle_id, name, description, themes });
        return {
          content: [{ type: "text", text: JSON.stringify(quantumState, null, 2) }]
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [{ type: "text", text: `Failed to create quantum state: ${err.message || String(err)}` }]
        };
      }
    }
  );

  server.tool(
    "update_quantum_state",
    "Update an existing quantum state's attributes.",
    {
      id: z.number().int().positive().describe("Quantum State ID"),
      name: z.string().optional().describe("Updated quantum state name"),
      description: z.string().optional().describe("Updated description"),
      themes: z.array(z.string()).optional().describe("Updated themes"),
      subatomic_particle_id: z.number().int().positive().optional().describe("Reassign to another Subatomic Particle ID")
    },
    async ({ id, name, description, themes, subatomic_particle_id }) => {
      try {
        const quantumState = await client.updateQuantumState(id, { name, description, themes, subatomic_particle_id });
        return {
          content: [{ type: "text", text: JSON.stringify(quantumState, null, 2) }]
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [{ type: "text", text: `Failed to update quantum state ${id}: ${err.message || String(err)}` }]
        };
      }
    }
  );

  server.tool(
    "delete_quantum_state",
    "Delete a quantum state from the catalog.",
    {
      id: z.number().int().positive().describe("Quantum State ID to delete")
    },
    async ({ id }) => {
      try {
        const res = await client.deleteQuantumState(id);
        return {
          content: [{ type: "text", text: JSON.stringify(res, null, 2) }]
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [{ type: "text", text: `Failed to delete quantum state ${id}: ${err.message || String(err)}` }]
        };
      }
    }
  );

  server.tool(
    "upsert_quantum_states_batch",
    "Batch insert or update quantum states for a specific subatomic particle matching on lower(name).",
    {
      subatomic_particle_id: z.number().int().positive().describe("Parent Subatomic Particle ID"),
      quantum_states: z
        .array(
          z.object({
            name: z.string().min(1),
            description: z.string().optional(),
            themes: z.array(z.string()).optional()
          })
        )
        .min(1)
        .describe("Array of quantum states to upsert")
    },
    async ({ subatomic_particle_id, quantum_states }) => {
      try {
        const result = await client.upsertQuantumStatesBatch(subatomic_particle_id, quantum_states);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [{ type: "text", text: `Failed to upsert quantum states: ${err.message || String(err)}` }]
        };
      }
    }
  );

  server.tool(
    "generate_quantum_state_embedding",
    "Generate or regenerate a 1024-dimensional semantic embedding vector for a quantum state.",
    {
      id: z.number().int().positive().describe("Quantum State ID"),
      sync: z.boolean().optional().default(true).describe("If true, wait synchronously for vector generation to finish")
    },
    async ({ id, sync }) => {
      try {
        const result = await client.generateQuantumStateEmbedding(id, sync);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [{ type: "text", text: `Failed to generate embedding for quantum state ${id}: ${err.message || String(err)}` }]
        };
      }
    }
  );

  server.tool(
    "populate_quantum_states_bulk",
    "Bulk trigger discovery of quantum states across all subatomic particles under an optional subatomic particle scope.",
    {
      subatomic_particle_id: z.number().int().positive().optional().describe("Optional Subatomic Particle ID to limit quantum state discovery"),
      sync: z.boolean().optional().default(false).describe("If true, run synchronously")
    },
    async ({ subatomic_particle_id, sync }) => {
      try {
        const result = await client.populateQuantumStates(subatomic_particle_id, sync);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [{ type: "text", text: `Failed to bulk populate quantum states: ${err.message || String(err)}` }]
        };
      }
    }
  );
}
