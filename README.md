# Pizza Wizard

![alt text](./images/wizard.png "Wise and powerful wizard" )

## Who is the Pizza Wizard?

Great question! Pizza wizard is a Slackbot that uses a mixture of AWS services and magic to return the number of pizza needed for a given number of people.

## Installation

Install packages

```bash
npm install
```

Edit `serverless.yml` with the correct roles/permissions

## Configuration

The number of slices per person and the number of slices in a pizza can be configured in: `pizza-config.js`

## Deploying

```bash
serverless deploy
```

Use the returned API gateway URL as your slackbots endpoint

