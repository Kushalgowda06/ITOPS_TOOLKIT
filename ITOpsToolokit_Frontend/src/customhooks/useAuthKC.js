import { useState, useEffect } from 'react';
import Keycloak from 'keycloak-js';
import { useNavigate } from 'react-router-dom';

const useAuthKC = () => {
  const [keycloak, setKeycloak] = useState(null);
  const [authenticated, setAuthenticated] = useState(false); // Track authentication state
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize Keycloak only if it's not already initialized
    const initKeycloak = () => {
      const keycloakInstance = new Keycloak({
  url: 'https://sso.autonomousitopstoolkit.com/',
  realm: 'AIOT',
  clientId: 'PreDemo-AIOT',
});

      // Check if the URL has the tokens
      keycloakInstance.init({
        onLoad: 'login-required', // Forces login if not logged in
        pkceMethod: 'S256',
        redirectUri: window.location.origin, // Make sure your app is aware of the redirect URI
      }).then(authenticated => {
        if (authenticated) {
          // Store the token in sessionStorage
          sessionStorage.setItem('keycloak_token', keycloakInstance.token); 
          sessionStorage.setItem('authenticated', 'true');
          setAuthenticated(true);
          setKeycloak(keycloakInstance);

          // Navigate to the home page after successful authentication
          navigate('/home');
        } else {
          // If not authenticated, clear sessionStorage and update state
          sessionStorage.setItem('authenticated', 'false');
          setAuthenticated(false);
        }

        // Stop the loading spinner
        setLoading(false);
      }).catch(() => {
        // On error, stop loading and set as not authenticated
        setLoading(false);
        sessionStorage.setItem('authenticated', 'false');
      });
    };

    // Initialize Keycloak only if it's not already initialized
    if (!keycloak) {
      initKeycloak();
    }
  }, [keycloak, navigate]);

  // Check if the user was previously authenticated (use sessionStorage)
  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem('authenticated') === 'true';
    if (isAuthenticated) {
      setAuthenticated(true);
    }
  }, []);

  return { keycloak, authenticated, loading };
};

export default useAuthKC;
