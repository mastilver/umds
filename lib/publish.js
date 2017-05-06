const path = require('path');

const execa = require('execa');

const umds = require('../umds.json');

Object.keys(umds).forEach(async name => {
    if (await shouldPublish(name)) {
        await publishModule(name);
    }
});

async function shouldPublish(name) {
    // eslint-disable-next-line import/no-dynamic-require
    const {version} = require(`../tmp/${name}/package.json`);
    try {
        const {versions} = await execa('npm', ['info', '--json', `@umds/${name}`]).then(x => x.stdout).then(JSON.parse);
        return !versions.includes(version);
    } catch (err) {
        // module isn't published yet
        return true;
    }
}

async function publishModule(name) {
    const cmd = execa('npm', ['publish', '--access', 'public'], {
        cwd: path.join(__dirname, `../tmp/${name}`)
    });

    cmd.stdout.pipe(process.stdout);
    cmd.stderr.pipe(process.stderr);

    await cmd;
}
