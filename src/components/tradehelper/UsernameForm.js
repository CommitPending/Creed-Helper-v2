// components/TradeHelper/UsernameForm.js
import React from 'react'
import { Row, Col, FormGroup, Label, Input, Button, Spinner } from 'reactstrap'

const UsernameForm = ({ username, setUsername, handleGetTradeSuggestions, loading }) => (
  <Row form className="align-items-center mb-4">
    <Col md={6}>
      <FormGroup>
        <Label for="username">User to Trade With:</Label>
        <Input
          type="text"
          name="username"
          id="username"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </FormGroup>
    </Col>
    <Col md={6} className="text-md-right">
      <Button
        color="primary"
        onClick={handleGetTradeSuggestions}
        disabled={loading}
        className="mt-3 mt-md-0"
      >
        {loading ? (
          <>
            <Spinner size="sm" /> Generating Suggestions...
          </>
        ) : (
          'Get Trade Suggestions'
        )}
      </Button>
    </Col>
  </Row>
)

export default UsernameForm
