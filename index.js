#!/usr/bin/env node

const merge = require('cloudformation-yml-merger').default;
const logger = require('./src/colorCli');

const args = require('yargs')
    .usage('Usage: $0 <options>')
    .example('$0 -i path -o target.yml')
    .string('i')
    .alias('i', 'path')
    .describe('i', 'The path of the folder containing the sub folders and yaml ymlFiles.')
    .string('o')
    .alias('o', 'targetFile')
    .describe('o', 'The merged yaml file')
    .strict()
    .argv;

const run = () => {
    logger.debug('Merging ...');
    try {
        merge(process.cwd() + '/' + args.path, process.cwd() + '/' + args.targetFile);
    } catch(err) {
        logger.error('failed to merge the cloudformation yaml files ' + err);
    }
    logger.debug('Finished merge!');
};

run();
