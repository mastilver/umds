const fs = require('fs');
const path = require('path');

const rollup = require('rollup');
const nodeResolve = require('rollup-plugin-node-resolve');
const commonJs = require('rollup-plugin-commonjs');
const uglify = require('rollup-plugin-uglify');

module.exports = async function (name  /* , config */) {
    /* TODO:
       - get module package.json
       - rewrite main
       - run rollup
       - run uglify
    */

    await buildJavascript(name, false);
    await buildJavascript(name, true);
    addPackageJson(name);
};

async function buildJavascript(name, minify) {
    // eslint-disable-next-line import/no-dynamic-require
    const main = require(`${name}/package.json`).main || 'index.js';
    const dest = path.join(__dirname, `/../tmp/${name}/dist/${name}${minify ? '.min' : ''}.js`);

    const entry = path.join(__dirname, `/../node_modules/${name}`, main);

    const bundle = await rollup.rollup({
        entry,
        plugins: [
            nodeResolve(),
            commonJs(),
            minify && uglify({
                output: {
                    comments(node, comment) {
                        const text = comment.value;
                        const type = comment.type;
                        if (type === 'comment2') {
                            // multiline comment
                            return /@preserve|@license|@cc_on/i.test(text);
                        }
                    }
                }
            })
        ]
    });

    await bundle.write({
        format: 'umd',
        moduleName: name,
        moduleId: name,
        sourceMap: true,
        dest
    });
}

function addPackageJson(name) {
    // eslint-disable-next-line import/no-dynamic-require
    const packageJson = require(`${name}/package.json`);

    const updatedPackageJson = {
        name: `@umds/${packageJson.name}`,
        version: `${packageJson.version}-beta.0`,
        description: packageJson.description,
        license: packageJson.license,
        repository: 'mastilver/umds',
        author: packageJson.author,
        contributors: packageJson.contributors,
        engines: packageJson.engines,
        files: [
            'dist'
        ],
        main: `dist/${name}.js`,
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
