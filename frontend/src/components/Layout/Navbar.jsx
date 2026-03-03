import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Box, Menu, MenuItem, Avatar, Chip, Button, Divider, IconButton } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/authProvider'; 
import { FiLogOut, FiUser, FiLogIn, FiCamera, FiCalendar, FiMenu, FiMail } from 'react-icons/fi';
import '../../styles/Navbar.css';

const Navbar = () => {
  const { user, isAuth, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElNav, setAnchorElNav] = useState(null);

  const handleNavClick = (sectionId) => {
    setAnchorElNav(null);
    if (location.pathname === '/') {
      const element = document.getElementById(sectionId);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(`/#${sectionId}`);
    }
  };

  const handleLogout = () => {
    setAnchorElUser(null);
    navigate('/', { replace: true });
    setTimeout(() => logout(), 50);
  };

  return (
    <AppBar position="fixed" className={`nav-main-container ${isAuth ? 'nav-admin' : 'nav-public'}`}>
      <Toolbar className="nav-toolbar">
        
        {/* LOGO: Siempre redirige a / en modo público o /home en admin */}
        <Box className="nav-brand" onClick={() => navigate(isAuth ? '/home' : '/')} style={{ cursor: 'pointer' }}>
          <img src="/img/mango.png" alt="Logo" className="nav-logo-img" />
        </Box>

        <Box className="nav-user-section">
          {isAuth && user ? (
            /* --- VISTA STAFF --- */
            <>
              <Box 
                className="nav-profile-wrapper" 
                onClick={(e) => setAnchorElUser(e.currentTarget)}
              >
                <Box className="nav-profile-text-container d-none d-md-flex">
                  <Typography className="nav-user-name">
                    {user.name || user.username}
                  </Typography>
                </Box>

                <Avatar 
                  className="nav-avatar-glow" 
                  sx={{ 
                    bgcolor: user.rol === 'administrador' ? '#727272' : '#f1b709',
                    color: 'white',
                    boxShadow: `0 0 10px ${user.rol === 'administrador' ? 'rgba(255, 107, 0, 0.4)' : 'rgba(254, 191, 0, 0.4)'}`
                  }}
                >
                  {(user.name || 'U').charAt(0).toUpperCase()}
                </Avatar>
              </Box>

              <Menu
                anchorEl={anchorElUser}
                open={Boolean(anchorElUser)}
                onClose={() => setAnchorElUser(null)}
                PaperProps={{ className: 'nav-dropdown-paper' }}
              >
                <Box className="nav-menu-header">
                  <Typography className="menu-header-name">{user.name || user.username}</Typography>
                  <Chip label={user.rol?.toUpperCase()} size="small" className={`menu-header-role ${user.rol?.toLowerCase()}`} />
                </Box>
                <Divider sx={{ my: 1, borderColor: 'rgba(255,255,255,0.1)' }} />
                <MenuItem className="nav-menu-item" onClick={() => { setAnchorElUser(null); navigate('/perfil'); }}><FiUser /> Perfil</MenuItem>
                <MenuItem className="nav-menu-item logout-red" onClick={handleLogout}><FiLogOut /> Salir</MenuItem>
              </Menu>
            </>
          ) : (
            /* --- VISTA PÚBLICA --- */
            <>
              {/* Desktop */}
              <Box className="d-none d-md-flex" sx={{ gap: 1 }}>
                <Button className="nav-link-btn" onClick={() => handleNavClick('eventos')} startIcon={<FiCalendar />}>EVENTOS</Button>
                <Button className="nav-link-btn" onClick={() => handleNavClick('fotos')} startIcon={<FiCamera />}>FOTOS</Button>
                <Button className="nav-link-btn" onClick={() => handleNavClick('contacto')} startIcon={<FiMail />}>CONTACTO</Button>
                <Button className="btn-login-nav" onClick={() => navigate('/login')} startIcon={<FiLogIn />}>LOGIN STAFF</Button>
              </Box>

              {/* Mobile */}
              <Box className="d-flex d-md-none">
                <IconButton onClick={(e) => setAnchorElNav(e.currentTarget)} sx={{ color: '#FF6B00' }}>
                  <FiMenu size={30} />
                </IconButton>
                <Menu
                  anchorEl={anchorElNav}
                  open={Boolean(anchorElNav)}
                  onClose={() => setAnchorElNav(null)}
                  PaperProps={{ className: 'nav-dropdown-paper mobile-mango-menu' }}
                >
                  <MenuItem onClick={() => handleNavClick('eventos')}><FiCalendar /> EVENTOS</MenuItem>
                  <MenuItem onClick={() => handleNavClick('fotos')}><FiCamera /> FOTOS</MenuItem>
                  <MenuItem onClick={() => handleNavClick('contacto')}><FiMail /> CONTACTO</MenuItem>
                  <Divider sx={{ my: 1, borderColor: 'rgba(0,0,0,0.1)' }} />
                  <MenuItem onClick={() => navigate('/login')} className="mobile-login-item"><FiLogIn /> LOGIN STAFF</MenuItem>
                </Menu>
              </Box>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;