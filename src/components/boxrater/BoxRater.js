import React, { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import {
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Alert,
} from 'reactstrap';
import { pokemonDetailsState, categorizedTotalsState } from '../recoil/recoilState'; // Import the Recoil atoms

const BoxRater = () => {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const setPokemonDetails = useSetRecoilState(pokemonDetailsState);
  const setCategorizedTotals = useSetRecoilState(categorizedTotalsState);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setPokemonDetails({
      uname: '',
      uid: '',
      totalRating: '',
      consideredPokemon: [],
      ignoredPokemon: [],
    });
    setCategorizedTotals({
      Luminous: 0,
      Cursed: 0,
      Gold: 0,
      Rainbow: 0,
      Shadow: 0,
    });

    if (!username) {
      setMessage('Please enter a valid username.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`https://pokemoncreed.net/ajax/box.php?user=${username}`);
      const data = await response.json();

      if (data.success) {
        const result = data.data;
        const uname = result.name;
        const uid = result.id;

        const coloreds = ['Cursed', 'Glitter', 'Golden', 'Luminous', 'Rainbow', 'Shadow'];
        const pokemonList = { base: [], unbase: [], other: [] };
        const findrates = new Set();

        result.pokemon.forEach((poke) => {
          if (poke.loan === '0' && coloreds.some((color) => poke.name.startsWith(color))) {
            findrates.add(poke.name.toLowerCase());

            if (poke.level === 5) {
              pokemonList.base.push({ name: poke.name, gender: poke.gender, level: poke.level });
            } else if (poke.level > 5) {
              pokemonList.unbase.push({ name: poke.name, gender: poke.gender, level: poke.level });
            } else {
              pokemonList.other.push({ name: poke.name, gender: poke.gender, level: poke.level });
            }
          }
        });

        if (pokemonList.base.length + pokemonList.unbase.length + pokemonList.other.length === 0) {
          setMessage(`${uname} - #${uid} has no colored Pokémon to rate!`);
        } else {
          const foundRates = await fetchRates(Array.from(findrates));
          const results = calculateAndFormatRatings(pokemonList, foundRates);
          console.log(results)
          // Calculate and set the categorized totals
          const categorizedValues = categorizePokemon(results.consideredPokemon);
          setCategorizedTotals(categorizedValues);

          // Update the Recoil state with Pokémon details
          setPokemonDetails({
            uname,
            uid,
            totalRating: results.totalRating,
            consideredPokemon: results.consideredPokemon,
            ignoredPokemon: results.ignoredPokemon,
          });

          setMessage(`Total Rating for ${uname}: ${results.totalRating}`);
        }
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

  const fetchRates = async (findrates) => {
    const ratePromises = findrates.map((pokeName) =>
      fetch(`https://pokemoncreed.net/ajax/pokedex.php?pokemon=${pokeName}`)
        .then((response) => response.json())
        .then((rateData) => {
          const rate = rateData.rating || '0';
          const formattedRate =
            rate.includes('m') ? parseFloat(rate) * 1_000_000 : parseFloat(rate.replace('k', '')) * 1_000;
          return { [pokeName]: formattedRate };
        })
        .catch((error) => {
          console.error(`Error fetching rate for ${pokeName}:`, error);
          return { [pokeName]: 0 };
        })
    );

    const ratesArray = await Promise.all(ratePromises);
    return ratesArray.reduce((acc, rate) => ({ ...acc, ...rate }), {});
  };

  

  const calculateAndFormatRatings = (pokemonList, foundRates) => {
    let totalRating = 0;
    const consideredPokemon = [];
    const ignoredPokemon = [];

    for (const category in pokemonList) {
      for (const poke of pokemonList[category]) {
        const rate = foundRates[poke.name.toLowerCase()] || 0;
        let finalRate = rate;
  
        if (poke.level < 5) {
          finalRate *= 3; // 3x multiplier for level 4 or less
        } else if (category === 'unbase') {
          finalRate *= 0.8; // 0.8x multiplier for unbase
        }
  
        if (finalRate > 0) {
          totalRating += finalRate;
          consideredPokemon.push({
            count: 1,
            name: poke.name,
            gender: poke.gender,
            level: poke.level,
            formattedRate: formatNumber(finalRate),
          });
        } else {
          ignoredPokemon.push({
            count: 1,
            name: poke.name,
            gender: poke.gender,
            level: poke.level,
          });
        }
      }
    }

    return {
      totalRating: formatNumber(totalRating),
      consideredPokemon,
      ignoredPokemon,
    };
  };

  const formatNumber = (num) => {
    if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(2) + 'm';
    } else if (num >= 1_000) {
      return (num / 1_000).toFixed(2) + 'k';
    } else {
      return num.toString();
    }
  };

  const categorizePokemon = (pokemonList) => {
    const categories = {
      Luminous: 0,
      Cursed: 0,
      Gold: 0,
      Rainbow: 0,
      Shadow: 0,
    };

    pokemonList.forEach((pokemon) => {
      let rateValue = 0;
      const formattedRate = pokemon.formattedRate.toLowerCase();
  
      if (formattedRate.endsWith('k')) {
        rateValue = parseFloat(formattedRate.replace('k', '')) * 1_000;
      } else if (formattedRate.endsWith('m')) {
        rateValue = parseFloat(formattedRate.replace('m', '')) * 1_000_000;
      } else {
        rateValue = parseFloat(formattedRate);
      }
  
      if (pokemon.name.toLowerCase().includes('luminous')) {
        categories.Luminous += rateValue;
      } else if (pokemon.name.toLowerCase().includes('cursed')) {
        categories.Cursed += rateValue;
      } else if (pokemon.name.toLowerCase().includes('golden')) {
        categories.Gold += rateValue;
      } else if (pokemon.name.toLowerCase().includes('rainbow')) {
        categories.Rainbow += rateValue;
      } else if (pokemon.name.toLowerCase().includes('shadow')) {
        categories.Shadow += rateValue;
      }
    });

    return categories;
  };

  return (
    <div >
      <Card >
        <CardBody>
          <CardTitle tag="h2" className="mb-4 text-center">
            Rate Box
          </CardTitle>
  
          <Form onSubmit={handleSubmit}>
            <FormGroup className="mb-3">
              <Label for="username">Username:</Label>
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
            <Button type="submit" color="primary" disabled={loading} block>
              {loading ? 'Loading...' : 'Rate Box'}
            </Button>
          </Form>
          {message && (
            <Alert color="info" className="mt-4">
              {message}
            </Alert>
          )}
          <Label>
          <p >
            <strong>NOTE:</strong> Unbase: 0.8x Rate List | Level 4 or less: 3x Rate List | Genderless/Special Genders are rated normally.
          </p>
          </Label>
        </CardBody>
      </Card>
    </div>
  );
};


export default BoxRater;
