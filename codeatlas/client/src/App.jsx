import React, { useEffect, useState } from 'react'
import axios from 'axios'
import ForceGraph2D from 'react-force-graph'

export default function App(){
  const [graph, setGraph] = useState({ nodes: [], links: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load(){
      const res = await axios.get('/api/graph')
      setGraph(res.data)
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div style={{height: '100vh', width: '100vw'}}>
      <div style={{position:'absolute', top: 10, left:10, background:'#fff', padding:8, borderRadius:8, boxShadow:'0 2px 10px rgba(0,0,0,.1)'}}>
        <strong>CodeAtlas</strong>
        <div style={{opacity:.7}}>Knowledge graph of repos (sample data)</div>
      </div>
      {!loading && (
        <ForceGraph2D
          graphData={graph}
          nodeLabel={n => n.id + (n.lang ? ' ('+n.lang+')' : '')}
          linkDirectionalParticles={2}
          width={window.innerWidth}
          height={window.innerHeight}
        />
      )}
    </div>
  )
}
