const fs = require('fs');
const path = require('path');

const rollup = require('rollup');
const nodeResolve = require('rollup-plugin-node-resolve');
const commonJs = require('rollup-plugin-commonjs');
const butternut = require('rollup-plugin-butternut');

module.exports = async function (name, config) {
    /* TODO:
       - get module package.json
       - rewrite main
       - run rollup
       - run uglify
    */

    await buildJavascript(name, {format: 'umd', minify: false});
    await buildJavascript(name, {format: 'umd', minify: true});
    await buildJavascript(name, {format: 'es', minify: false});
    await buildJavascript(name, {format: 'es', minify: true});
    addPackageJson(name, config);
    addReadMe(name);
};

async function buildJavascript(name, {format, minify}) {
    // eslint-disable-next-line import/no-dynamic-require
    const main = require(`${name}/package.json`).main || 'index.js';
    const fileName = `${name}${format === 'es' ? '.module' : ''}${minify ? '.min' : ''}.js`;
    const dest = path.join(__dirname, '../tmp', name, fileName);

    const entry = path.join(__dirname, '../node_modules', name, main);

    const bundle = await rollup.rollup({
        entry,
        plugins: [
            nodeResolve(),
            commonJs(),
            minify && butternut()
        ],
        onwarn(warning) {
            if (['UNRESOLVED_IMPORT'].includes(warning.code)) {
                throw new Error(warning.message);
            }

            console.warn(name, warning.message);
        }
    });

    await bundle.write({
        format,
        moduleName: name,
        moduleId: name,
        sourceMap: true,
        dest
    });
}

function addPackageJson(name, {beta}) {
    // TODO: remove
    beta = '23';

    // eslint-disable-next-line import/no-dynamic-require
    const packageJson = require(`${name}/package.json`);

    const updatedPackageJson = {
        name: `@umds/${packageJson.name}`,
        version: `${packageJson.version}${beta == null ? '' : `-beta.${beta}`}`,
        description: packageJson.description,
        license: packageJson.license,
        repository: 'mastilver/umds',
        author: packageJson.author,
        contributors: packageJson.contributors,
        engines: packageJson.engines,
        main: `${name}.js`,
        module: `${name}.module.js`,
        keywords: [
            'umds',
            'umd'
        ].concat(packageJson.keywords),
        dependencies: {},
        devDependencies: {},
        peerDependencies: packageJson.peerDependencies
    };

    fs.writeFileSync(path.join(__dirname, `/../tmp/${name}/package.json`), JSON.stringify(updatedPackageJson, null, 2));
}

function addReadMe(name) {
    const readMeFile = fs.readdirSync(path.join(__dirname, '../node_modules/', name)).find(x => /readme\.md/i.test(x));

    const srcFile = path.join(__dirname, '../node_modules/', name, readMeFile);
    const destFile = path.join(__dirname, '/../tmp/', name, readMeFile.toLowerCase());

    fs.writeFileSync(destFile, fs.readFileSync(srcFile));
}
