import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { PhysicistApiClient } from "../client/index.js";

export function registerResources(server: McpServer, client: PhysicistApiClient): void {
  // Platform Status Resource
  server.resource(
    "platform-status",
    "physicist://status",
    async (uri) => {
      try {
        const status = await client.getStatus();
        return {
          contents: [
            {
              uri: uri.href,
              mimeType: "application/json",
              text: JSON.stringify(status, null, 2)
            }
          ]
        };
      } catch (err: any) {
        return {
          contents: [
            {
              uri: uri.href,
              mimeType: "text/plain",
              text: `Error loading status: ${err.message || String(err)}`
            }
          ]
        };
      }
    }
  );

  // Particle Groups Catalog Resource
  server.resource(
    "particle-groups-catalog",
    "physicist://particle-groups",
    async (uri) => {
      try {
        const particleGroups = await client.listParticleGroups({ limit: 100 });
        return {
          contents: [
            {
              uri: uri.href,
              mimeType: "application/json",
              text: JSON.stringify(particleGroups, null, 2)
            }
          ]
        };
      } catch (err: any) {
        return {
          contents: [
            {
              uri: uri.href,
              mimeType: "text/plain",
              text: `Error loading particle groups: ${err.message || String(err)}`
            }
          ]
        };
      }
    }
  );

  // Cluster Snapshot Resource
  server.resource(
    "cluster-snapshot",
    new ResourceTemplate("physicist://snapshots/{id}", { list: undefined }),
    async (uri, { id }) => {
      try {
        const snapshotId = parseInt(id as string, 10);
        const snapshot = await client.getClusterSnapshot(snapshotId, {
          include_groups: true,
          include_members: true,
          include_reports: true
        });
        return {
          contents: [
            {
              uri: uri.href,
              mimeType: "application/json",
              text: JSON.stringify(snapshot, null, 2)
            }
          ]
        };
      } catch (err: any) {
        return {
          contents: [
            {
              uri: uri.href,
              mimeType: "text/plain",
              text: `Error loading snapshot ${id}: ${err.message || String(err)}`
            }
          ]
        };
      }
    }
  );

  // Cluster Report Resource (Markdown Monograph)
  server.resource(
    "cluster-report",
    new ResourceTemplate("physicist://reports/{id}", { list: undefined }),
    async (uri, { id }) => {
      try {
        const reportId = parseInt(id as string, 10);
        const report = await client.getClusterReport(reportId, {
          include_summaries: true,
          include_sub_reports: true
        });
        const markdown =
          report.content ||
          `# ${report.title}\n\n*Status*: ${report.status} (Phase: ${report.phase || "N/A"})\n\nNo monograph markdown generated yet.`;
        return {
          contents: [
            {
              uri: uri.href,
              mimeType: "text/markdown",
              text: markdown
            }
          ]
        };
      } catch (err: any) {
        return {
          contents: [
            {
              uri: uri.href,
              mimeType: "text/plain",
              text: `Error loading report ${id}: ${err.message || String(err)}`
            }
          ]
        };
      }
    }
  );
}
