// components/TradeHelper/TradingForList.js
import React from 'react'
import { Row, Col, FormGroup, Label, Input, Button, Card, CardBody, CardTitle } from 'reactstrap'

const TradingForList = ({
  tradingForList,
  handleTradingForChange,
  fetchCostIfEmpty,
  removeTradingForItem,
  addTradingForItem,
  totalTradingForValue,
  formatNumber,
}) => (
  <Card className="mb-4">
    <CardBody>
      <CardTitle tag="h4" className="mb-3">
        Trading For
      </CardTitle>
      {tradingForList.map((item) => (
        <Row form key={item.id} className="align-items-end">
          <Col md={2}>
            <FormGroup>
              <Label for={`type-${item.id}`}>Type</Label>
              <Input
                type="select"
                id={`type-${item.id}`}
                value={item.type}
                onChange={(e) => handleTradingForChange(item.id, 'type', e.target.value)}
              >
                <option>Golden</option>
                <option>Cursed</option>
                <option>Luminous</option>
                <option>Shadow</option>
                <option>Rainbow</option>
              </Input>
            </FormGroup>
          </Col>
          <Col md={3}>
            <FormGroup>
              <Label for={`name-${item.id}`}>Name</Label>
              <Input
                type="text"
                id={`name-${item.id}`}
                value={item.name}
                onChange={(e) => handleTradingForChange(item.id, 'name', e.target.value)}
                onBlur={() => fetchCostIfEmpty(item.id)}
              />
            </FormGroup>
          </Col>
          <Col md={2}>
            <FormGroup>
              <Label for={`cost-${item.id}`}>Cost</Label>
              <Input
                type="text"
                id={`cost-${item.id}`}
                value={item.cost}
                onChange={(e) => handleTradingForChange(item.id, 'cost', e.target.value)}
              />
            </FormGroup>
          </Col>
          <Col md={1}>
            <FormGroup>
              <Label for={`currency-${item.id}`}>Currency</Label>
              <Input
                type="select"
                id={`currency-${item.id}`}
                value={item.currency}
                onChange={(e) => handleTradingForChange(item.id, 'currency', e.target.value)}
              >
                <option>K</option>
                <option>M</option>
              </Input>
            </FormGroup>
          </Col>
          <Col md={1}>
            {tradingForList.length > 1 && (
              <Button
                color="danger"
                size="sm"
                onClick={() => removeTradingForItem(item.id)}
                className="mt-2"
              >
                Remove
              </Button>
            )}
          </Col>
        </Row>
      ))}
      <Button color="success" size="sm" onClick={addTradingForItem} className="mt-3">
        + Add Item
      </Button>
      <h5 className="mt-4">Total Trading For Value: {formatNumber(totalTradingForValue)}</h5>
    </CardBody>
  </Card>
)

export default TradingForList
