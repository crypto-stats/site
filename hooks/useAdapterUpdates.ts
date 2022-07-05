import { useEffect, useState } from 'react'
import { getPreviousVersions, Version as BaseVersion } from 'utils/lists-chain'
import semver from 'semver'

interface Version extends BaseVersion {
  version: string
}

const REFRESH_CACHE = 5 * 60 * 1000

const availableUpdateCache: {
  [cid: string]: { updatesPromise: Promise<Version[]>; lastChecked: number }
} = {}

async function getAvailableUpdates(cid: string, versionNum: string): Promise<Version[]> {
  const allVersions = await getPreviousVersions(cid)
  const newVersions = allVersions.filter(
    version => version.version && semver.gt(version.version, versionNum)
  )
  return newVersions as Version[]
}

export const useAdapterUpdates = (cid?: string, version?: string) => {
  const [availableUpdates, setAvailableUpdates] = useState<Version[]>([])

  useEffect(() => {
    if (cid && version) {
      if (
        !availableUpdateCache[cid] ||
        Date.now() - availableUpdateCache[cid].lastChecked > REFRESH_CACHE
      ) {
        availableUpdateCache[cid] = {
          updatesPromise: getAvailableUpdates(cid, version),
          lastChecked: Date.now(),
        }
      }
      availableUpdateCache[cid].updatesPromise.then(setAvailableUpdates)
    } else {
      setAvailableUpdates([])
    }
  }, [cid])

  return availableUpdates
}
