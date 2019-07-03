import { rgba } from 'polished'
import React, { useState, useRef } from 'react'
import { animated, interpolate, useSpring } from 'react-spring'
import styled, { css } from 'styled-components/macro'
import { colors, mediaQueries } from 'theme'
import { UserAvatar } from 'components/avatar'
import { Spinner } from 'components/loading'
import { CurrentUserVouchCountWrapper } from 'components/badge'
import useMediaQuery from 'hooks/useMedia'
import { StyledNavbarLink } from './styles'
import brandLetter from './brand-letter.svg'
import { useLoadingRoute } from 'react-navi'

const StyledDisc = styled.div`
  display: flex;
  ${props => css`
    height: ${props.size};
    width: ${props.size};
  `}
`
const Disc = props => {
  let lastUserRef = useRef(props.currentUser)
  if (props.currentUser) {
    lastUserRef.current = props.currentUser
  }
  let user = lastUserRef.current

  return (
    <StyledDisc size={props.size} style={{ transform: props.transform }}>
      {user && props.side === 'avatar' ? (
        <UserAvatar user={user} size={props.size} />
      ) : (
        <StyledLogoDisc size={props.size}>
          <img
            alt="Logo"
            src={brandLetter}
            css={css`
              padding: 0.33rem;
              width: ${props.size};
              height: ${props.size};
            `}
          />
        </StyledLogoDisc>
      )}
    </StyledDisc>
  )
}
const AnimatedDisc = animated(Disc)

const StyledLogoDisc = styled(StyledDisc)`
  background-color: ${colors.ink.black};
  color: ${colors.structure.wash};
  align-items: center;
  border-radius: 9999px;
  justify-content: center;
`

const StyledCutout = styled.div`
  align-items: center;
  background-color: ${colors.structure.wash};
  border: 1px solid ${colors.structure.border};
  border-radius: 9999px;
  box-shadow: 0 0 2px ${rgba(0, 0, 0, 0.05)} inset,
    0 0 2px 0px ${rgba(0, 0, 0, 0.1)} inset;
  display: flex;
  justify-content: center;
  position: relative;
  ${props => css`
    height: calc(${props.size} + 6px);
    width: calc(${props.size} + 6px);
  `}
`

const BrandAvatarFlipper = ({
  currentUser,
  sizeRem = 3,
  badgeSizeRem = 1.25,
}) => {
  let config = {
    mass: 1.5,
    tension: 180,
    friction: 16,
  }
  let [flickAngle, setFlickAngle] = useState(0)
  let transitionProps = useSpring({
    config,
    angle: currentUser ? Math.PI : 0,
  })
  let flickProps = useSpring({
    config,
    angle: flickAngle,
  })
  let isPhone = useMediaQuery(mediaQueries.phoneOnly, true)
  let loadingRoute = useLoadingRoute()

  let isLoading = !!loadingRoute || currentUser === undefined

  return (
    <StyledNavbarLink
      exact
      hideActiveIndicator={isPhone}
      href={currentUser ? '/james' : '/'}
      focusRingSize={`${sizeRem - 0.25}rem`}
      onTouchStart={() => {
        setFlickAngle(Math.PI / 6)
      }}
      onMouseDown={() => {
        setFlickAngle(Math.PI / 6)
      }}
      onTouchEnd={() => {
        setFlickAngle(0)
      }}
      onMouseUp={() => {
        setFlickAngle(0)
      }}
      css={css`
        align-items: center;
        display: flex;
        justify-content: center;
        position: relative;
        width: 100%;
      `}>
      <Spinner
        active={isLoading}
        backgroundColor={colors.structure.bg}
        color={colors.ink.black}
        css={css`
          position: absolute;
          z-index: 0;
          height: ${sizeRem}rem;
          width: ${sizeRem}rem;
        `}
      />
      <StyledCutout size={sizeRem - 0.5 + 'rem'}>
        <CurrentUserVouchCountWrapper size={`${badgeSizeRem}rem`}>
          <AnimatedDisc
            currentUser={currentUser}
            transform={interpolate(
              [transitionProps.angle, flickProps.angle],
              (transitionAngle, flickAngle) =>
                `rotateY(${transitionAngle + flickAngle}rad)`,
            )}
            side={interpolate(
              [transitionProps.angle, flickProps.angle],
              (transitionAngle, flickAngle) => {
                // Which side are we on?
                let front =
                  Math.round((transitionAngle + flickAngle) / Math.PI) % 2 === 1

                // Is there an avatar to show?
                let hasAvatar = !!(currentUser || transitionAngle > 0)

                return front && hasAvatar ? 'avatar' : 'brand'
              },
            )}
            size={sizeRem - 0.5 + 'rem'}
          />
        </CurrentUserVouchCountWrapper>
      </StyledCutout>
    </StyledNavbarLink>
  )
}

export default BrandAvatarFlipper
