import { useState, useEffect } from 'react'
import { ethers } from 'ethers'

export const useEtherscanAbi = ({ address }) => {
  const [result, setResult] = useState<any>(null)

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
  const fetchContractAbi = () => {
    fetch(`/api/etherscan/abi`, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ address }),
    })
      .then(res => res.json())
      .then(d => {
        setResult({ ...d, success: d.message === 'OK' })
      })
  }

  return result
}
