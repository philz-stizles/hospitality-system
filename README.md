# Carbon Hospitality System

## Table of contents

[1. Introduction](#introduction)
[2. TypeScript Installation](#typescript-installation)
[3. Jest Installation](#jest-installation)
[4. How to Run Tests](#paragraph2)
[5. API Docs](#api-docs)

## Introduction

Some introduction text, formatted in heading 2 style

## Typescript Installation

- Install typescript globally to use the "tsc CLI":

  ```bash
  npm install -g typescript
  ```

- Generate default typescript config file(i.e. tsconfig.json) in project:

  ```bash
  npx tsc --init
  ```

- Install typescript dependencies:

  ```bash
  npm install -D typescript ts-node-dev
  ```

- Configure package.json:

  ```json
  "scripts": {
    "start": "ts-node-dev src/index.ts",
    ...
  },
  ```

## Jest Installation

- Install dependencies:

  ```bash
  npm install -D jest ts-jest @types/jest supertest @types/supertest mongodb-memory-server
  ```

- Generate default jest configuration file (i.e. 'jest.config.js'):

  ```bash
  npx ts-jest config:init
  ```

- Add your configs to 'jest.config.js'

  ```js
  module.exports = {
    ...,
    setupFilesAfterEnv: ['./src/test/setup.ts'],
  }
  ```

- Configure 'package.json':

  ```json
  "scripts": {
    ...,
    "test": "jest",
    "test:watch": "jest --watchAll --no-cache",
    "test:coverage": "jest --coverage"
    },
    ...
  },
  ```

## How to Run Tests

The second paragraph text

## API Docs

The second paragraph text
