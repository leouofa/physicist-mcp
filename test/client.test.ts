import { describe, it, expect, beforeEach, afterEach } from "vitest";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { PhysicistApiClient, PhysicistApiError } from "../src/client/index.js";

describe("PhysicistApiClient", () => {
  let mock: MockAdapter;
  let client: PhysicistApiClient;

  beforeEach(() => {
    mock = new MockAdapter(axios);
    client = new PhysicistApiClient({
      apiUrl: "http://localhost:3000/api/v1",
      timeoutMs: 5000
    });
  });

  afterEach(() => {
    mock.restore();
  });

  it("fetches platform status successfully", async () => {
    const mockStatus = {
      status: "ok",
      environment: "test",
      timestamp: "2026-11-14T00:00:00Z",
      counts: {
        particle_groups: 6,
        subatomic_particles: 150,
        subatomic_particles_embedded: 150,
        quantum_states: 600,
        quantum_states_embedded: 600,
        cluster_snapshots: 5,
        cluster_reports: 3
      },
      config: {
        embedding_model: "qwen3-embedding:0.6b",
        embedding_api_base: "http://localhost:11434/v1",
        embedding_dimensions: 1024,
        llm_model: "Qwen3.6-35B-A3B-NVFP4",
        llm_api_base: "http://localhost:11434/v1",
        context_window: 262144,
        digest_char_budget: 576716
      }
    };

    mock.onGet("http://localhost:3000/api/v1/status").reply(200, { data: mockStatus });

    const status = await client.getStatus();
    expect(status.status).toBe("ok");
    expect(status.counts.particle_groups).toBe(6);
    expect(status.counts.subatomic_particles).toBe(150);
    expect(status.counts.quantum_states).toBe(600);
  });

  it("handles 404 not found errors cleanly", async () => {
    mock.onGet("http://localhost:3000/api/v1/subatomic_particles/999").reply(404, {
      error: { code: "not_found", message: "Couldn't find SubatomicParticle with 'id'=999" }
    });

    await expect(client.getSubatomicParticle(999)).rejects.toThrowError(PhysicistApiError);
    await expect(client.getSubatomicParticle(999)).rejects.toMatchObject({
      code: "not_found",
      status: 404
    });
  });

  it("finds subatomic particle and quantum state counterparts via neighbors endpoints", async () => {
    const mockParticles = [{ id: 2, name: "Neutron", neighbor_distance: 0.08 }];
    mock
      .onGet("http://localhost:3000/api/v1/subatomic_particles/1/neighbors", {
        params: { limit: 5 }
      })
      .reply(200, { data: mockParticles });

    const particleNeighbors = await client.getSubatomicParticleNeighbors(1, { limit: 5 });
    expect(particleNeighbors).toHaveLength(1);
    expect(particleNeighbors[0].name).toBe("Neutron");

    const mockQuantumStates = [{ id: 10, name: "Helicity -1/2 Left-Handed", neighbor_distance: 0.06 }];
    mock
      .onGet("http://localhost:3000/api/v1/quantum_states/4/neighbors", {
        params: { limit: 5, particle_group_id: 1 }
      })
      .reply(200, { data: mockQuantumStates });

    const quantumStateNeighbors = await client.getQuantumStateNeighbors(4, { limit: 5, particle_group_id: 1 });
    expect(quantumStateNeighbors).toHaveLength(1);
    expect(quantumStateNeighbors[0].name).toBe("Helicity -1/2 Left-Handed");
  });

  it("executes particle group CRUD methods", async () => {
    const mockGroup = { id: 1, name: "Baryons", description: "Three-quark bound states", subatomic_particles_count: 24 };

    mock.onPost("http://localhost:3000/api/v1/particle_groups").reply(201, { data: mockGroup });
    const created = await client.createParticleGroup({ name: "Baryons", description: "Three-quark bound states" });
    expect(created.name).toBe("Baryons");

    mock.onPatch("http://localhost:3000/api/v1/particle_groups/1").reply(200, { data: { ...mockGroup, name: "Light Baryons" } });
    const updated = await client.updateParticleGroup(1, { name: "Light Baryons" });
    expect(updated.name).toBe("Light Baryons");

    mock.onDelete("http://localhost:3000/api/v1/particle_groups/1").reply(200, { data: { id: 1, name: "Light Baryons", deleted: true } });
    const deleted = await client.deleteParticleGroup(1);
    expect(deleted.deleted).toBe(true);
  });

  it("executes clustering, snapshots, and reports", async () => {
    const mockSnapshot = {
      id: 1,
      target_type: "SubatomicParticle",
      level: 5,
      distance_threshold: 0.20,
      title: "Hadrons Multiplet Clusters",
      clusters_count: 8,
      items_count: 45
    };

    mock.onPost("http://localhost:3000/api/v1/clusters/snapshot").reply(201, { data: mockSnapshot });
    const snapshot = await client.createClusterSnapshot({
      target_type: "SubatomicParticle",
      level: 5,
      title: "Hadrons Multiplet Clusters"
    });
    expect(snapshot.id).toBe(1);
    expect(snapshot.clusters_count).toBe(8);

    const mockReport = {
      id: 10,
      cluster_snapshot_id: 1,
      title: "Comparative Study of Baryon Symmetries",
      prompt: "Synthesize symmetries",
      status: "completed",
      phase: "completed",
      progress_percentage: 100,
      is_detailed: false
    };

    mock.onPost("http://localhost:3000/api/v1/cluster_reports").reply(201, { data: mockReport });
    const report = await client.createClusterReport({
      cluster_snapshot_id: 1,
      prompt: "Synthesize symmetries"
    });
    expect(report.id).toBe(10);
    expect(report.status).toBe("completed");
  });
});
