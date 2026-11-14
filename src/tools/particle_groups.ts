import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { PhysicistApiClient } from "../client/index.js";

export function registerParticleGroupTools(server: McpServer, client: PhysicistApiClient): void {
  server.tool(
    "list_particle_groups",
    "List particle groups (taxonomic families, structural sectors, supermultiplets) registered in Physicist with subatomic particle counts.",
    {
      q: z.string().optional().describe("Filter particle groups by name or description substring"),
      include_subatomic_particles: z.boolean().optional().default(false).describe("Include subatomic particles associated with each particle group"),
      limit: z.number().int().min(1).max(500).optional().default(50).describe("Pagination limit (default: 50)"),
      offset: z.number().int().min(0).optional().default(0).describe("Pagination offset (default: 0)")
    },
    async ({ q, include_subatomic_particles, limit, offset }) => {
      try {
        const result = await client.listParticleGroups({ q, include_subatomic_particles, limit, offset });
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [{ type: "text", text: `Failed to list particle groups: ${err.message || String(err)}` }]
        };
      }
    }
  );

  server.tool(
    "get_particle_group",
    "Retrieve details of a single particle group including its subatomic particles.",
    {
      id: z.number().int().positive().describe("Particle Group ID"),
      include_subatomic_particles: z.boolean().optional().default(true).describe("Include subatomic particles belonging to this particle group")
    },
    async ({ id, include_subatomic_particles }) => {
      try {
        const particleGroup = await client.getParticleGroup(id, { include_subatomic_particles });
        return {
          content: [{ type: "text", text: JSON.stringify(particleGroup, null, 2) }]
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [{ type: "text", text: `Failed to get particle group ${id}: ${err.message || String(err)}` }]
        };
      }
    }
  );

  server.tool(
    "create_particle_group",
    "Create a new particle group record in the catalog.",
    {
      name: z.string().min(1).describe("Name of the particle group (e.g. 'Quarks', 'Leptons', 'Gauge Bosons', 'Baryons')"),
      description: z.string().optional().describe("Taxonomic, theoretical, and gauge symmetry description")
    },
    async ({ name, description }) => {
      try {
        const particleGroup = await client.createParticleGroup({ name, description });
        return {
          content: [{ type: "text", text: JSON.stringify(particleGroup, null, 2) }]
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [{ type: "text", text: `Failed to create particle group: ${err.message || String(err)}` }]
        };
      }
    }
  );

  server.tool(
    "update_particle_group",
    "Update an existing particle group's name or description.",
    {
      id: z.number().int().positive().describe("Particle Group ID"),
      name: z.string().optional().describe("Updated particle group name"),
      description: z.string().optional().describe("Updated description")
    },
    async ({ id, name, description }) => {
      try {
        const particleGroup = await client.updateParticleGroup(id, { name, description });
        return {
          content: [{ type: "text", text: JSON.stringify(particleGroup, null, 2) }]
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [{ type: "text", text: `Failed to update particle group ${id}: ${err.message || String(err)}` }]
        };
      }
    }
  );

  server.tool(
    "delete_particle_group",
    "Delete a particle group and its cascaded subatomic particles and quantum states.",
    {
      id: z.number().int().positive().describe("Particle Group ID to delete")
    },
    async ({ id }) => {
      try {
        const res = await client.deleteParticleGroup(id);
        return {
          content: [{ type: "text", text: JSON.stringify(res, null, 2) }]
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [{ type: "text", text: `Failed to delete particle group ${id}: ${err.message || String(err)}` }]
        };
      }
    }
  );

  server.tool(
    "upsert_particle_groups_batch",
    "Batch insert or update particle groups matching case-insensitively on name.",
    {
      particle_groups: z
        .array(
          z.object({
            name: z.string().min(1),
            description: z.string().optional()
          })
        )
        .min(1)
        .describe("Array of particle groups to upsert")
    },
    async ({ particle_groups }) => {
      try {
        const result = await client.upsertParticleGroupsBatch(particle_groups);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [{ type: "text", text: `Failed to upsert particle groups: ${err.message || String(err)}` }]
        };
      }
    }
  );

  server.tool(
    "populate_particle_groups",
    "Trigger LLM discovery to populate major particle groups and families with physics descriptions.",
    {
      sync: z.boolean().optional().default(false).describe("If true, wait synchronously for discovery to complete")
    },
    async ({ sync }) => {
      try {
        const result = await client.populateParticleGroups(sync);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [{ type: "text", text: `Failed to populate particle groups: ${err.message || String(err)}` }]
        };
      }
    }
  );

  server.tool(
    "populate_particle_group_subatomic_particles",
    "Discover and populate subatomic particles for a specific particle group via LLM generation.",
    {
      id: z.number().int().positive().describe("Particle Group ID"),
      sync: z.boolean().optional().default(true).describe("If true, wait synchronously for subatomic particle discovery to finish")
    },
    async ({ id, sync }) => {
      try {
        const result = await client.populateParticleGroupSubatomicParticles(id, sync);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
        };
      } catch (err: any) {
        return {
          isError: true,
          content: [{ type: "text", text: `Failed to populate subatomic particles for particle group ${id}: ${err.message || String(err)}` }]
        };
      }
    }
  );
}
