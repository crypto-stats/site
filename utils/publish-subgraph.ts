import JaysonBrowserClient from 'jayson/lib/client/browser'

const deployKey = 'e2353af0992146488a10938bfddd874d'
const subgraphName = 'dmihal/cs-deploy-test'
const ipfsHash = 'QmYZsXAuyXPnpQMqnRHvYAYVnDiiajyhmxThXruJsYwV83'

export const publishSubgraph = async () => {
  const callServer = function (request: any, callback: any) {
    const options = {
      method: 'POST',
      body: request,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + deployKey,
      },
    }

    fetch('/api/graph-publish', options)
      .then(function (res) {
        return res.text()
      })
      .then(function (text) {
        callback(null, text)
      })
      .catch(function (err) {
        callback(err)
      })
  }

  const client = new JaysonBrowserClient(callServer, {})
  // @ts-ignore
  // client.options.headers = { Authorization: 'Bearer ' + deployKey }

  client.request(
    'subgraph_deploy',
    {
      name: subgraphName,
      ipfs_hash: ipfsHash /* version_label: versionLabel,  debug_fork: debugFork*/,
    },
    async (requestError: any, jsonRpcError: any, res: any) => {
      if (jsonRpcError) {
        console.error(`Failed to deploy to Graph node: ${jsonRpcError.message}`)

        // Provide helpful advice when the subgraph has not been created yet
        if (jsonRpcError.message.match(/subgraph name not found/)) {
          console.warn(`You may need to create it at https://thegraph.com/explorer/dashboard.`)
        }
        process.exitCode = 1
      } else if (requestError) {
        console.error(`HTTP error deploying the subgraph ${requestError.code}`)
        process.exitCode = 1
      } else {
        const base = 'https://thegraph.com'
        let playground = res.playground
        let queries = res.queries
        let subscriptions = res.subscriptions

        // Add a base URL if graph-node did not return the full URL
        if (playground.charAt(0) === ':') {
          playground = base + playground
        }
        if (queries.charAt(0) === ':') {
          queries = base + queries
        }
        if (subscriptions.charAt(0) === ':') {
          subscriptions = base + subscriptions
        }

        console.log(`Deployed to https://thegraph.com/explorer/subgraph/${subgraphName}`)
        console.log('\nSubgraph endpoints:')
        console.log(`Queries (HTTP):     ${queries}`)
        console.log(`Subscriptions (WS): ${subscriptions}`)
        console.log(``)
      }
    }
  )
}
