import React from "react"
import Link from "next/link"
import styled from "styled-components"
import Text from "components/Text"
import RowSection from "components/RowSection"
import ColumnSection from "components/ColumnSection"
import Button from "components/Button"

const HeroCtas = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: var(--spaces-3);
`

const Image = styled.img`
  width: 100%;
  height: auto;
`

const Hero: React.FC = () => {
  return (
    <RowSection mt='60' alignItems='center'>
      <ColumnSection columns='5'>
        <Text tag='h1' type='display' mb='40'>
          How it works
        </Text>
        <Text tag='h2' type='content_display' mb='40'>
          It's easy: just <strong>publish an adapter</strong> or <strong>use the Dataset</strong>{" "}
          created by the Comunity to create and view anything you want.
        </Text>
        <HeroCtas>
          <Link href='/editor' passHref>
            <Button variant='outline' size='large' fullWidth>
              Create adapter
            </Button>
          </Link>
          <Link href='/discover' passHref>
            <Button variant='outline' size='large' fullWidth>
              Discover collections
            </Button>
          </Link>
        </HeroCtas>
        <Text tag='h2' type='content' mt='64'>
          <strong>Ok but how?</strong> Answers below.
        </Text>
      </ColumnSection>

      <ColumnSection from='7' to='13'>
        <Image src='image-howitworks.png' alt='How Cryptostats works' />
      </ColumnSection>
    </RowSection>
  )
}

export default Hero
