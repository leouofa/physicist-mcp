# Changelog

All notable changes to `physicist-mcp` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-11-14

### Added
- Initial release of `physicist-mcp` Model Context Protocol server.
- Full 51-tool suite mirroring the 3-tier comparative particle physics architecture:
  - Global Search (2 tools): `search`, `find_counterparts`
  - Particle Groups / Supermultiplets (8 tools): `list_particle_groups`, `get_particle_group`, `create_particle_group`, `update_particle_group`, `delete_particle_group`, `upsert_particle_groups_batch`, `populate_particle_groups`, `populate_particle_group_subatomic_particles`
  - Subatomic Particles / Hadrons / Quasiparticles (9 tools): `list_subatomic_particles`, `get_subatomic_particle`, `create_subatomic_particle`, `update_subatomic_particle`, `delete_subatomic_particle`, `upsert_subatomic_particles_batch`, `generate_subatomic_particle_embedding`, `populate_subatomic_particle_quantum_states`, `populate_subatomic_particles_bulk`
  - Quantum States / Eigenmodes / Helicity Manifolds (8 tools): `list_quantum_states`, `get_quantum_state`, `create_quantum_state`, `update_quantum_state`, `delete_quantum_state`, `upsert_quantum_states_batch`, `generate_quantum_state_embedding`, `populate_quantum_states_bulk`
  - Clusters & Snapshots (7 tools): `compute_clusters`, `create_cluster_snapshot`, `list_cluster_snapshots`, `get_cluster_snapshot`, `delete_cluster_snapshot`, `list_cluster_groups`, `get_cluster_group`
  - Synthesis Reports (9 tools): `list_cluster_reports`, `get_cluster_report`, `create_cluster_report`, `delete_cluster_report`, `generate_deep_synthesis`, `list_report_summaries`, `get_report_summary`, `list_report_sub_reports`, `get_report_sub_report`
  - ActiveJob / Background Tasks (3 tools): `list_jobs`, `get_job_status`, `wait_for_job`
  - System, Status & Configuration (5 tools): `get_platform_status`, `get_settings`, `update_context_window`, `trigger_bulk_embeddings`, `get_openapi_spec`
- 4 MCP Resources: `physicist://status`, `physicist://particle-groups`, `physicist://snapshots/{id}`, `physicist://reports/{id}`
- 2 MCP Prompts: `comparative_particle_analysis`, `quantum_cluster_monograph`
- Typed HTTP Client (`PhysicistApiClient`) with error mapping (`PhysicistApiError`) and polling support.
- Complete Vitest test suite with 100% passing coverage for client, config, jobs, and tools.
