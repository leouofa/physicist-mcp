import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { PhysicistApiClient } from "../client/index.js";

export function registerSubatomicParticleTools(server: McpServer, client: PhysicistApiClient): void {
  server.tool(
    "list_subatomic_particles",
    "List subatomic particles registered in Physicist with filtering by particle group, themes, embedding status, and search keywords.",
    {
      particle_group_id: z.number().int().positive().optional().describe("Filter subatomic particles by Particle Group ID"),
      particle_group: z.string().optional().describe("Filter subatomic particles by Particle Group name"),
      theme: z.string().optional().describe("Filter subatomic particles containing a specific theme tag"),
      q: z.string().optional().describe("Search query matching subatomic particle name or description"),
      embedded: z.boolean().optional().describe("Filter by embedding presence (true for embedded only, false for missing)"),
      include_quantum_states: z.boolean().optional().default(false).describe("Include child quantum states in results"),
      include_embedding: z.boolean().optional().default(false).describe("Include raw 1024-float vector embedding"),
      limit: z.number().int().min(1).max(500).optional().default(50).describe("Pagination limit (default: 50)"),
      offset: z.number().int().min(0).optional().default(0).describe("Pagination offset (default: 0)")
    },
    async ({ particle_group_id, particle_group, theme, q, embedded, include_quantum_states, include_embedding, limit, offset }) => {
      try {
        const result = await client.listSubatomicParticles({
          particle_group_id,
          particle_group,
          theme,
          q,
          embedded,
          include_quantum_states,
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
          content: [{ type: "text", text: `Failed to list subatomic particles: ${err.message || String(err)}` }]
        };
      }
    }
  );

  server.tool(
    "get_subatomic_particle",
    "Retrieve details of a single subatomic particle including its particle group and child quantum states.",
    {
      id: z.number().int().positive().describe("Subatomic Particle ID"),
      include_embedding: z.boolean().optional().default(false).describe("Include raw 1024-float vector embedding"),
      include_quantum_states: z.boolean().optional().default(true).describe("Include child quantum states")
    },
    async ({ id, include_embedding, include_quantum_states }) => {
      try {
        const particle = await client.getSubatomicParticle(id, { include_embedding, include_quantum_states });
        return {
          content: [{ type: "text", text: JSON.stringify(particle, null, 2) }]
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [{ type: "text", text: `Failed to get subatomic particle ${id}: ${err.message || String(err)}` }]
        };
      }
    }
  );

  server.tool(
    "create_subatomic_particle",
    "Create a new subatomic particle record in Physicist.",
    {
      particle_group_id: z.number().int().positive().describe("Parent Particle Group ID"),
      name: z.string().min(1).describe("Subatomic particle name (e.g. 'Proton', 'Muon', 'Higgs Boson', 'Top Quark')"),
      description: z.string().optional().describe("Physical properties, gauge invariants, rest mass, decay modes, and spin"),
      themes: z.array(z.string()).optional().describe("Physical or symmetry theme tags (e.g. ['hadron', 'fermion', 'baryon', 'valence-uud'])")
    },
    async ({ particle_group_id, name, description, themes }) => {
      try {
        const particle = await client.createSubatomicParticle({ particle_group_id, name, description, themes });
        return {
          content: [{ type: "text", text: JSON.stringify(particle, null, 2) }]
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [{ type: "text", text: `Failed to create subatomic particle: ${err.message || String(err)}` }]
        };
      }
    }
  );

  server.tool(
    "update_subatomic_particle",
    "Update an existing subatomic particle's attributes.",
    {
      id: z.number().int().positive().describe("Subatomic Particle ID"),
      name: z.string().optional().describe("Updated subatomic particle name"),
      description: z.string().optional().describe("Updated description"),
      themes: z.array(z.string()).optional().describe("Updated physical themes"),
      particle_group_id: z.number().int().positive().optional().describe("Reassign to another Particle Group ID")
    },
    async ({ id, name, description, themes, particle_group_id }) => {
      try {
        const particle = await client.updateSubatomicParticle(id, { name, description, themes, particle_group_id });
        return {
          content: [{ type: "text", text: JSON.stringify(particle, null, 2) }]
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [{ type: "text", text: `Failed to update subatomic particle ${id}: ${err.message || String(err)}` }]
        };
      }
    }
  );

  server.tool(
    "delete_subatomic_particle",
    "Delete a subatomic particle and its cascaded quantum states.",
    {
      id: z.number().int().positive().describe("Subatomic Particle ID to delete")
    },
    async ({ id }) => {
      try {
        const res = await client.deleteSubatomicParticle(id);
        return {
          content: [{ type: "text", text: JSON.stringify(res, null, 2) }]
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [{ type: "text", text: `Failed to delete subatomic particle ${id}: ${err.message || String(err)}` }]
        };
      }
    }
  );

  server.tool(
    "upsert_subatomic_particles_batch",
    "Batch insert or update subatomic particles under a specific particle group matching on lower(name).",
    {
      particle_group_id: z.number().int().positive().describe("Parent Particle Group ID"),
      subatomic_particles: z
        .array(
          z.object({
            name: z.string().min(1),
            description: z.string().optional(),
            themes: z.array(z.string()).optional()
          })
        )
        .min(1)
        .describe("Array of subatomic particles to upsert")
    },
    async ({ particle_group_id, subatomic_particles }) => {
      try {
        const result = await client.upsertSubatomicParticlesBatch(particle_group_id, subatomic_particles);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [{ type: "text", text: `Failed to upsert subatomic particles: ${err.message || String(err)}` }]
        };
      }
    }
  );

  server.tool(
    "generate_subatomic_particle_embedding",
    "Generate or regenerate a 1024-dimensional semantic embedding vector for a single subatomic particle.",
    {
      id: z.number().int().positive().describe("Subatomic Particle ID"),
      sync: z.boolean().optional().default(true).describe("If true, wait synchronously for vector generation to finish")
    },
    async ({ id, sync }) => {
      try {
        const result = await client.generateSubatomicParticleEmbedding(id, sync);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [{ type: "text", text: `Failed to generate embedding for subatomic particle ${id}: ${err.message || String(err)}` }]
        };
      }
    }
  );

  server.tool(
    "populate_subatomic_particle_quantum_states",
    "Discover and populate quantum states, eigenmodes, and helicity manifolds for a subatomic particle via LLM analysis.",
    {
      id: z.number().int().positive().describe("Subatomic Particle ID"),
      sync: z.boolean().optional().default(true).describe("If true, wait synchronously for quantum state discovery to finish")
    },
    async ({ id, sync }) => {
      try {
        const result = await client.populateSubatomicParticleQuantumStates(id, sync);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [{ type: "text", text: `Failed to populate quantum states for subatomic particle ${id}: ${err.message || String(err)}` }]
        };
      }
    }
  );

  server.tool(
    "populate_subatomic_particles_bulk",
    "Bulk trigger discovery of subatomic particles across one or all particle groups via background job.",
    {
      particle_group_id: z.number().int().positive().optional().describe("Optional Particle Group ID to limit subatomic particle discovery"),
      sync: z.boolean().optional().default(false).describe("If true, run synchronously")
    },
    async ({ particle_group_id, sync }) => {
      try {
        const result = await client.populateSubatomicParticles(particle_group_id, sync);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [{ type: "text", text: `Failed to bulk populate subatomic particles: ${err.message || String(err)}` }]
        };
      }
    }
  );
}
