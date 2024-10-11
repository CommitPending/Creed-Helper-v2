import React from 'react'
import {
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  ListGroup,
  ListGroupItem,
  Button,
} from 'reactstrap'
import { useRecoilValue } from 'recoil'
import { pokemonDetailsState } from '../recoil/recoilState'
import * as XLSX from 'xlsx'

const PokemonInBox = () => {
  // Retrieve the data from Recoil
  const pokemonDetails = useRecoilValue(pokemonDetailsState)

  // Function to convert rates
  const convertRateToNumber = (rateString) => {
    if (!rateString || typeof rateString !== 'string') {
      console.warn(`Invalid rate string: ${rateString}`)
      return 0
    }

    const match = rateString.match(/[\d.]+/)
    if (!match) {
      console.warn(`No numeric value found in rate string: ${rateString}`)
      return 0
    }

    const value = parseFloat(match[0])

    if (rateString.includes('m')) {
      return value * 1_000_000
    } else if (rateString.includes('k')) {
      return value * 1_000
    }
    return value
  }

  // Helper function to format numbers
  const formatRate = (rate) => {
    if (rate >= 1_000_000) {
      return `${(rate / 1_000_000).toFixed(2)}m`
    } else if (rate >= 1_000) {
      return `${(rate / 1_000).toFixed(2)}k`
    } else {
      return rate.toFixed(2)
    }
  }

  // Function to group Pokémon
  const groupPokemon = (pokemonList) => {
    const grouped = {}

    pokemonList.forEach((pokemon) => {
      const key = `${pokemon.name} ${pokemon.gender || ''} - Level: ${pokemon.level}`
      if (!grouped[key]) {
        grouped[key] = { ...pokemon, count: 1 }
      } else {
        grouped[key].count += 1
      }
    })

    return Object.entries(grouped).map(([key, details]) => {
      const rateString = details.rate || details.formattedRate
      const rateValue = convertRateToNumber(rateString)
      const totalRate = rateValue * details.count
      const formattedTotalRate = formatRate(totalRate)

      return {
        ...details,
        display: `${details.count}x ${key} [${formattedTotalRate}]`,
      }
    })
  }

  const renderPokemonList = (pokemonList) => {
    const groupedPokemon = groupPokemon(pokemonList)

    return groupedPokemon.map((pokemon, index) => (
      <ListGroupItem key={index} className="d-flex align-items-center">
        {pokemon.display}
      </ListGroupItem>
    ))
  }

  // Function to render ignored Pokémon
  const renderIgnoredPokemon = (ignoredList) => {
    const groupedIgnored = {}

    ignoredList.forEach((pokemon) => {
      const key = `${pokemon.name} ${pokemon.gender} - Level: ${pokemon.level}`
      if (groupedIgnored[key]) {
        groupedIgnored[key].count += 1
      } else {
        groupedIgnored[key] = { ...pokemon, count: 1 }
      }
    })

    return Object.entries(groupedIgnored).map(([key, details], index) => (
      <ListGroupItem key={index} className="d-flex align-items-center">
        {details.count}x {details.name} {details.gender && `${details.gender}`}{' '}
        - Level: {details.level}
      </ListGroupItem>
    ))
  }

  // Function to download Excel sheet
  const downloadExcel = () => {
    const username = pokemonDetails.uname
    const date = new Date().toLocaleDateString().replace(/\//g, '-')
    const filename = `${username}_BoxRate_${date}.xlsx`

    const consideredPokemon = groupPokemon(pokemonDetails.consideredPokemon)
    const ignoredPokemon = groupPokemon(pokemonDetails.ignoredPokemon)

    // Create worksheet data
    const data = [
      { Category: 'Considered Pokémon', Pokemon: '' },
      ...consideredPokemon.map((p) => ({ Category: '', Pokemon: p.display })),
      { Category: 'Ignored Pokémon', Pokemon: '' },
      ...ignoredPokemon.map((p) => ({ Category: '', Pokemon: p.display })),
    ]

    // Create a worksheet and a workbook
    const ws = XLSX.utils.json_to_sheet(data, {
      header: ['Category', 'Pokemon'],
    })
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Pokemon Rates')

    // Write the file and download
    XLSX.writeFile(wb, filename)
  }

  return (
    <Card className="mt-4">
      <CardBody>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <CardTitle tag="h5">Pokemon in Box</CardTitle>
            <CardSubtitle className="mb-3 text-muted" tag="h6">
              Considered and Ignored Pokémon
            </CardSubtitle>
          </div>
          <Button color="primary" onClick={downloadExcel}>
            Download Excel Sheet
          </Button>
        </div>

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
  )
}

export default PokemonInBox
