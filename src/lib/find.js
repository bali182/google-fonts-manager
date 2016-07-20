import fetch from 'node-fetch';
import dashify from 'dashify';
import {includes, find} from 'lodash';


export function all(apiKey) {
  return fetch(`https://www.googleapis.com/webfonts/v1/webfonts?key=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        throw new Error(data.error.message);
      } else {
        return data.items;
      }
    });
}

export function exploreByName(searchTerm, apiKey) {
  return all(apiKey).then(fonts => {
    return fonts.filter(font => {
      return includes(dashify(font.family), dashify(searchTerm || ''));
    })
  })
}

export function findByName(name, apiKey) {
  return all(apiKey).then(fonts => {
    return find(fonts, font => {
      return dashify(font.family) === dashify(name || '')
    })
  })
}