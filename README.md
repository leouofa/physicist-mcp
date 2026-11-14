# Physicist Model Context Protocol (MCP) Server

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![MCP](https://img.shields.io/badge/MCP-1.32.2-purple.svg)](https://modelcontextprotocol.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A Model Context Protocol (MCP) server providing deep LLM-agent tool, resource, and prompt integrations with **[Physicist](https://github.com/leouofa/physicist)** — an open-source computational research platform and quantitative analytical laboratory for comparative particle physics, subatomic particles, and quantum state manifolds.

---

## Overview

The `physicist-mcp` server enables AI agents (Claude Code, Cursor, Gemini CLI, Antigravity) to query, manipulate, cluster, and synthesize physics domain models directly over standard input/output (`stdio`):

- **51 Registered MCP Tools** across 8 functional modules (Search, Particle Groups, Subatomic Particles, Quantum States, Clustering, Synthesis Reports, Background Jobs, and System Diagnostics).
- **4 Registered MCP Resources** exposing read-only live platform status, catalogs, cluster snapshots, and markdown monographs.
- **2 MCP Prompt Templates** for comparative particle physics studies and quantum cluster synthesis monographs.
- **1024-dimensional semantic manifold** querying via PostgreSQL `pgvector` HNSW indexes.

---

## Architectural Mapping

| Tier / Domain | Model | Table Name | MCP Module / Tools |
|---|---|---|---|
| **Tier 1** | Particle Groups / Families | `particle_groups` | `list_particle_groups`, `get_particle_group`, `create_particle_group`, `update_particle_group`, `delete_particle_group`, `upsert_particle_groups_batch`, `populate_particle_groups`, `populate_particle_group_subatomic_particles` |
| **Tier 2** | Subatomic Particles / Hadrons | `subatomic_particles` | `list_subatomic_particles`, `get_subatomic_particle`, `create_subatomic_particle`, `update_subatomic_particle`, `delete_subatomic_particle`, `upsert_subatomic_particles_batch`, `generate_subatomic_particle_embedding`, `populate_subatomic_particle_quantum_states`, `populate_subatomic_particles_bulk` |
| **Tier 3** | Quantum States / Eigenmodes | `quantum_states` | `list_quantum_states`, `get_quantum_state`, `create_quantum_state`, `update_quantum_state`, `delete_quantum_state`, `upsert_quantum_states_batch`, `generate_quantum_state_embedding`, `populate_quantum_states_bulk` |
| **Clustering** | 15-Level Agglomerative | `cluster_snapshots`, `cluster_groups` | `compute_clusters`, `create_cluster_snapshot`, `list_cluster_snapshots`, `get_cluster_snapshot`, `delete_cluster_snapshot`, `list_cluster_groups`, `get_cluster_group` |
| **Synthesis** | Multi-Stage Map-Reduce | `cluster_reports`, `cluster_report_summaries` | `list_cluster_reports`, `get_cluster_report`, `create_cluster_report`, `delete_cluster_report`, `generate_deep_synthesis`, `list_report_summaries`, `get_report_summary`, `list_report_sub_reports`, `get_report_sub_report` |
| **Global Search** | Cross-Catalog pgvector | Multi-table | `search`, `find_counterparts` |
| **Platform** | Jobs & System Info | Multi-service | `list_jobs`, `get_job_status`, `wait_for_job`, `get_platform_status`, `get_settings`, `update_context_window`, `trigger_bulk_embeddings`, `get_openapi_spec` |

---

## Installation & Setup

### Prerequisites
- Node.js 20+
- Running instance of [Physicist](https://github.com/leouofa/physicist) (`http://localhost:3000`)

### Build
```bash
git clone https://github.com/leouofa/physicist-mcp.git
cd physicist-mcp
npm install
npm run build
```

### Running the Server
```bash
# Run with defaults (http://localhost:3000/api/v1)
node dist/index.js

# Or with custom options
node dist/index.js --url http://localhost:3000/api/v1 --timeout 90000
```

---

## Configuration

Configuration options can be supplied via environment variables or CLI flags:

| Environment Variable | CLI Flag | Default | Description |
|---|---|---|---|
| `PHYSICIST_API_URL` | `-u`, `--url` | `http://localhost:3000/api/v1` | Base URL of Physicist REST API |
| `PHYSICIST_API_KEY` | `-k`, `--api-key` | *(none)* | Optional Bearer token for authentication |
| `PHYSICIST_TIMEOUT_MS` | `-t`, `--timeout` | `60000` | HTTP request timeout in milliseconds |

---

## MCP Host Integration

### Claude Desktop (`claude_desktop_config.json`)
```json
{
  "mcpServers": {
    "physicist": {
      "command": "node",
      "args": ["/path/to/physicist-mcp/dist/index.js"],
      "env": {
        "PHYSICIST_API_URL": "http://localhost:3000/api/v1"
      }
    }
  }
}
```

### Antigravity (`~/.gemini/antigravity/mcp_config.json`)
```json
{
  "mcpServers": {
    "physicist": {
      "command": "node",
      "args": ["/Users/leonid/src/physicist-mcp/dist/index.js"],
      "env": {
        "PHYSICIST_API_URL": "http://localhost:3000/api/v1"
      }
    }
  }
}
```

---

## Tool Catalog

### 1. Global Search & Manifolds
- `search`: Unified cross-catalog semantic (1024-d cosine similarity) or keyword search across subatomic particles and quantum states.
- `find_counterparts`: Find nearest physical counterparts or symmetry analogs using 1024-dimensional pgvector cosine distance.

### 2. Tier 1: Particle Groups
- `list_particle_groups`: List taxonomic families with particle counts.
- `get_particle_group`: Retrieve a particle group with nested subatomic particles.
- `create_particle_group`: Register a new particle group.
- `update_particle_group`: Update name or theoretical description.
- `delete_particle_group`: Cascade delete a particle group.
- `upsert_particle_groups_batch`: Bulk upsert particle groups by name.
- `populate_particle_groups`: Trigger LLM discovery of particle groups.
- `populate_particle_group_subatomic_particles`: Trigger LLM discovery of particles for a group.

### 3. Tier 2: Subatomic Particles
- `list_subatomic_particles`: Filter particles by group, themes, embedding status, and search keywords.
- `get_subatomic_particle`: Retrieve particle profile with vector embedding and child quantum states.
- `create_subatomic_particle`: Create a new subatomic particle.
- `update_subatomic_particle`: Update physical attributes or reassign particle group.
- `delete_subatomic_particle`: Cascade delete a particle.
- `upsert_subatomic_particles_batch`: Bulk upsert particles under a particle group.
- `generate_subatomic_particle_embedding`: Generate 1024-d pgvector embedding vector.
- `populate_subatomic_particle_quantum_states`: Trigger LLM discovery of quantum states for a particle.
- `populate_subatomic_particles_bulk`: Bulk discover particles across all groups.

### 4. Tier 3: Quantum States
- `list_quantum_states`: Filter quantum states and eigenmodes.
- `get_quantum_state`: Retrieve quantum state details and parent particle metadata.
- `create_quantum_state`: Create a new quantum state or eigenmode.
- `update_quantum_state`: Update quantum numbers or descriptions.
- `delete_quantum_state`: Delete a quantum state.
- `upsert_quantum_states_batch`: Bulk upsert quantum states under a particle.
- `generate_quantum_state_embedding`: Generate 1024-d vector embedding.
- `populate_quantum_states_bulk`: Bulk discover quantum states.

### 5. Clustering & Snapshots
- `compute_clusters`: Compute live connected-components vector clusters across 15 granularity levels without persisting.
- `create_cluster_snapshot`: Compute clustering and freeze it immediately into an immutable snapshot.
- `list_cluster_snapshots`: List frozen snapshots.
- `get_cluster_snapshot`: Retrieve snapshot with groups, members, and reports.
- `delete_cluster_snapshot`: Delete a cluster snapshot.
- `list_cluster_groups`: List archetype groups in a snapshot.
- `get_cluster_group`: Retrieve a single archetype cluster group with member entities.

### 6. Synthesis Reports
- `list_cluster_reports`: List multi-phase synthesis reports.
- `get_cluster_report`: Retrieve scholarly report content, progress, and intermediate summaries.
- `create_cluster_report`: Initiate a 2-Phase Map-Reduce synthesis monograph.
- `delete_cluster_report`: Delete a cluster report.
- `generate_deep_synthesis`: Upgrade or run a 3-Phase Hierarchical Deep Synthesis.
- `list_report_summaries`: List Phase 1 per-cluster summaries.
- `get_report_summary`: Retrieve a single Phase 1 summary.
- `list_report_sub_reports`: List Phase 2 batch syntheses.
- `get_report_sub_report`: Retrieve a single Phase 2 batch analysis.

### 7. Background Jobs
- `list_jobs`: List recent ActiveJob/Sidekiq background tasks.
- `get_job_status`: Inspect job status, progress, and results.
- `wait_for_job`: Poll a background task until completion or failure.

### 8. Platform & Diagnostics
- `get_platform_status`: Platform health, record counts, and LLM configuration.
- `get_settings`: Embedding completion metrics and LLM presets.
- `update_context_window`: Dynamically adjust LLM context window token size.
- `trigger_bulk_embeddings`: Enqueue bulk embedding calculations.
- `get_openapi_spec`: Retrieve OpenAPI 3.1 specification.

---

## MCP Resources

| URI | Format | Description |
|---|---|---|
| `physicist://status` | `application/json` | System health, entity counts, LLM models, and context window budgets. |
| `physicist://particle-groups` | `application/json` | Full catalog of particle groups and subatomic particle counts. |
| `physicist://snapshots/{id}` | `application/json` | Frozen cluster snapshot including discovered archetype groups and members. |
| `physicist://reports/{id}` | `text/markdown` | Full academic monograph generated by the synthesis pipeline. |

---

## MCP Prompts

- `comparative_particle_analysis`: Rigorous comparative particle physics analysis between two entities across particle groups using gauge invariants, spin-statistics, and semantic manifold distance.
- `quantum_cluster_monograph`: Academic monograph draft addressing a research inquiry grounded in a frozen snapshot's archetype clusters.

---

## Testing

```bash
# Run unit test suite
npm test

# Run tests in watch mode
npm run test:watch
```

---

## License

MIT License. Copyright (c) 2026 Leonid Medovyy.
