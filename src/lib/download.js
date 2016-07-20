import fetch from 'node-fetch';
import Promise from 'bluebird';
import {assign, omit, difference} from 'lodash';
import {convert} from './convert';

function streamToBufferPromise(stream) {
  return new Promise((resolve, reject) => {
    const buffer = [];
    stream.on('data', data => buffer.push(data));
    stream.on('error', error => reject(error));
    stream.on('end', () => resolve(Buffer.concat(buffer)));
  });
}

function downloadFile(url) {
  return fetch(url)
    .then(data => data.body)
    .then(streamToBufferPromise);
}

export function urls(font, variants) {
  const vars = variants.map(variant => variant.toString());
  const keys = Object.keys(font.files).filter(key => vars.indexOf(key) >= 0)
  return keys.map(key => [key, font.files[key]]);
}

export function downloadVariantsTtf(font, variants) {
  const downloads = Promise.all(
    urls(font, variants).map(([variant, url]) => downloadFile(url).then(buffer => [variant, buffer]))
  );
  return downloads.then(pairs => {
    return pairs.reduce((data, [variant, buffer]) => {
      data[variant] = buffer;
      return data;
    }, {});
  })
}

export function download(font, variants, formats) {
  return downloadVariantsTtf(font, variants).then(ttfData => {
    return convert(ttfData, formats).then(data => {
      return omit(data, difference(Object.keys(data), formats));
    }).then(data => {
      return assign({}, font, { data });
    });
  });
}