import React, { useState } from 'react'
import { useSetRecoilState } from 'recoil'
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
} from 'reactstrap'
import {
  pokemonDetailsState,
  categorizedTotalsState,
} from '../recoil/recoilState' // Import the Recoil atoms

const rateCache = {} // Cache for storing Pokémon rates

const FieldRater = () => {
  const [boxText, setBoxText] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const setPokemonDetails = useSetRecoilState(pokemonDetailsState)
  const setCategorizedTotals = useSetRecoilState(categorizedTotalsState)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setPokemonDetails({
      totalRating: '',
      consideredPokemon: [],
      ignoredPokemon: [],
    })
    setCategorizedTotals({
      Luminous: 0,
      Cursed: 0,
      Gold: 0,
      Rainbow: 0,
      Shadow: 0,
    })

    if (!boxText) {
      setMessage('Please enter a valid box input.')
      return
    }

    setLoading(true)

    try {
      // Parse the input text to extract Pokémon information
      const pokemonList = parseBoxText(boxText)
      const findrates = new Set(pokemonList.map((poke) => poke.name.toLowerCase()))

      if (pokemonList.length === 0) {
        setMessage('No valid Pokémon found in the input!')
      } else {
        const foundRates = await fetchRates(Array.from(findrates))
        const results = calculateAndFormatRatings(pokemonList, foundRates)

        // Calculate and set the categorized totals
        const categorizedValues = categorizePokemon(results.consideredPokemon)
        setCategorizedTotals(categorizedValues)

        // Update the Recoil state with Pokémon details
        setPokemonDetails({
          totalRating: results.totalRating,
          consideredPokemon: results.consideredPokemon,
          ignoredPokemon: results.ignoredPokemon,
        })

        setMessage(`Total Rating: ${results.totalRating}`)
      }
    } catch (error) {
      console.error('Error processing data:', error)
      setMessage('An error occurred while processing data.')
    } finally {
      setLoading(false)
    }
  }

  const parseBoxText = (text) => {
    // Split the input into lines and extract Pokémon details
    const lines = text.split('\n').map((line) => line.trim()).filter(Boolean)
    const pokemonList = []
  
    lines.forEach((line) => {
      // Updated regex to allow for Pokémon names with hyphens (e.g., ShadowHo-Oh)
      const match = line.match(/([\w-]+)\s*(\w*)\s*-\s*Level\s*([\d,]+)/i)
      if (match) {
        const [_, name, gender, level] = match
        pokemonList.push({
          name: name.trim(),
          gender: gender.trim() || 'Genderless',
          level: parseInt(level.replace(/,/g, '')), // Remove commas for numeric parsing
          originalLevel: level, // Preserve the original format with commas
        })
      }
    })
  
    return pokemonList
  }

  const fetchRates = async (findrates) => {
    const ratePromises = findrates.map((pokeName) => {
      if (rateCache[pokeName]) {
        console.log(`Using cached rate for ${pokeName}`)
        return Promise.resolve({ [pokeName]: rateCache[pokeName] })
      }

      return fetch(`https://pokemoncreed.net/ajax/pokedex.php?pokemon=${pokeName}`)
        .then((response) => response.json())
        .then((rateData) => {
          console.log("Fetching rate for", pokeName)
          const rate = rateData.rating || '0'
          const formattedRate = rate.includes('m')
            ? parseFloat(rate) * 1_000_000
            : parseFloat(rate.replace('k', '')) * 1_000

          rateCache[pokeName] = formattedRate
          return { [pokeName]: formattedRate }
        })
        .catch((error) => {
          console.error(`Error fetching rate for ${pokeName}:`, error)
          return { [pokeName]: 0 }
        })
    })

    const ratesArray = await Promise.all(ratePromises)
    return ratesArray.reduce((acc, rate) => ({ ...acc, ...rate }), {})
  }

  const calculateAndFormatRatings = (pokemonList, foundRates) => {
    let totalRating = 0
    const consideredPokemon = []
    const ignoredPokemon = []
  
    pokemonList.forEach((poke) => {
      const rate = foundRates[poke.name.toLowerCase()] || 0
      let finalRate = rate
  
      if (poke.level < 5) {
        finalRate *= 3 // 3x multiplier for Pokémon with level below 5
      } else if (poke.level > 5) {
        finalRate *= 0.8 // 0.8x multiplier for unbased Pokémon with level greater than 5
      }
  
      // If the rate is valid, add to considered, else to ignored
      if (finalRate > 0) {
        totalRating += finalRate
        consideredPokemon.push({
          name: poke.name,
          gender: poke.gender,
          level: poke.originalLevel, // Use the original level format with commas
          formattedRate: formatNumber(finalRate),
        })
      } else {
        ignoredPokemon.push({
          name: poke.name,
          gender: poke.gender,
          level: poke.originalLevel, // Use the original level format with commas
        })
      }
    })
  
    return {
      totalRating: formatNumber(totalRating),
      consideredPokemon,
      ignoredPokemon,
    }
  }
  const formatNumber = (num) => {
    if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(2) + 'm'
    } else if (num >= 1_000) {
      return (num / 1_000).toFixed(2) + 'k'
    } else {
      return num.toString()
    }
  }

  const categorizePokemon = (pokemonList) => {
    const categories = {
      Luminous: 0,
      Cursed: 0,
      Gold: 0,
      Rainbow: 0,
      Shadow: 0,
    }

    pokemonList.forEach((pokemon) => {
      let rateValue = 0
      const formattedRate = pokemon.formattedRate.toLowerCase()

      if (formattedRate.endsWith('k')) {
        rateValue = parseFloat(formattedRate.replace('k', '')) * 1_000
      } else if (formattedRate.endsWith('m')) {
        rateValue = parseFloat(formattedRate.replace('m', '')) * 1_000_000
      } else {
        rateValue = parseFloat(formattedRate)
      }

      if (pokemon.name.toLowerCase().includes('luminous')) {
        categories.Luminous += rateValue
      } else if (pokemon.name.toLowerCase().includes('cursed')) {
        categories.Cursed += rateValue
      } else if (pokemon.name.toLowerCase().includes('golden')) {
        categories.Gold += rateValue
      } else if (pokemon.name.toLowerCase().includes('rainbow')) {
        categories.Rainbow += rateValue
      } else if (pokemon.name.toLowerCase().includes('shadow')) {
        categories.Shadow += rateValue
      }
    })

    return categories
  }

  return (
    <div>
      <Card>
        <CardBody>
          <CardTitle tag="h2" className="mb-4 text-center">
            Field Rater
          </CardTitle>

          <Form onSubmit={handleSubmit}>
            <FormGroup className="mb-3">
              <Label for="boxText">Box Input:</Label>
              <Input
                type="textarea"
                name="boxText"
                id="boxText"
                placeholder="Paste your box details here"
                value={boxText}
                onChange={(e) => setBoxText(e.target.value)}
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
            <p>
              <strong>NOTE:</strong> Unbase: 0.8x Rate List | Level 4 or less: 3x Rate List | Genderless/Special Genders are rated normally.
            </p>
          </Label>
        </CardBody>
      </Card>
    </div>
  )
}

export default FieldRater
