module.exports = {
    testEnvironment: 'jsdom',
    
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
    
    moduleNameMapper: {
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    },
  
    testPathIgnorePatterns: ['/node_modules/'],
    
    transform: {
      '^.+\\.(js|jsx)$': 'babel-jest',
    },
  };
  