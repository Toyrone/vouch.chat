import { rgba } from 'polished'
import { compose, withData, withView } from 'navi'
import React from 'react'
import { View, useLinkProps } from 'react-navi'
import styled, { css } from 'styled-components/macro'

import { RegisterButton } from 'components/button'
import { LayoutHeaderContent } from 'components/layout'
import ProfileFlipper from 'components/layout/layoutProfileFlipper'
import { TabletPlus } from 'components/media'
import Tooltip from 'components/tooltip'
import { useCurrentUser } from 'context'
import { colors } from 'theme'

const StyledOnboardingPosition = styled.div`
  display: block;
  height: calc(0.75rem + 1px);
  width: calc(0.75rem + 1px);
  position: absolute;
  left: ${props => props.percentage}%;
  margin-left: -0.375rem;
  top: -0.375rem;
  border-radius: 9999px;
  background-color: ${colors.structure.wash};
  box-shadow: 0 0 0 1.2px ${colors.ink.black} inset,
    0 0 10px ${rgba(colors.ink.black, 0.12)},
    0 0 10px ${rgba(colors.ink.black, 0.12)} inset;
`

const OnboardingPosition = ({
  active,
  complete,
  href,
  percentage,
  tooltip,
}) => {
  let linkProps = useLinkProps({ href })

  return (
    <div style={{ position: 'relative' }}>
      <Tooltip content={tooltip} placement="bottom">
        <StyledOnboardingPosition
          as={href ? 'a' : 'div'}
          {...(href ? linkProps : {})}
          percentage={percentage}>
          {(active || complete) && (
            <InnerOnboardingPosition
              color={active ? colors.ink.mid : colors.ink.black}
            />
          )}
        </StyledOnboardingPosition>
      </Tooltip>
    </div>
  )
}

const InnerOnboardingPosition = styled.div`
  position: absolute;
  height: calc(0.5rem + 1px);
  width: calc(0.5rem + 1px);
  left: 0.125rem;
  top: 0.125rem;
  background-color: ${props => props.color};
  border-radius: 9999px;
`

const OnboardingFlowIndicator = ({ step, user }) => {
  return (
    <div
      css={css`
        position: relative;
        margin: 0 calc(0.375rem + 1px);
      `}>
      <div
        css={css`
          border-radius: 9999px;
          box-shadow: 0 0 0 1px ${colors.ink.black} inset,
            0 0 10px 0px ${rgba(colors.ink.black, 0.33)},
            0 0 3px 1px ${rgba(colors.ink.black, 0.1)};
          width: 200px;
          height: 1px;
        `}
      />
      <OnboardingPosition
        href={user && !user.hasActiveSubscription && '/wigs'}
        percentage={0}
        active={step === 1}
        complete={step > 1}
        tooltip="Pick your wig"
      />
      <OnboardingPosition
        href={
          user &&
          user.hasChosenPlan &&
          user.canSetUsername &&
          !user.username &&
          '/setup/username'
        }
        percentage={33}
        active={step === 2}
        complete={step > 2}
        tooltip="Pick your username"
      />
      <OnboardingPosition
        percentage={66}
        active={step === 3}
        complete={step > 3}
        tooltip="Create your profile"
      />
      <OnboardingPosition
        percentage={100}
        active={step === 4}
        complete={step > 4}
        tooltip="Make a cast"
      />
    </div>
  )
}

function SetupLayout({ step }) {
  let user = useCurrentUser()
  let onboardingIndicator = <OnboardingFlowIndicator step={step} user={user} />
  let actions = user ? onboardingIndicator : <RegisterButton />

  return (
    <div
      css={css`
        padding: 0 1rem;
      `}>
      <TabletPlus>
        <LayoutHeaderContent actions={actions} />
      </TabletPlus>
      {/* <PhoneOnly
        css={css`
          height: 2rem;
          width: 160px;
          margin: 1rem auto 0;
        `}>
        {onboardingIndicator}
      </PhoneOnly> */}
      <div
        css={css`
          margin: 0 auto 2rem;
          max-width: 800px;
        `}>
        <View />
      </div>
    </div>
  )
}

export default function wrapRouteWithSetupLayout(step, route) {
  return compose(
    withData({
      minimalLayout: true,
      layoutHeaderTitle: null,
      layoutHeaderActions: (
        <ProfileFlipper style={{ marginRight: '1rem' }} withoutSpinner />
      ),
    }),
    withView(<SetupLayout step={step} />),
    route,
  )
}
