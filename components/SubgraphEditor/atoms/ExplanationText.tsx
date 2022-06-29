import styled from 'styled-components'

const Text = styled.span`
  color: #355eff;
  font-weight: bold;

  &:hover {
    cursor: pointer;
  }
`

interface ExplanationTextProps {
  question: string
  answer: string
}

export const ExplanationText = (props: ExplanationTextProps) => {
  const { question, answer } = props

  return (
    <>
      <Text data-tip={answer}>{question}</Text>
    </>
  )
}
