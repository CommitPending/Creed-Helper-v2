import React from 'react';
import { Card, CardBody, CardTitle, CardSubtitle, ListGroup, ListGroupItem } from 'reactstrap';
import { useRecoilValue } from 'recoil';
import { pokemonDetailsState } from '../recoil/recoilState'; // Import the Recoil atom

const PokemonInBox = () => {
  // Retrieve the data from Recoil
  const pokemonDetails = useRecoilValue(pokemonDetailsState);

  // Corrected rate conversion function with logging
  const convertRateToNumber = (rateString) => {
    if (!rateString || typeof rateString !== 'string') {
      console.warn(`Invalid rate string: ${rateString}`);
      return 0; // Default to 0 if the rate is not defined or not a string
    }

    // Extract the numeric part
    const match = rateString.match(/[\d.]+/);
    if (!match) {
      console.warn(`No numeric value found in rate string: ${rateString}`);
      return 0;
    }

    const value = parseFloat(match[0]); // Parse the numeric part

    if (rateString.includes('m')) {
      return value * 1_000_000;
    } else if (rateString.includes('k')) {
      return value * 1_000;
    }
    return value;
  };

  // Helper function to format numbers back into strings like '1.5k' or '3m'
  const formatRate = (rate) => {
    if (rate >= 1_000_000) {
      return `${(rate / 1_000_000).toFixed(2)}m`;
    } else if (rate >= 1_000) {
      return `${(rate / 1_000).toFixed(2)}k`;
    } else {
      return rate.toFixed(2);
    }
  };

  // Function to group and format the Pokémon data
  const groupPokemon = (pokemonList) => {
    const grouped = {};

    pokemonList.forEach((pokemon) => {
      const key = `${pokemon.name} ${pokemon.gender || ''} - Level: ${pokemon.level}`;
      if (!grouped[key]) {
        grouped[key] = { ...pokemon, count: 1 };
      } else {
        grouped[key].count += 1;
      }
    });

    // Convert the grouped object into an array for rendering
    return Object.entries(grouped).map(([key, details]) => {
      // Ensure that we access the correct property for the rate
      const rateString = details.rate || details.formattedRate;
      const rateValue = convertRateToNumber(rateString);
      const totalRate = rateValue * details.count;

      // Format the total rate back into a readable format (e.g., 1.5m, 1.5k)
      const formattedTotalRate = formatRate(totalRate);

      return {
        ...details,
        display: `${details.count}x ${key} [${formattedTotalRate}]`,
      };
    });
  };

  const renderPokemonList = (pokemonList) => {
    const groupedPokemon = groupPokemon(pokemonList);

    return groupedPokemon.map((pokemon, index) => (
      <ListGroupItem key={index} className="d-flex align-items-center">
        {pokemon.display}
      </ListGroupItem>
    ));
  };

  const renderIgnoredPokemon = (ignoredList) => {
    const groupedIgnored = {};

    ignoredList.forEach((pokemon) => {
      const key = `${pokemon.name} ${pokemon.gender}`;
      if (groupedIgnored[key]) {
        groupedIgnored[key].count += 1;
      } else {
        groupedIgnored[key] = { ...pokemon, count: 1 };
      }
    });

    return Object.entries(groupedIgnored).map(([key, details], index) => (
      <ListGroupItem key={index} className="d-flex align-items-center">
        {details.count}x {details.name} {details.gender && `${details.gender}`} - Level: {details.level}
      </ListGroupItem>
    ));
  };

  return (
    <Card className="mt-4">
      <CardBody>
        <CardTitle tag="h5">Pokemon in Box</CardTitle>
        <CardSubtitle className="mb-3 text-muted" tag="h6">
          Considered and Ignored Pokémon
        </CardSubtitle>

        <h6 className="mt-4">Considered Pokémon:</h6>
        <ListGroup flush className="mb-4">
          {pokemonDetails.consideredPokemon.length > 0 ? (
            renderPokemonList(pokemonDetails.consideredPokemon)
          ) : (
            <ListGroupItem>No Pokémon considered</ListGroupItem>
          )}
        </ListGroup>

        <h6 className="mt-4">Ignored Pokémon:</h6>
        <ListGroup flush>
          {pokemonDetails.ignoredPokemon.length > 0 ? (
            renderIgnoredPokemon(pokemonDetails.ignoredPokemon)
          ) : (
            <ListGroupItem>No Pokémon ignored</ListGroupItem>
          )}
        </ListGroup>
      </CardBody>
    </Card>
  );
};

export default PokemonInBox;
