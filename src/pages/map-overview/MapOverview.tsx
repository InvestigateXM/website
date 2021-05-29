import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { StaticContext } from 'react-router'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { Col, Row } from 'antd'
import { LatLngBounds } from 'leaflet'
import Scrollbars from 'react-custom-scrollbars'

import { RootState } from '../../storeTypes'
import {
  Banner,
  getMapBanners,
  loadMapBanners,
  loadBanner,
  getBanner as getBannerSelector,
  extendSorted,
} from '../../features/banner'
import BannerList from '../../components/banner-list'
import BannersMap from '../../components/banners-map'
import BannersAccordion from '../../components/banners-accordion'

import './map.less'

class MapOverview extends React.Component<MapOverviewProps, MapOverviewState> {
  constructor(props: MapOverviewProps) {
    super(props)
    this.state = {
      bounds: undefined,
      selectedBannerId: undefined,
      selectedBounds: undefined,
      status: 'initial',
    }
  }

  onMapChanged = (bounds: LatLngBounds) => {
    this.setState({ bounds })
    this.onLoadBanners(bounds)
  }

  onSelectBanner = async (banner: Banner | undefined) => {
    const { fetchPreviewBanner, location, history } = this.props
    const { selectedBannerId, bounds } = this.state
    if (banner && selectedBannerId !== banner.id) {
      this.setState({ status: 'loading' })
      await fetchPreviewBanner(banner.id)
      // const selectedId = location.state.selectedBannerId
      // if (selectedId !== banner.id) {
      //   history.push({
      //     pathname: location.pathname,
      //     search: location.search,
      //     state: { selectedBannerId: banner.id },
      //   })
      // }
      this.setState({
        selectedBannerId: banner.id,
        status: 'ready',
        selectedBounds: bounds,
      })
    } else {
      const selectedId = location.state.selectedBannerId
      if (selectedId !== undefined) {
        history.push({
          pathname: location.pathname,
          search: location.search,
          state: { selectedBannerId: undefined },
        })
      }
      this.setState({ selectedBannerId: undefined, selectedBounds: undefined })
    }
  }

  onLoadBanners = async (bounds: LatLngBounds) => {
    const { fetchBanners } = this.props
    if (bounds) {
      this.setState({ status: 'loading' })
      try {
        const norhtEast = bounds.getNorthEast()
        const southWest = bounds.getSouthWest()
        if (Math.abs(norhtEast.lng - southWest.lng) >= 360) {
          await fetchBanners(norhtEast.lat, 180, southWest.lat, -180)
        }
        await fetchBanners(
          norhtEast.lat,
          norhtEast.wrap().lng,
          southWest.lat,
          southWest.wrap().lng
        )
        this.setState({ status: 'ready' })
      } catch {
        this.setState({ status: 'error' })
      }
    }
  }

  render() {
    const { getBanners, getBanner } = this.props
    const { bounds, selectedBannerId, status, selectedBounds } = this.state
    let banners: Array<Banner> = []
    const boundsToUse = selectedBounds ?? bounds
    if (boundsToUse) {
      const norhtEast = boundsToUse.getNorthEast()
      const southWest = boundsToUse.getSouthWest()
      // If there are banners on the other side of the new day line, show them with modified coordinates
      if (norhtEast.lng > 180) {
        const bannersAux = getBanners(
          norhtEast.lat,
          norhtEast.lng - 360,
          southWest.lat,
          -180
        )
        banners = extendSorted(
          bannersAux.map((b) => ({
            ...b,
            startLongitude: b.startLongitude + 360,
          })),
          banners
        )
      }
      if (southWest.lng < -180) {
        const bannersAux = getBanners(
          norhtEast.lat,
          180,
          southWest.lat,
          southWest.lng + 360
        )
        banners = extendSorted(
          bannersAux.map((b) => ({
            ...b,
            startLongitude: b.startLongitude - 360,
          })),
          banners
        )
      }
      banners = extendSorted(
        getBanners(norhtEast.lat, norhtEast.lng, southWest.lat, southWest.lng),
        banners
      )
    }
    if (selectedBannerId) {
      const selectedBanner = getBanner(selectedBannerId)
      if (selectedBanner) {
        banners = extendSorted(banners, [selectedBanner])
      }
    }
    return (
      <Fragment>
        <Helmet>
          <title>Map</title>
        </Helmet>
        <Row className="map-overview">
          <Col className="map-banners hide-on-mobile">
            <h2>Banners in This Area</h2>
            <Scrollbars className="banners-scroll">
              <BannerList
                banners={banners}
                hasMoreBanners={false}
                selectedBannerId={selectedBannerId}
                onSelectBanner={this.onSelectBanner}
              />
            </Scrollbars>
          </Col>
          <Col className="map-explorer">
            <BannersMap
              banners={banners}
              onMapChanged={this.onMapChanged}
              selectedBannerId={selectedBannerId}
              onSelectBanner={this.onSelectBanner}
              loading={status === 'loading'}
            />
            <BannersAccordion
              banners={banners}
              hasMoreBanners={false}
              selectedBannerId={selectedBannerId}
              onSelectBanner={this.onSelectBanner}
            />
          </Col>
        </Row>
      </Fragment>
    )
  }
}
export interface MapOverviewProps
  extends RouteComponentProps<
    {},
    StaticContext,
    { selectedBannerId?: string }
  > {
  getBanners: (
    topRightLat: number,
    topRightLng: number,
    bottomLeftLat: number,
    bottomLeftLng: number
  ) => Array<Banner>
  fetchBanners: (
    topRightLat: number,
    topRightLng: number,
    bottomLeftLat: number,
    bottomLeftLng: number
  ) => Promise<void>
  fetchPreviewBanner: (id: string) => Promise<void>
  getBanner: (bannerId: string) => Banner | undefined
}

interface MapOverviewState {
  bounds: LatLngBounds | undefined
  selectedBannerId: string | undefined
  selectedBounds: LatLngBounds | undefined
  status: 'initial' | 'loading' | 'ready' | 'error'
}

const mapStateToProps = (state: RootState) => ({
  getBanners: (
    topRightLat: number,
    topRightLng: number,
    bottomLeftLat: number,
    bottomLeftLng: number
  ) =>
    getMapBanners(
      state,
      topRightLat,
      topRightLng,
      bottomLeftLat,
      bottomLeftLng
    ),
  getBanner: (bannerId: string) => getBannerSelector(state, bannerId),
})

const mapDispatchToProps = {
  fetchBanners: loadMapBanners,
  fetchPreviewBanner: loadBanner,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(MapOverview))
