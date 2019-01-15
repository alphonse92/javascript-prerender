
import os from 'os'
import cluster from 'cluster'
import initApp from './app'

const nodes = {}
const createNode = () => cluster.fork()
const saveNode = (node) => nodes[node.id] = node
const createAndSaveNode = () => saveNode(createNode())
const deleteNode = (failedNode) => delete nodes[failedNode.id]
const resetNode = (nodeFailed) => deleteNode(nodeFailed) && createAndSaveNode()
const cpus = 1  // os.cpus().length
const initCluster = () => Array.from({ length: cpus }).map(createAndSaveNode)


//NODE_ENV=development npm run-script dev
initApp()


// if (cluster.isMaster) {
//   initCluster()
//   cluster.on('exit', (node) => resetNode(node) && console.log("Node with id", node.id, 'die'));
// } else {
//   initApp()
//   process.on('message', (message) => {
//     if (message.type === 'shutdown') {
//       process.exit(0);
//     }
//   });
// }
