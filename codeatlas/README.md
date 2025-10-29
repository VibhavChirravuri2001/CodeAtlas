# CodeAtlas

React knowledge-graph UI with sample data by default, or Neo4j if configured.

## Run (Sample Data)

Terminal 1:
```bash
cd server
npm install
npm start
```

Terminal 2:
```bash
cd client
npm install
npm run dev
```

## Run (Neo4j)
- Set `.env` in `server/` with NEO4J_* and `USE_SAMPLE_DATA=false`.
- Ensure Neo4j has `Repo` nodes with `DEPENDS_ON` relations and `id`, `lang` properties.
