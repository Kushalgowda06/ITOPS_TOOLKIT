import React from "react";
import { Container } from "react-bootstrap";

const Footer: React.FC = () => {
  return (
    <>
      <footer className="glass-footer-nav">
        <Container className="text-center">
          <p className="mb-0">
            © Cognizant. All rights reserved.
          </p>
        </Container>
      </footer>
    </>
  );
};

export default Footer;
