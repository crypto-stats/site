import { useState, useEffect } from 'react'

// todo: make this a package
async function getName(address: string) {
  // @ts-ignore
  const namehash = await import('eth-ens-namehash')
  console.log(`${address.substr(2)}.addr.reverse`)
  const node = namehash.hash(`${address.substr(2)}.addr.reverse`)
  const req = await fetch('https://cloudflare-eth.com/', {
    'headers': {
      'content-type': "application/json",
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'eth_call',
      id: 1,
      params: [
        {
          from: '0x0000000000000000000000000000000000000000',
          data: `0x691f3431${node.substr(2)}`,
          to: '0xa2c122be93b0074270ebee7f6b7292c7deb45047',
        },
        'latest',
      ],
    }),
    method: 'POST',
  })
  const response = await req.json()
  const length = parseInt(response.result.substr(66,64), 16)
  if (length === 0) {
    return null
  }
  const nameHex = response.result.substr(130, length * 2)
  const name = Buffer.from(nameHex,'hex').toString()
  return name
}
// 0x691f34312c34b42e0349ca7ac7ea0b7a409887b3c963d87808c11eac3d5a0418e9be3223
// 0x691f3431f285235da249c6648bad84b1181565560da963169026f501b599990dcbfa03ee

export const useENSName = (address?: string | null, defaultName?: string) => {
  const [name, setName] = useState<string | null>(null)

  useEffect(() => {
    if (address) {
      getName(address).then(setName)
    } else {
      setName(null)
    }
  }, [address])

  return name || defaultName || null
}
