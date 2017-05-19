import _ from 'lodash';
import AWS from 'aws-sdk';
import qs from 'qs';
import {SLICES_PER_PERSON, SLICES_PER_PIZZA} from './pizza-config';

const s3 = new AWS.S3();

AWS.config.update({region:'us-east-1'});

export function findPizza(event, context, callback) {
  const slackText = qs.parse(event.body).text;

  const response = {
    statusCode: 200,
    body: JSON.stringify(getPizzasFromText(slackText)),
  };

  callback(null, response);
};

function calcPizza(numberOfPeople) {
  return Math.ceil((numberOfPeople * SLICES_PER_PERSON) / SLICES_PER_PIZZA)
}

function pizzaData(people=0, vege=0, gf=0, lf=0) {
  const vegePizzas = calcPizza(vege);
  const gfPizzas = calcPizza(gf);
  const lfPizzas = calcPizza(lf);
  const additionalPizzas = calcPizza(people - vege - gf - lf);
  const totalPizzas = additionalPizzas + vegePizzas + gfPizzas + lfPizzas;

  return {
    "attachments": [{
      "fallback": `Vegetarian Pizzas: ${vegePizzas}\nGluten-Free Pizzas: ${gfPizzas}\n\nCheese-free Pizzas: ${lfPizzas}\nAdditional Pizzas: ${additionalPizzas}\nTotal Pizzas: ${totalPizzas}`,
      "color": "warning",
      // "thumb_url": "./wizard-spin.gif",
      "title": "I GIVE YOU PIZZA!",
      "text": `With ${people} people attending, ${vege} who are vegetarian, ${gf} who are gluten-free, ${lf} who are lactose-sensitive, you'll need:`,
      "title_link": "https://www.youtube.com/watch?v=E4AAFUVcfGE",
      "fields": [
        {
          "title": `Vegetarian Pizzas: ${vegePizzas}`,
          "short": true
        },
        {
          "title": `Gluten-Free Pizzas: ${gfPizzas}`,
          "short": true
        },
        {
          "title": `Lactose-Free Pizzas: ${lfPizzas}`,
          "short": true
        },
        {
          "title": `Additional Pizzas: ${additionalPizzas}`,
          "short": true
        },
        {
          "title": `Total Pizzas: ${totalPizzas}`,
          "short": true
        }
      ]
    }]
  }
}

function getPizzasFromText(text) {
  if (_.isEmpty(text)) {
    return {
      "attachments": [{
        "fallback": '',
        "color": "danger",
        "thumb_url": "./wizard-spin.gif",
        "title": "WHY HAVE YOU SUMMONED ME!",
        "text": "Please use the proper commands\n/pizza [# of people] [# of vegetarian] [# of gluten-free] [# of lactose-sensitive]"
      }]
    }
  }

  const textArray = text.split(" ");
  const numbers = textArray.map(num => parseInt(num));
  return pizzaData(numbers[0], numbers[1], numbers[2], numbers[3]);
}
