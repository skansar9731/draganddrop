import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactFlow, {ReactFlowProvider,addEdge,useNodesState,useEdgesState, Controls,} from 'reactflow';
import 'reactflow/dist/style.css';
import Sidebar from './Sidebar';

// import './index.css';


const initialNodes = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Start' },
    position: { x: 250, y: 5 },
  },
];

const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];
let id = 0;
const getId = () => `dndnode_${id++}`;
const DnDFlow = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [nodeName, setNodeName] = useState('Start');
  const [nodeBg, setNodeBg] = useState('#eee');
  const [nodeHidden, setNodeHidden] = useState(false);
  const [editValue,setEditValue]=useState()
  const [id,setId]=useState()


  //2//edit node

  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === '1') {
          // it's important that you create a new object here
          // in order to notify react flow about the change
          node.data = {
            ...node.data,
            label: nodeName,
          };
        }
        return node;
      })
    );
  }, [nodeName, setNodes]);


  //3.bg color

  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === '1') {
          node.style = { ...node.style, backgroundColor: nodeBg };
        }
        return node;
      })
    );
  }, [nodeBg, setNodes]);



  //4.hidden

  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === '1') {
          node.hidden = nodeHidden;
        }
        return node;
      })
    );
    setEdges((eds) =>
      eds.map((edge) => {
        if (edge.id === 'e1-2') {
          edge.hidden = nodeHidden;
        }
        return edge;
      })
    );
  }, [nodeHidden, setNodes, setEdges]);


  const onNodeClick = (e,val) => {  
    setEditValue(val.data.label)
    setId(val.id)

  }
const handleEdit = () => {
  const res=nodes.map((item)=>{
    if (item.id === id){
      return {...item, data:{label:editValue}}
    }
    return item
  })
  setNodes(res)
}
  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);



  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';

  }, []);


  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');

      // check if the dropped element is valid

      if (typeof type === 'undefined' || !type) {
        return;
      }



      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `${type}` },
      };
      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );


  return (

    <div className="dndflow">

      <ReactFlowProvider>

        <div className='editbar p-3'>

          <div className="updatenode__controls">

            <p>Update Node</p>

            <label>label:</label>



            <input value={nodeName} onChange={(evt) => setNodeName(evt.target.value)} />
            {/* <input value={nodeName} onChange={handleChange} /> */}



            <label className="updatenode__bglabel">background:</label>

            <input value={nodeBg} onChange={(evt) => setNodeBg(evt.target.value)} />

            <div className="updatenode__checkboxwrapper">

              <label>hidden:</label>
              <input

                type="checkbox"

                checked={nodeHidden}

                onChange={(evt) => setNodeHidden(evt.target.checked)}

              />




            </div>



          </div>

        </div>

        <div className="reactflow-wrapper" ref={reactFlowWrapper}>

          <ReactFlow

            nodes={nodes}

            onNodeClick={(e,val)=>onNodeClick (e,val)}

            edges={edges}

            onNodesChange={onNodesChange}

            onEdgesChange={onEdgesChange}

            onConnect={onConnect}

            onInit={setReactFlowInstance}

            onDrop={onDrop}

            onDragOver={onDragOver}

            // fitView

          >

            <Controls />

          </ReactFlow>
<input value={editValue} onChange={(e)=>setEditValue(e.target.value)}/> <button onClick={handleEdit}>edit</button>

        </div>
        <Sidebar />


      </ReactFlowProvider>
    </div>

  );

};



export default DnDFlow;