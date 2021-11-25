async function query(query: string) {
  const req = await fetch('https://api.thegraph.com/subgraphs/name/dmihal/stateless-list-registry-kovan', {
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
    lists {
      id
    }
  }`)
  return response.lists.map((list: any) => list.id)
}

export async function getModulesForList(list: string): Promise<any[]> {
  const response = await query(`{
    listAdapters(where: { list: "${list}"}) {
      adapter {
        id
      }
    }
  }`)
  return response.listAdapters.map((item: any) => item.adapter.id)
}

export async function getListsForAdapter(list: string): Promise<string[]> {
  const response = await query(`  {
    adapter(id: "${list}") {
      lists {
        list {
          id
        }
      }
    }
  }
`)
  return response.adapter?.lists.map((list: any) => list.list.id) || []
}
