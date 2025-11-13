import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'https://sso.autonomousitopstoolkit.com/',
  realm: 'AIOT',
  clientId: 'Demo-AIOT',
});

export default keycloak;