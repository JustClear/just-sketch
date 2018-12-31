import buble from 'rollup-plugin-buble';
import alias from 'rollup-plugin-alias';
import minify from 'rollup-plugin-babel-minify';
import resolve from 'rollup-plugin-node-resolve';

const isProd = process.env.NODE_ENV === 'production';

const configure = {
    input: 'src/index.js',
    output: {
        file: 'dist/sketch.js',
        name: 'sketch',
        format: 'umd',
        sourcemap: true,
    },
    plugins: [
        alias(),
        buble(),
        resolve(),
    ],
    external: [],
};

if (isProd) {
    configure.output.file = 'dist/sketch.min.js';
    configure.plugins.push(minify());
}

module.exports = configure;
