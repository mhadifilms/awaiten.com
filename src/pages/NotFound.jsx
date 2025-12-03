import React from 'react';
import { Link } from 'react-router-dom';
import Container from '../components/ui/Container';
import Button from '../components/ui/Button';
import MotionBox from '../components/ui/MotionBox';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background pt-20">
      <Container className="text-center">
        <MotionBox
          variant="fadeInUp"
          className="space-y-6"
        >
          <h1 className="text-9xl font-black text-white/10">404</h1>
          <h2 className="h2 text-white">Page Not Found</h2>
          <p className="body-large max-w-xl mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
          
          <div className="pt-8">
            <Link to="/">
              <Button variant="primary" className="px-8 py-4 text-base rounded-full bg-white text-black hover:bg-gray-100">
                Back to Home
              </Button>
            </Link>
          </div>
        </MotionBox>
      </Container>
    </div>
  );
};

export default NotFound;

