import React, { useState, useEffect, useRef } from 'react'
import { useRecoilState } from 'recoil'
import { sidebarState } from '../components/recoil/recoilState'
import { Nav, NavItem } from 'reactstrap'
import { NavLink, useNavigate } from 'react-router-dom'

const navigation = [
  { title: 'Box Rater', href: 'box-rater', icon: 'bi bi-calculator' },
  {
    title: 'Trade Helper',
    href: 'trade-helper',
    icon: 'bi bi-person-lines-fill',
  },
  { title: 'Input Rater', href: 'input-rater', icon: 'bi bi-box' },
]

const Sidebar = () => {
  const [promo, setPromo] = useState('')
  const [promoImage, setPromoImage] = useState('')
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('isDarkMode')
    return savedMode ? JSON.parse(savedMode) : false
  })
  const [isSidebarOpen, setIsSidebarOpen] = useRecoilState(sidebarState)
  const sidebarRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchPromo = async () => {
      try {
        const response = await fetch(
          'https://pokemoncreed.net/ajax/pokedex.php?pokemon=promo'
        )
        const data = await response.json()
        if (data.success) {
          setPromo(data.name)
          setPromoImage(`https://pokemoncreed.net/sprites/${data.name}.png`)
        } else {
          console.error('Failed to fetch promo data')
        }
      } catch (error) {
        console.error('Error fetching promo data:', error)
      }
    }

    fetchPromo()
  }, [])

  useEffect(() => {
    const body = document.body
    if (isDarkMode) {
      body.classList.add('dark-mode')
    } else {
      body.classList.remove('dark-mode')
    }
    localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode))
  }, [isDarkMode])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [setIsSidebarOpen])

  const handleLinkClick = (path) => {
    const sidebar = document.getElementById('sidebarArea')
    sidebar.classList.toggle('showSidebar')
    if (window.innerWidth <= 992) {
      setIsSidebarOpen(false)
    }
    navigate(`/${path}`)
  }

  return (
    <div
      id="sidebarArea"
      className={`sidebar ${isSidebarOpen ? 'showSidebar' : ''}`}
      ref={sidebarRef}
    >
      <div className="sidebar-promo text-center">
        {promoImage && (
          <img
            src={promoImage}
            alt="Current Promo"
            className="promo-image mb-2"
          />
        )}
        <div className="promo-text mt-2">
          <strong>Current Promo:</strong> {promo || 'Loading...'}
        </div>
      </div>

      <Nav vertical className="sidebar-nav mt-4">
        {navigation.map((navi, index) => (
          <NavItem key={index} className="sidenav-bg">
            <NavLink
              to={navi.href}
              className={({ isActive }) =>
                isActive ? 'nav-link active' : 'nav-link'
              }
              onClick={handleLinkClick} // Close sidebar when link is clicked
            >
              <i className={`${navi.icon} me-2`}></i>
              <span>{navi.title}</span>
            </NavLink>
          </NavItem>
        ))}
      </Nav>
    </div>
  )
}

export default Sidebar
