import { NextApiRequest, NextApiResponse } from 'next'
import { CryptoStatsSDK } from '@cryptostats/sdk'
import { ethers } from 'ethers'
import { compileTsToJs } from 'utils/ts-compiler'
import { saveToIPFS } from 'utils/ipfs-upload'
import { handleErrors } from 'utils/api-endpoints'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    throw new Error('Only POST requests allowed')
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

  if (req.body.previousVersion && req.body.previousVersion.length === 46) {
    code += `\nexports.previousVersion = '${req.body.previousVersion}';\n`
  }

  let sourceCID = null;
  if (sourceCode) {
    sourceCID = await saveToIPFS(sourceCode, `${moduleName} - Source`)
    code += `\nexports.sourceFile = '${sourceCID}';\n`
  }

  if (req.body.signature && req.body.hash && req.body.signer) {
    const hash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(code))
    const message = `CryptoStats Adapter Hash: ${hash}`
    if (message !== req.body.hash) {
      throw new Error('Calculated hash does not match')
    }

    const signer = ethers.utils.verifyMessage(message, req.body.signature)
    if (signer !== req.body.signer) {
      throw new Error('Signer does not match')
    }

    code += `\nexports.signer = '${signer}';\nexports.signature = '${req.body.signature}';\n`
  }

  const codeCID = await saveToIPFS(code, moduleName)

  res.json({ success: true, codeCID, sourceCID })
}

export default handleErrors(handler)
