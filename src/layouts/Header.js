// Header.js
import React, { useState, useEffect } from 'react'
import { Button } from 'reactstrap'
import { FaSun, FaMoon } from 'react-icons/fa' // Optional: Icons for dark mode toggle
import './Header.scss' // Assuming you have a Header.scss for additional styles

const Header = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('isDarkMode')
    return savedMode ? JSON.parse(savedMode) : false
  })

  const [isOpen, setIsOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const toggle = () => setDropdownOpen((prevState) => !prevState)

  const handleToggle = () => {
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    const body = document.body
    if (isDarkMode) {
      body.classList.add('dark-mode')
    } else {
      body.classList.remove('dark-mode')
    }
    localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode))
  }, [isDarkMode])

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode)
  }

  const showMobileMenu = () => {
    const sidebar = document.getElementById('sidebarArea')
    if (sidebar) {
      sidebar.classList.toggle('showSidebar')

      // Toggle body overflow to prevent scroll when sidebar is open
      document.body.classList.toggle('no-scroll')
    }
  }

  return (
    <header className="header fixed-top">
      <div className="container-fluid">
        <div className="d-flex align-items-center justify-content-between">
          <div className="logo">
            <h3>Creed Helper</h3>
          </div>

          {/* Dark Mode Toggle (Optional) */}
          {/* 
          <Button color="link" onClick={toggleDarkMode} aria-label="Toggle dark mode">
            {isDarkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
          </Button>
          */}
          <Button
            color="primary"
            onClick={showMobileMenu}
            className="d-lg-none theme-toggle-btn"
            aria-label="Toggle sidebar"
            aria-expanded={false}
            aria-controls="sidebarArea"
          >
            <i className="bi bi-list"></i>
          </Button>
        </div>
      </div>
    </header>
  )
}

export default Header
