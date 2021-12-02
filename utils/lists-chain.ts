async function query(query: string) {
  const req = await fetch('https://api.thegraph.com/subgraphs/name/dmihal/cryptostats-adapter-registry-test', {
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({ query }),
    method: 'POST',
  });
  const json = await req.json()
  return json.data
}

export async function getListNames(): Promise<string[]> {
  const response = await query(`{
    collections {
      id
    }
  }`)
  return response.collections.map((collection: any) => collection.id)
}

export async function getModulesForList(collection: string): Promise<any[]> {
  const response = await query(`{
    collectionAdapters(where: { collection: "${collection}"}) {
      adapter {
        id
      }
    }
  }`)
  return response.collectionAdapters.map((item: any) => item.adapter.id)
}

export async function getListsForAdapter(adapterCID: string): Promise<string[]> {
  const response = await query(`  {
    adapter(id: "${adapterCID}") {
      collections {
        collection {
          id
        }
      }
    }
  }
`)
  return response.adapter?.collections.map((collection: any) => collection.collection.id) || []
}

export async function getProxyForCollection(collection: string): Promise<string | null> {
  const response = await query(`{
    collection(id: "${collection}") {
      proxy
    }
  }`)
  return response.collection?.proxy || null
}
