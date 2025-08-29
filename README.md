# Promotion Workflow Demo

A minimal demo to streamline the promotion request process:

- Employee submits a promotion application,
- Line manager reviews, returns with a comment, or approves.

Tech (so far): Node.js with Express (TypeScript) for the backend, MongoDB, Docker (development mode). Swagger for API documentation.
Frontend and the rest will be added next.

---

## Quick start

### Requirements

- Node.js 22.18.0 (LTS)
- Docker Desktop

### 1 Run backend using Docker in dev mode

```bash
cd infra/docker
make compose-up-build
```

### 2 Ports

- **Backend service (Node.js + Express):** http://localhost:3000
- **MongoDB database:** mongodb://localhost:27017
- **Mongo Express (database viewer):** http://localhost:8081

### 3 Create a sample application (CURL)

```bash
curl -X POST http://localhost:3000/applications \
  -H "Content-Type: application/json" \
  -d '{
    "employeeId":"emp_1",
    "managerId":"mgr_1",
    "fields": {
      "currentLevel":"L1",
      "targetLevel":"L2",
      "certCount": 2,
      "projectRevCount": 1,
      "perfomanceRevCount": 1,
      "justification":"I delivered impact X and Y"
    }
  }'
```

### 4 API Endpoints and schemas documentation

http://localhost:3000/docs/

### 5 Development Architecture

```mermaid
flowchart LR
  classDef svc fill:#eef,stroke:#88a,color:#000,stroke-width:1px,rx:6,ry:6
  classDef one fill:#efe,stroke:#7a7,color:#000,stroke-width:1px,rx:6,ry:6
  classDef net fill:#f7f7f7,stroke:#bbb,color:#000,stroke-dasharray:3 3,rx:8,ry:8
  classDef vol fill:#fff8e1,stroke:#d9a441,color:#000,rx:6,ry:6

  subgraph FRONTEND["frontend network"]
    class FRONTEND net
    API["api-node (dev)<br/>hot reload<br/>port 3000"]:::svc
    ME["mongo-express<br/>port 8081"]:::svc
  end

  subgraph BACKEND["backend network (private)"]
    class BACKEND net
    DB["mongo-dev<br/>auth root<br/>healthcheck"]:::one
  end

  API --- ME
  API --- DB
  ME  --- DB

  subgraph VOLS["volumes"]
    class VOLS net
    VNM["node_modules"]:::vol
    VMONGO["mongo-data-dev"]:::vol
  end

  API --- VNM
  DB  --- VMONGO
```

### 6 Production Architecture

```mermaid
flowchart LR
  classDef svc fill:#eef,stroke:#88a,color:#000,stroke-width:1px,rx:6,ry:6
  classDef db  fill:#efe,stroke:#7a7,color:#000,stroke-width:1px,rx:6,ry:6
  classDef job fill:#ffe,stroke:#cc8,color:#000,stroke-width:1px,rx:6,ry:6
  classDef net fill:#f7f7f7,stroke:#bbb,stroke-dasharray:3 3,rx:8,ry:8
  classDef vol fill:#fff8e1,stroke:#d9a441,color:#000,rx:6,ry:6

  subgraph FRONTEND["frontend network (public)"]
    class FRONTEND net
    RP["reverse-proxy<br/>(Traefik/Nginx)<br/>TLS + routing"]:::svc
    API1["api-node #1<br/>prod container"]:::svc
    API2["api-node #2<br/>prod container"]:::svc
  end

  subgraph BACKEND["backend network (private)"]
    class BACKEND net
    DB1["mongo db-1"]:::db
    DB2["mongo db-2"]:::db
    DBA["mongo arbiter"]:::db
    INIT["mongo-init-replica<br/>(one-off)"]:::job
    SEED["seed service<br/>(one-off)"]:::job
  end

  subgraph VOLS["volumes"]
    class VOLS net
    VMONGO["mongo-data"]:::vol
    VCONF["mongo-config"]:::vol
  end

  %% edges
  RP --> API1
  RP --> API2

  API1 --- DB1
  API2 --- DB1
  API1 --- DB2
  API2 --- DB2

  DB1 --- DB2
  DB1 --- DBA

  INIT --> DB1
  SEED --> DB1

  DB1 --- VMONGO
  DB1 --- VCONF

```
