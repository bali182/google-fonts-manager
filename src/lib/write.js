import fs from 'fs';
import path from 'path';
import Promise from 'bluebird';
import dashify from 'dashify';
import mkpth from 'mkpath';

const writeFile = Promise.promisify(fs.writeFile);
const mkpath = Promise.promisify(mkpth);

function calculateFullPath(font, dir, variant, extension) {
  return path.join(
    dir,
    dashify(font.family),
    variant,
    `${dashify(font.family)}-${variant}.${extension}`
  );
}

export function write(font, outputDir) {
  const writePromises = [];
  Object.keys(font.data).forEach(extension => {
    const variantToBufferMap = font.data[extension];
    Object.keys(variantToBufferMap).forEach(variant => {
      const buffer = variantToBufferMap[variant];
      const fullPath = calculateFullPath(font, outputDir, variant, extension);
      const promise = mkpath(path.dirname(fullPath)).then(_ => writeFile(fullPath, buffer));
      writePromises.push(promise);
    });
  });
  return Promise.all(writePromises);
}

