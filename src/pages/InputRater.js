import { Col, Row } from 'reactstrap'
import PokeChart from '../components/boxrater/PokeChart'
import PokemonInBox from '../components/boxrater/PokemonInBox'
import FieldRater from '../components/boxrater/FieldRater'
import { RecoilRoot } from 'recoil'

const InputRater = () => {
  return (
    <RecoilRoot>
      <Row>
        <Col lg="12">
          <FieldRater />
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

export default InputRater
