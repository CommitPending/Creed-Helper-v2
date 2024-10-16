import { Col, Row } from 'reactstrap'
import PokeChart from '../components/boxrater/PokeChart'
import PokemonInBox from '../components/boxrater/PokemonInBox'
import RateBox from '../components/boxrater/BoxRater'
import { RecoilRoot } from 'recoil'

const BoxRater = () => {
  return (
    <RecoilRoot>
      <Row>
        <Col lg="12">
          <RateBox />
        </Col>
      </Row>

      <Row>
        <Col lg="12">
          <PokeChart />
        </Col>
        <Col lg="12">
          <PokemonInBox />
        </Col>
      </Row>
      <Row></Row>
    </RecoilRoot>
  )
}

export default BoxRater
