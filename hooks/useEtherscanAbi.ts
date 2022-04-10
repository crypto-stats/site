import { useState, useEffect } from 'react'
import { ethers } from 'ethers'

export enum STATUS {
  READY,
  LOADING,
  COMPLETE,
  NOT_FOUND,
}

const httpFetch = async (url: string, body?: any) => {
  const options = body ? {
    method: 'POST',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify(body),
  } : {}

  const res = await fetch(url, options)
  const json = await res.json()
  return json
}

export const useEtherscanAbi = ({ address }) => {
  const [status, setStatus] = useState(STATUS.READY)
  const [abi, setAbi] = useState<any>(null)

  const isAddressValid = (() => {
    try {
      ethers.utils.getAddress(address)
      return true
    } catch {
      return false
    }
  })()

  useEffect(() => {
    if (isAddressValid) {
      fetchContractAbi()
    }
  }, [isAddressValid])
  
  const fetchContractAbi = async () => {
    setStatus(STATUS.LOADING)

    const json = await httpFetch(`/api/etherscan/abi`, { address })

    if (json.status !== '0') {
      setAbi(JSON.parse(json.result))
      setStatus(STATUS.COMPLETE)
    } else {
      setAbi(null)
      setStatus(STATUS.NOT_FOUND)
    }
  }

  return { abi, status }
}

export const useEtherscanDeployBlock = (address?: string | null) => {
  const [status, setStatus] = useState(STATUS.READY)
  const [deployBlock, setDeployBlock] = useState<number | null>(null)

  const fetchDeployAddress = async (address: string) => {
    const response = await httpFetch(`https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=1&sort=asc`)
    if (response.result && response.result.length === 1 && response.result[0].contractAddress?.length === 42) {
      setDeployBlock(parseInt(response.result[0].contractAddress.blockNumber))
      setStatus(STATUS.COMPLETE)
      return
    }

    const responseInternal = await httpFetch(`https://api.etherscan.io/api?module=account&action=txlistinternal&address=${address}&startblock=0&endblock=99999999&page=1&offset=1&sort=asc`)
    if (responseInternal.result && responseInternal.result.length === 1 && responseInternal.result[0].type === 'create') {
      setDeployBlock(parseInt(responseInternal.result[0].contractAddress.blockNumber))
      setStatus(STATUS.COMPLETE)
      return
    }

    setDeployBlock(null)
    setStatus(STATUS.NOT_FOUND)
  }

  useEffect(() => {
    if (address) {
      fetchDeployAddress(address)
    }
  }, [address])

  return { status, deployBlock }
}
