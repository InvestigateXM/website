import React from 'react'
import { isMobile, isAndroid, isIOS } from './os'

export const createExternalNavigationUri = (
  latitude: number,
  longitude: number
) => {
  if (isMobile()) {
    if (isAndroid()) {
      return `geo:${latitude},${longitude}?q=${latitude},${longitude}`
    }
    // Disabled as per "On IOS change map provider to google maps #255"
    // We might re-enable this if we have a user setting to control provider used
    if (isIOS()) {
      // return `maps://?q=${latitude},${longitude}`
    }
  }
  return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`
}

export const getExternalLinkAttributes = () =>
  ({
    rel: 'noreferrer',
    target: '_blank',
  } as React.AnchorHTMLAttributes<HTMLAnchorElement>)
