import ERC20 from './IERC20.json'
import ERC721 from './IERC721.json'

interface Template {
  id: string
  name?: string
  abi: any
}

export const templates: Template[] = [
  {
    id: 'ERC20',
    abi: ERC20,
  },
  {
    id: 'ERC721',
    abi: ERC721,
  },
]
