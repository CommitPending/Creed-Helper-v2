// QuickTrade.js
import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardBody,
  CardTitle,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Alert,
  Col,
  Row,
  ListGroup,
  ListGroupItem,
  Spinner,
  Collapse,
  UncontrolledTooltip,
} from 'reactstrap';
import { useSetRecoilState } from 'recoil';
import { categorizedTotalsState } from '../components/recoil/recoilState'; // Import the Recoil atom
import PokeChart from '../components/boxrater/PokeChart'; // Import the PokeChart component

const QuickTrade = () => {
  // State for 'Trading For' portion
  const [tradingForList, setTradingForList] = useState([
    { id: 1, type: 'Golden', name: '', cost: '', currency: 'K' },
  ]);

  const [totalTradingForValue, setTotalTradingForValue] = useState(0);

  // State for username and options
  const [username, setUsername] = useState('');
  const [excludedTypes, setExcludedTypes] = useState({
    Golden: false,
    Cursed: false,
    Luminous: false,
    Shadow: false,
    Rainbow: false,
    unbased: false,
  });

  const [usePercentages, setUsePercentages] = useState(false);

  const [percentages, setPercentages] = useState({
    Golden: 20,
    Cursed: 20,
    Luminous: 20,
    Shadow: 20,
    Rainbow: 20,
  });

  const [excludePokemonList, setExcludePokemonList] = useState([]);
  const [excludePokemon, setExcludePokemon] = useState({
    type: 'Golden',
    name: '',
  });

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // State for trade suggestions
  const [tradeSuggestions, setTradeSuggestions] = useState([]);
  const [tradingForDetails, setTradingForDetails] = useState([]);

  // Rates cache to reduce API calls
  const ratesCacheRef = useRef({});

  // Recoil state setters
  const setCategorizedTotals = useSetRecoilState(categorizedTotalsState);

  // Handle changes in 'Trading For' list
  const handleTradingForChange = (id, field, value) => {
    setTradingForList((prevList) =>
      prevList.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  // Add a new item to 'Trading For' list
  const addTradingForItem = () => {
    setTradingForList((prevList) => [
      ...prevList,
      {
        id: prevList.length > 0 ? prevList[prevList.length - 1].id + 1 : 1,
        type: 'Golden',
        name: '',
        cost: '',
        currency: 'K',
      },
    ]);
  };

  // Remove an item from 'Trading For' list
  const removeTradingForItem = (id) => {
    setTradingForList((prevList) => prevList.filter((item) => item.id !== id));
  };

  // Fetch cost if the cost field is empty
  const fetchCostIfEmpty = async (id) => {
    const item = tradingForList.find((i) => i.id === id);
    if (item && item.cost.trim() === '') {
      const { type, name } = item;
      if (name.trim() !== '') {
        const combinedName = `${type}${name}`;
        try {
          const response = await fetch(
            `https://pokemoncreed.net/ajax/pokedex.php?pokemon=${encodeURIComponent(
              combinedName.toLowerCase()
            )}`
          );
          const data = await response.json();
          const rate = data.rating || 'N/A';
          if (rate === 'N/A') {
            setMessage(`Rate for ${combinedName} is not available.`);
            return;
          }
          let formattedCost;
          let currency;
          if (rate.includes('m')) {
            formattedCost = parseFloat(rate.replace('m', '')); // e.g., '1.5m' => 1.5
            currency = 'M';
          } else if (rate.includes('k')) {
            formattedCost = parseFloat(rate.replace('k', '')); // e.g., '500k' => 500
            currency = 'K';
          } else {
            formattedCost = parseFloat(rate);
            currency = '';
          }
          // Update the cost field
          setTradingForList((prevList) =>
            prevList.map((i) =>
              i.id === id ? { ...i, cost: formattedCost.toString(), currency } : i
            )
          );
        } catch (error) {
          console.error('Error fetching cost:', error);
          setMessage(`Error fetching cost for ${combinedName}.`);
        }
      }
    }
  };

  // Fetch costs for all items with empty cost fields before generating suggestions
  const fetchCostsForAll = async () => {
    const fetchPromises = tradingForList.map(async (item) => {
      if (item.cost.trim() === '') {
        await fetchCostIfEmpty(item.id);
      }
    });
    await Promise.all(fetchPromises);
  };

  // Calculate total 'Trading For' value whenever the list changes
  useEffect(() => {
    let total = 0;
    tradingForList.forEach((item) => {
      let cost = parseFloat(item.cost);
      if (isNaN(cost)) cost = 0;
      if (item.currency === 'M') {
        cost *= 1_000_000;
      } else if (item.currency === 'K') {
        cost *= 1_000;
      }
      total += cost;
    });
    setTotalTradingForValue(total);
  }, [tradingForList]);

  // Handle exclude type changes
  const handleExcludeTypeChange = (type, checked) => {
    setExcludedTypes((prev) => ({
      ...prev,
      [type]: checked,
    }));

    // Adjust percentages
    setPercentages((prevPercentages) => {
      const newPercentages = { ...prevPercentages };

      if (checked) {
        // Type is being excluded
        const excludedPercentage = newPercentages[type] || 0;
        delete newPercentages[type];

        const remainingTypes = Object.keys(newPercentages);
        const totalRemaining = remainingTypes.reduce(
          (sum, t) => sum + newPercentages[t],
          0
        );

        // Redistribute the excluded percentage among remaining types proportionally
        remainingTypes.forEach((t) => {
          newPercentages[t] += (newPercentages[t] / totalRemaining) * excludedPercentage;
        });
      } else {
        // Type is being included
        const includedTypes = Object.keys(newPercentages);
        const totalIncluded = includedTypes.reduce(
          (sum, t) => sum + newPercentages[t],
          0
        );

        // Add the type with 0% initially
        newPercentages[type] = 0;

        // Adjust percentages to sum to 100%
        Object.keys(newPercentages).forEach((t) => {
          newPercentages[t] = (newPercentages[t] / totalIncluded) * 100;
        });
      }

      return newPercentages;
    });
  };

  // Handle percentage changes
  const handlePercentageChange = (type, value) => {
    value = Number(value);
    if (value < 0) value = 0;
    if (value > 100) value = 100;

    setPercentages((prevPercentages) => {
      const adjustedPercentages = { ...prevPercentages };
      const oldValue = adjustedPercentages[type];
      const diff = value - oldValue;
      adjustedPercentages[type] = value;

      const otherTypes = Object.keys(adjustedPercentages).filter(
        (t) => t !== type && !excludedTypes[t]
      );

      let totalOtherPercentages = otherTypes.reduce(
        (sum, t) => sum + adjustedPercentages[t],
        0
      );

      otherTypes.forEach((t) => {
        const proportion = adjustedPercentages[t] / totalOtherPercentages || 0;
        adjustedPercentages[t] -= proportion * diff;
        if (adjustedPercentages[t] < 0) adjustedPercentages[t] = 0;
        if (adjustedPercentages[t] > 100) adjustedPercentages[t] = 100;
      });

      // Normalize percentages to sum to 100%
      const totalPercentage = Object.values(adjustedPercentages).reduce(
        (a, b) => a + b,
        0
      );
      if (totalPercentage !== 100) {
        const adjustment = 100 - totalPercentage;
        // Adjust the first non-excluded type
        for (const t of Object.keys(adjustedPercentages)) {
          if (t !== type && !excludedTypes[t]) {
            adjustedPercentages[t] += adjustment;
            break;
          }
        }
      }

      return adjustedPercentages;
    });
  };

  // Add a Pokémon to exclude list
  const addPokemonToExclude = () => {
    if (excludePokemon.name.trim() !== '') {
      setExcludePokemonList((prevList) => [...prevList, { ...excludePokemon }]);
      setExcludePokemon({ type: 'Golden', name: '' });
    }
  };

  // Remove a Pokémon from exclude list
  const removeExcludedPokemon = (index) => {
    setExcludePokemonList((prevList) => prevList.filter((_, i) => i !== index));
  };

  // Format numbers with K, M suffixes
  const formatNumber = (num) => {
    if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(2) + 'M';
    } else if (num >= 1_000) {
      return (num / 1_000).toFixed(2) + 'K';
    } else {
      return num.toString();
    }
  };

  // Function to group and format the Pokémon data
  const groupPokemon = (pokemonList) => {
    const grouped = {};
    const typeTotals = {
      Luminous: 0,
      Cursed: 0,
      Golden: 0,
      Rainbow: 0,
      Shadow: 0,
    };

    pokemonList.forEach((pokemon) => {
      const key = `${pokemon.name} ${pokemon.gender || ''} - Level: ${pokemon.level}`;
      if (!grouped[key]) {
        grouped[key] = { ...pokemon, count: 1 };
      } else {
        grouped[key].count += 1;
      }

      // Calculate totals per type for the chart
      if (typeTotals[pokemon.type] !== undefined) {
        typeTotals[pokemon.type] += pokemon.rate;
      }
    });

    // Update the categorized totals state in Recoil
    setCategorizedTotals(typeTotals);

    // Convert the grouped object into an array for rendering
    return Object.entries(grouped).map(([key, details]) => {
      const totalRate = details.rate * details.count;
      return {
        ...details,
        display: `${details.count}x ${details.name} ${
          details.gender ? `(${details.gender})` : ''
        } - Level: ${details.level} [${formatNumber(totalRate)}]`,
      };
    });
  };

  // Main function to get trade suggestions
  const handleGetTradeSuggestions = async () => {
    setLoading(true);
    setMessage('');
    setTradeSuggestions([]);
    setTradingForDetails(tradingForList);

    // Fetch costs for all items with empty cost fields
    await fetchCostsForAll();

    // Recalculate total trading value
    let total = 0;
    tradingForList.forEach((item) => {
      let cost = parseFloat(item.cost);
      if (isNaN(cost)) cost = 0;
      if (item.currency === 'M') {
        cost *= 1_000_000;
      } else if (item.currency === 'K') {
        cost *= 1_000;
      }
      total += cost;
    });
    setTotalTradingForValue(total);

    try {
      // Fetch the user's box
      const response = await fetch(
        `https://pokemoncreed.net/ajax/box.php?user=${username}`
      );
      const data = await response.json();

      if (data.success) {
        const result = data.data;
        const uname = result.name;

        // Excluded types and Pokémon
        const excludedTypeList = Object.keys(excludedTypes).filter(
          (type) => excludedTypes[type]
        );

        // Map of excluded Pokémon names with types
        const excludedPokemonMap = {};
        excludePokemonList.forEach((item) => {
          const key = `${item.type.toLowerCase()}${item.name.toLowerCase()}`;
          excludedPokemonMap[key] = true;
        });

        const coloreds = ['Cursed', 'Golden', 'Luminous', 'Rainbow', 'Shadow'];

        let availablePokemon = [];

        // Process the box
        result.pokemon.forEach((poke) => {
          if (poke.loan === '0') {
            const pokeName = poke.name;
            const lowerPokeName = pokeName.toLowerCase();

            // Check if the Pokémon is of a colored type
            const pokeType = coloreds.find((color) =>
              lowerPokeName.startsWith(color.toLowerCase())
            );
            if (pokeType && !excludedTypeList.includes(pokeType)) {
              // Check if the Pokémon is in the excluded Pokémon list
              const nameWithoutType = lowerPokeName.replace(
                pokeType.toLowerCase(),
                ''
              );
              const excludeKey = `${pokeType.toLowerCase()}${nameWithoutType}`;
              if (!excludedPokemonMap[excludeKey]) {
                // Check for unbased exclusion
                if (!(excludedTypes['unbased'] && poke.level > 5)) {
                  availablePokemon.push({
                    name: poke.name,
                    gender: poke.gender,
                    level: poke.level,
                    type: pokeType,
                  });
                }
              }
            }
          }
        });

        if (availablePokemon.length === 0) {
          setMessage(`${uname} has no available Pokémon for trading.`);
          setLoading(false);
          return;
        }

        // Fetch rates for available Pokémon
        const foundRates = await fetchRates(
          Array.from(new Set(availablePokemon.map((p) => p.name.toLowerCase())))
        );

        // Attach rates to Pokémon
        availablePokemon = availablePokemon.map((poke) => ({
          ...poke,
          rate: foundRates[poke.name.toLowerCase()] || 0,
        }));

        // Filter out Pokémon with zero rate
        availablePokemon = availablePokemon.filter((poke) => poke.rate > 0);

        let selectedPokemon = [];

        if (usePercentages) {
          // Selection based on percentages
          // Group Pokémon by type
          const pokemonByType = {};
          const includedTypes = Object.keys(percentages);
          includedTypes.forEach((type) => {
            pokemonByType[type] = availablePokemon.filter(
              (poke) => poke.type === type
            );
          });

          // Select Pokémon based on percentages without exceeding total value
          const desiredValuesByType = {};
          // Total percentage is guaranteed to be 100%
          for (const type of includedTypes) {
            const percentage = percentages[type] / 100;
            desiredValuesByType[type] = totalTradingForValue * percentage;
          }

          let remainingValue = totalTradingForValue;

          for (const type of includedTypes) {
            let desiredValue = desiredValuesByType[type];
            let accumulatedValue = 0;

            // Sort Pokémon by rate descending
            pokemonByType[type].sort((a, b) => b.rate - a.rate);

            for (const poke of pokemonByType[type]) {
              if (accumulatedValue >= desiredValue || remainingValue <= 0) break;
              if (accumulatedValue + poke.rate > desiredValue) continue;
              selectedPokemon.push(poke);
              accumulatedValue += poke.rate;
              remainingValue -= poke.rate;
            }
          }

          // If we have not met the total value, try to add more Pokémon without exceeding the total value
          if (remainingValue > 0) {
            const remainingPokemon = availablePokemon.filter(
              (poke) => !selectedPokemon.includes(poke)
            );

            // Sort remaining Pokémon by rate descending
            remainingPokemon.sort((a, b) => b.rate - a.rate);

            for (const poke of remainingPokemon) {
              if (remainingValue <= 0) break;
              if (selectedPokemon.includes(poke)) continue;
              if (poke.rate <= remainingValue) {
                selectedPokemon.push(poke);
                remainingValue -= poke.rate;
              }
            }
          }
        } else {
          // Selection without considering percentages
          let remainingValue = totalTradingForValue;

          // Sort all available Pokémon by rate descending
          let allAvailablePokemon = availablePokemon
            .slice()
            .sort((a, b) => b.rate - a.rate);

          for (const poke of allAvailablePokemon) {
            if (remainingValue <= 0) break;
            if (poke.rate <= remainingValue) {
              selectedPokemon.push(poke);
              remainingValue -= poke.rate;
            }
          }
        }

        // Group selected Pokémon and update categorized totals
        const groupedPokemon = groupPokemon(selectedPokemon);

        setTradeSuggestions(groupedPokemon);
        setMessage('Trade suggestions generated successfully.');
      } else {
        setMessage('Username not found!');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setMessage('An error occurred while fetching data.');
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch rates
  const fetchRates = async (pokeNames) => {
    const ratesCache = ratesCacheRef.current;
    const ratePromises = pokeNames.map(async (pokeName) => {
      if (ratesCache[pokeName]) {
        // Return cached rate
        return { [pokeName]: ratesCache[pokeName] };
      } else {
        // Fetch rate from API
        return fetch(
          `https://pokemoncreed.net/ajax/pokedex.php?pokemon=${encodeURIComponent(
            pokeName
          )}`
        )
          .then((response) => response.json())
          .then((rateData) => {
            const rate = rateData.rating || 'N/A';
            if (rate === 'N/A') {
              ratesCache[pokeName] = 0;
              return { [pokeName]: 0 };
            }
            let formattedRate;
            if (rate.includes('m')) {
              formattedRate = parseFloat(rate.replace('m', '')) * 1_000_000;
            } else if (rate.includes('k')) {
              formattedRate = parseFloat(rate.replace('k', '')) * 1_000;
            } else {
              formattedRate = parseFloat(rate);
            }
            ratesCache[pokeName] = formattedRate;
            return { [pokeName]: formattedRate };
          })
          .catch((error) => {
            console.error(`Error fetching rate for ${pokeName}:`, error);
            ratesCache[pokeName] = 0;
            return { [pokeName]: 0 };
          });
      }
    });

    const ratesArray = await Promise.all(ratePromises);
    return ratesArray.reduce((acc, rate) => ({ ...acc, ...rate }), {});
  };

  return (
    <Card className="shadow-lg p-4 mb-5 rounded">
      <CardBody>
        <CardTitle tag="h2" className="mb-4 text-center">
          Quick Trade
        </CardTitle>
        <Form>
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

          {/* Trading For Section */}
          <Card className="mb-4">
            <CardBody>
              <CardTitle tag="h4" className="mb-3">
                Trading For
               
              </CardTitle>
  
              {tradingForList.map((item, index) => (
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
                        onChange={(e) =>
                          handleTradingForChange(item.id, 'currency', e.target.value)
                        }
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
              <Button
              color="success"
              size="sm"
              onClick={addTradingForItem}
              className="mt-3"
              >
                + Add Item
                </Button>
      
              <h5 className="mt-4">
                Total Trading For Value: {formatNumber(totalTradingForValue)}
              </h5>
            </CardBody>
          </Card>
          <Card className="mb-4">
            <CardBody>
              <CardTitle tag="h4">Exclude Options</CardTitle>
              <FormGroup>
                <Label>Exclude Types:</Label>
                <div>
                  {Object.keys(excludedTypes).map((type) => (
                    <FormGroup check inline key={type}>
                      <Label check>
                        <Input
                          type="checkbox"
                          checked={excludedTypes[type]}
                          onChange={(e) => handleExcludeTypeChange(type, e.target.checked)}
                        />{' '}
                        {type}
                      </Label>
                    </FormGroup>
                  ))}
                  <Button
                    id="excludeInfo"
                    color="link"
                    className="text-info p-0 ml-2"
                    size="sm"
                  >
                    <i className="fas fa-info-circle"></i>
                  </Button>
                  <UncontrolledTooltip placement="right" target="excludeInfo">
                    Exclude specific Pokémon types or unbased Pokémon.
                  </UncontrolledTooltip>
                </div>
              </FormGroup>
              <FormGroup>
                <Label>Exclude Specific Pokémon:</Label>
                <Row form className="align-items-end">
                  <Col md={2}>
                    <FormGroup>
                      <Label for="exclude-type">Type</Label>
                      <Input
                        type="select"
                        id="exclude-type"
                        value={excludePokemon.type}
                        onChange={(e) =>
                          setExcludePokemon({ ...excludePokemon, type: e.target.value })
                        }
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
                      <Label for="exclude-name">Name</Label>
                      <Input
                        type="text"
                        id="exclude-name"
                        value={excludePokemon.name}
                        onChange={(e) =>
                          setExcludePokemon({ ...excludePokemon, name: e.target.value })
                        }
                      />
                    </FormGroup>
                  </Col>
                  <Col md={2}>
                    <Button color="primary" onClick={addPokemonToExclude}>
                      Add
                    </Button>
                  </Col>
                </Row>
                {excludePokemonList.length > 0 && (
                  <div className="mt-3">
                    <Label>Excluded Pokémon:</Label>
                    <ListGroup>
                      {excludePokemonList.map((item, index) => (
                        <ListGroupItem key={index} className="d-flex justify-content-between">
                          {item.type} {item.name}
                          <Button
                            size="sm"
                            color="danger"
                            onClick={() => removeExcludedPokemon(index)}
                          >
                            Remove
                          </Button>
                        </ListGroupItem>
                      ))}
                    </ListGroup>
                  </div>
                )}
              </FormGroup>
            </CardBody>
          </Card>
          <Card className="mb-4">
            <CardBody>
              <FormGroup check>
                <Label check>
                  <Input
                    type="checkbox"
                    checked={usePercentages}
                    onChange={(e) => setUsePercentages(e.target.checked)}
                  />{' '}
                  Use Percentage Allocation
                </Label>
                <Button
                  id="percentageInfo"
                  color="link"
                  className="text-info p-0 ml-2"
                  size="sm"
                >
                  <i className="fas fa-info-circle"></i>
                </Button>
                <UncontrolledTooltip placement="right" target="percentageInfo">
                  Allocate trade value based on percentages for each type.
                </UncontrolledTooltip>
              </FormGroup>

              <Collapse isOpen={usePercentages}>
                <FormGroup className="mt-3">
                  <Label>Type Percentages:</Label>
                  {Object.keys(percentages).map((type) =>
                    !excludedTypes[type] ? (
                      <FormGroup key={type}>
                        <Label for={`slider-${type}`}>
                          {type}: {Math.round(percentages[type])}%
                        </Label>
                        <Input
                          type="range"
                          id={`slider-${type}`}
                          min="0"
                          max="100"
                          value={percentages[type]}
                          onChange={(e) => handlePercentageChange(type, e.target.value)}
                        />
                      </FormGroup>
                    ) : null
                  )}
                </FormGroup>
              </Collapse>
            </CardBody>
          </Card>
        </Form>

        {message && (
          <Alert color="info" className="mt-4">
            {message}
          </Alert>
        )}

        {/* Display Trading For Details */}
        {tradingForDetails.length > 0 && (
          <Card className="mt-4">
            <CardBody>
              <CardTitle tag="h5">Trading For</CardTitle>
              <ListGroup flush>
                {tradingForDetails.map((item, index) => (
                  <ListGroupItem key={index}>
                    {item.type} {item.name} -{' '}
                    {formatNumber(
                      parseFloat(item.cost) *
                        (item.currency === 'M'
                          ? 1_000_000
                          : item.currency === 'K'
                          ? 1_000
                          : 1)
                    )}
                  </ListGroupItem>
                ))}
              </ListGroup>
            </CardBody>
          </Card>
        )}
        {tradeSuggestions.length > 0 && (
          <>
            <Card className="mt-4">
              <CardBody>
                <CardTitle tag="h5">Trade Suggestions</CardTitle>
                <ListGroup flush>
                  {tradeSuggestions.map((poke, index) => (
                    <ListGroupItem key={index}>{poke.display}</ListGroupItem>
                  ))}
                </ListGroup>
              </CardBody>
            </Card>
            <PokeChart />
          </>
        )}
      </CardBody>
    </Card>
  );
};

export default QuickTrade;
