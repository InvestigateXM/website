import React, { Fragment, FC } from 'react'
import { Row } from 'antd'
import { Link, generatePath } from 'react-router-dom'

import { Banner } from '../../features/banner'
import BannerCard from '../banner-card'

import './banner-list.less'
import { useInfiniteScroll } from '../../hooks/InfiniteScroll'

const BannerList: FC<BannerListProps> = ({
  banners,
  hasMoreBanners,
  loadMoreBanners,
}) => {
  const [ref] = useInfiniteScroll({
    callback: loadMoreBanners,
  })

  if (banners && banners.length > 0) {
    return (
      <Fragment>
        <div className="banner-list">
          {banners?.map((bannerItem) => (
            <div key={bannerItem.uuid} className="banner-list-item">
              <Link
                to={generatePath('/banner/:uuid', { uuid: bannerItem.uuid })}
                title={bannerItem.title}
              >
                <BannerCard banner={bannerItem} key={bannerItem.uuid} />
              </Link>
            </div>
          ))}
          {hasMoreBanners && (
            <div ref={ref} className="banner-card">
              Loading more items...
            </div>
          )}
        </div>
      </Fragment>
    )
  }
  return (
    <Fragment>
      <Row>Loading...</Row>
    </Fragment>
  )
}

export interface BannerListProps {
  banners: Array<Banner> | undefined
  hasMoreBanners: Boolean
  loadMoreBanners?: () => Promise<void>
}

export default BannerList
