import { Col, Row } from 'reactstrap'
import PokeChart from '../components/boxrater/PokeChart'
import Feeds from '../components/boxrater/PokemonInBox'
import ProjectTables from '../components/boxrater/BoxRater'
import { RecoilRoot } from 'recoil'

const BoxRater = () => {
  return (
    <RecoilRoot>
      <Row>
        <Col lg="12">
          <ProjectTables />
        </Col>
      </Row>

      <Row>
        <Col lg="12">
          <PokeChart />
        </Col>
        <Col lg="12">
          <Feeds />
        </Col>
      </Row>
      <Row></Row>
    </RecoilRoot>
  )
}

export default BoxRater
