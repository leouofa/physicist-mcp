import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { PhysicistApiClient } from "../client/index.js";
import { registerSearchTools } from "./search.js";
import { registerParticleGroupTools } from "./particle_groups.js";
import { registerSubatomicParticleTools } from "./subatomic_particles.js";
import { registerQuantumStateTools } from "./quantum_states.js";
import { registerClusterTools } from "./clusters.js";
import { registerReportTools } from "./reports.js";
import { registerJobTools } from "./jobs.js";
import { registerSystemTools } from "./system.js";

export function registerAllTools(server: McpServer, client: PhysicistApiClient): void {
  registerSearchTools(server, client);
  registerParticleGroupTools(server, client);
  registerSubatomicParticleTools(server, client);
  registerQuantumStateTools(server, client);
  registerClusterTools(server, client);
  registerReportTools(server, client);
  registerJobTools(server, client);
  registerSystemTools(server, client);
}
