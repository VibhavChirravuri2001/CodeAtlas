import express from 'express'
import cors from 'cors'
import fs from 'fs'
import dotenv from 'dotenv'
import neo4j from 'neo4j-driver'

dotenv.config()
const app = express()
app.use(cors())

const PORT = 5001
const USE_SAMPLE = (process.env.USE_SAMPLE_DATA || 'true').toLowerCase() === 'true'

app.get('/api/graph', async (req, res) => {
  if (USE_SAMPLE) {
    const data = JSON.parse(fs.readFileSync(new URL('./sample-graph.json', import.meta.url)))
    return res.json(data)
  }
  // Neo4j mode
  const driver = neo4j.driver(process.env.NEO4J_URI, neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASS))
  const session = driver.session()
  try {
    const result = await session.run(`
      MATCH (a:Repo)-[r:DEPENDS_ON]->(b:Repo)
      RETURN a.id as a, b.id as b, a.lang as alang, b.lang as blang
    `)
    const nodesMap = new Map()
    const links = []
    for (const rec of result.records){
      const a = rec.get('a'); const b = rec.get('b')
      const alang = rec.get('alang'); const blang = rec.get('blang')
      nodesMap.set(a, { id: a, lang: alang })
      nodesMap.set(b, { id: b, lang: blang })
      links.push({ source: a, target: b })
    }
    const nodes = Array.from(nodesMap.values())
    res.json({ nodes, links })
  } catch(e){
    console.error(e)
    res.status(500).json({ error: 'Neo4j query failed' })
  } finally {
    await session.close()
    await driver.close()
  }
})

app.listen(PORT, () => console.log('CodeAtlas server on http://localhost:'+PORT))
