import ttf2svg from 'ttf2svg';
import ttf2woff from 'ttf2woff';
import ttf2eot from 'ttf2eot';

export function toSvg(ttfBuffer) {
  return Promise.resolve(ttf2svg(ttfBuffer));
}

export function toWoff(ttfBuffer) {
  return Promise.resolve(new Buffer(ttf2woff(new Uint8Array(ttfBuffer)).buffer));
}

export function toEot(ttfBuffer) {
  return Promise.resolve(new Buffer(ttf2eot(new Uint8Array(ttfBuffer)).buffer));
}

function convertInternal(data, converter) {
  const convertPromises = Object.keys(data).map(key => [key, data[key]]).map(([key, buffer]) => {
    return converter(buffer).then(cnv => [key, cnv]);
  })
  return Promise.all(convertPromises).then(converted => {
    return converted.reduce((output, [key, bfr]) => {
      output[key] = bfr;
      return output;
    }, {})
  })
}

const converters = {
  svg: toSvg,
  woff: toWoff,
  eot: toEot
};

export function convert(ttfData, formats) {
  const convertPromises = formats.filter(format => format !== 'ttf').map(format => {
    const converter = converters[format];
    if (!converter) {
      return Promise.reject(new Error(`Unknown format ${format}`));
    }
    return convertInternal(ttfData, converter).then(data => [format, data]);
  });
  return Promise.all(convertPromises).then(data => {
    return data.reduce((output, [format, buffers]) => {
      output[format] = buffers;
      return output;
    }, { ttf: ttfData })
  })
}