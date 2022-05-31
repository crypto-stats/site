import { useRouter } from 'next/router'
import { usePlausible } from 'next-plausible'
import styled from 'styled-components'
import SiteModal from 'components/SiteModal'
import { useAdapterList, newModule } from 'hooks/local-adapters'
import { Edit } from 'lucide-react'
import ForkIcon from 'components/icons/Fork'
import { useState } from 'react'

const Button = styled.button`
  border: solid 1px #4b4b4b;
  border-radius: 4px;
  height: 120px;
  display: flex;
  background: transparent;
  align-items: center;
  justify-content: flex-start;
  margin: 20px;
  cursor: pointer;
  text-align: left;
  border: solid 1px #aaa;
  border-radius: 0;
  padding: 16px;

  &:hover {
    background: #eeeeee;
  }

  &:disabled {
    background: #aaaaaa;
  }
`

const ButtonTitle = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #002750;
`
const ButtonSubtitle = styled.div`
  color: #717d8a;
`

const Icon = styled.div`
  display: flex;
  justify-content: center;
  margin-right: 10px;
`

interface ModuleDetails {
  name: string | null
  version: string | null
  // license: string | null
  // description: string | null
  code: string
  // sourceFileCid: string | null
  sourceCode: string | null
  // signer: string | null
  // previousVersion: string | null
}

interface EditModalProps {
  isOpen: boolean
  onClose: () => void
  cid: string
  collectionId: string
  moduleDetails: ModuleDetails
}

const EditModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  cid,
  collectionId,
  moduleDetails,
}) => {
  const router = useRouter()
  const adapters = useAdapterList()
  const plausible = usePlausible()
  const [loading, setLoading] = useState(false)

  const edit = (clone?: boolean) => () => {
    setLoading(true)
    if (!clone) {
      for (const adapter of adapters) {
        for (const publication of adapter.publications || []) {
          if (publication.cid === cid) {
            plausible('edit-adapter', {
              props: {
                collectionId,
                adapter: cid,
                adapterName: moduleDetails.name,
                newAdapter: false,
              },
            })

            router.push({
              pathname: '/editor',
              query: { adapter: adapter.id },
            })
            return
          }
        }
      }
    }

    plausible('edit-adapter', {
      props: {
        collectionId,
        adapter: cid,
        adapterName: moduleDetails.name,
        newAdapter: true,
      },
    })

    const startingCode = moduleDetails.sourceCode || moduleDetails.code
    const newCode =
      moduleDetails.name && clone
        ? startingCode.replace(moduleDetails.name, `${moduleDetails.name} - Clone`)
        : startingCode

    const adapterId = newModule(newCode, [{ cid, version: moduleDetails.version || '0.0.0' }])
    router.push({
      pathname: '/editor',
      query: { adapter: adapterId },
    })
  }

  return (
    <SiteModal
      title={`Edit or fork the "${moduleDetails.name}" adapter`}
      isOpen={isOpen}
      onClose={onClose}
    >
      <Button onClick={edit()} disabled={loading}>
        <Icon>
          <Edit size={36} />
        </Icon>
        <div>
          <ButtonTitle>Edit</ButtonTitle>
          <ButtonSubtitle>Propose an update to the existing adapter</ButtonSubtitle>
        </div>
      </Button>
      <Button onClick={edit(true)} disabled={loading}>
        <Icon>
          <ForkIcon size={36} />
        </Icon>
        <div>
          <ButtonTitle>Fork</ButtonTitle>
          <ButtonSubtitle>Create a new adapter, using this adapter as a template</ButtonSubtitle>
        </div>
      </Button>
    </SiteModal>
  )
}

export default EditModal
