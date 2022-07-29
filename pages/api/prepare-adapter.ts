import { NextApiRequest, NextApiResponse } from 'next'
import { ethers } from 'ethers'
import { CryptoStatsSDK } from '@cryptostats/sdk'
import { compileTsToJs } from 'utils/ts-compiler'
import { saveToIPFS } from 'utils/ipfs-upload'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.status(400).send({ message: 'Only POST requests allowed' })
    return
  }

  let code = req.body.code
  let sourceCode = null

  if ((req.body.language = 'typescript')) {
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

  if (req.body.previousVersion && req.body.previousVersion.length === 46) {
    code += `\nexports.previousVersion = '${req.body.previousVersion}';\n`
  }

  let sourceCID = null
  if (sourceCode) {
    sourceCID = await saveToIPFS(sourceCode)
    code += `\nexports.sourceFile = '${sourceCID}';\n`
  }

  const hash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(code))

  res.json({ success: true, code, hash })
}

export default handler
