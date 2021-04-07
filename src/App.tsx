import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import { Layout } from 'antd'
import { Header } from 'antd/es/layout/layout'
import Navbar from './components/navbar'
import { About } from './pages/About'
import { Home } from './pages/Home'
import { Map } from './pages/Map'

import './App.less'
import BannerList from './components/banner-list'

const App: React.FC = () => {
  return (
    <Layout>
      <BrowserRouter>
        <Layout>
          <Header className="px-1">
            <Navbar />
          </Header>
        </Layout>
        <Layout>
          <div className="container">
            <Switch>
              <Route path="/" component={Home} exact />
              <Route path="/about" component={About} />
              <Route path="/map" component={Map} />
              <Route path="/favorites" component={BannerList} />
              <Route path="/banner/:id" component={Map} />
            </Switch>
          </div>
        </Layout>
      </BrowserRouter>
    </Layout>
  )
}

export default App
