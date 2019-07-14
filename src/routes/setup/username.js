import { route } from 'navi'
import React from 'react'
import styled from 'styled-components/macro'

import Card from 'components/card'
import Icon from 'components/icon'
import { colors } from 'theme'

import wrapRouteWithSetupLayout from './wrapRouteWithSetupLayout'

export const Title = styled.h1`
  color: ${colors.text.default};
  font-size: 2rem;
  font-weight: 400;
  margin-top: 3rem;
  margin-bottom: 0.5rem;
  text-align: center;
`

export const Description = styled.p`
  color: ${colors.text.secondary};
  font-size: 1.1rem;
  font-weight: 300;
  line-height: 1.6rem;
  margin: 1.5rem 0 3.5rem;
  text-align: center;
`

function UsernamePicker(props) {
  return (
    <Card radius="small">
      <Title>
        <Icon glyph="user" size="4rem" color={colors.ink.mid} />
        <br />
        <br />
        What shall I call you?
      </Title>
      <Description />
    </Card>
  )
}

export default wrapRouteWithSetupLayout(
  2,
  route({
    title: 'What shall I call you?',
    view: <UsernamePicker />,
  }),
)
