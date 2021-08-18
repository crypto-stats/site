import * as fs from 'fs'
import { NextApiRequest, NextApiResponse } from 'next'
import pinataSDK from '@pinata/sdk'
import { CryptoStatsSDK } from '@cryptostats/sdk'
import { compileTsToJs } from 'utils/ts-compiler'

const filePath = '/tmp/upload.txt';

async function saveToIPFS(file: string, name: string): Promise<string> {
  if (!process.env.PINATA_KEY || !process.env.PINATA_SECRET) {
    throw new Error('Pinata key missing')
  }

  const pinata = pinataSDK(process.env.PINATA_KEY, process.env.PINATA_SECRET)
  fs.writeFileSync(filePath, file);
  const response = await pinata.pinFromFS(filePath, {
    pinataMetadata: {
      name,
      // @ts-ignore
      keyvalues: {
        type: 'module',
      },
    },
  });

  return response.IpfsHash;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.status(400).send({ message: 'Only POST requests allowed' })
    return
  }

  let code = req.body.code
  let sourceCode = null

  if (req.body.language = 'typescript') {
    sourceCode = req.body.code
    code = await compileTsToJs(req.body.code)
  }

  const sdk = new CryptoStatsSDK()
  const list = sdk.getList('Test')
  const module = list.addAdaptersWithCode(code)
  const moduleName = module.name
  if (!moduleName) {
    throw new Error('Module must export a name')
  }

  let sourceCID = null;
  if (sourceCode) {
    sourceCID = await saveToIPFS(sourceCode, `${moduleName} - Source`)
    code += `\nexports.sourceFile = '${sourceCID}';\n`
  }

  const codeCID = await saveToIPFS(code, moduleName)

  res.json({ success: true, codeCID, sourceCID })
}

export default handler
