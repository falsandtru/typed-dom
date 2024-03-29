module.exports = function (config) {
  config.set({
    browsers: ['Chrome', 'Firefox'],
    customLaunchers: {
      Chrome_bench: {
        base: 'Chrome',
        flags: ['--js-flags="--expose-gc"'],
      },
    },
    frameworks: ['mocha', 'power-assert'],
    files: [
      { pattern: 'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.js', watched: false, served: false, included: true, integrity: 'sha512-2iwCHjuj+PmdCyvb88rMOch0UcKQxVHi/gsAml1fN3eg82IDaO/cdzzeXX4iF2VzIIes7pODE1/G0ts3QBwslA==' },
      { pattern: 'https://cdnjs.cloudflare.com/ajax/libs/benchmark/2.1.4/benchmark.js', watched: false, served: false, included: true, integrity: 'sha512-XnVGk21Ij51MbU8XezQpkwZ1/GA8b5qmoVGIOdJLBYycutjkaeemipzRJP7P6mEJl99OfnweA7M3e4WLfuG7Aw==' },
      { pattern: 'https://cdnjs.cloudflare.com/ajax/libs/i18next/21.9.1/i18next.js', watched: false, served: false, included: true, integrity: 'sha512-RPJ9t0x+XItXDIylxv55R6d2pqCR20MRa/KtCFhaYouqqXG2mQJw3Shwk21cCjkgwNcsriQ19ua79PHRn07dxA==' },
      { pattern: 'dist/**/*.{js,map}', watched: true, served: true, included: true },
    ],
    reporters: ['dots'],
    preprocessors: {
      'dist/**/*.js': ['coverage'],
    },
    coverageReporter: {
      dir: 'coverage',
      reporters: [
        { type: 'html', subdir: browser => browser.split(/\s/)[0] },
        { type: 'text-summary', subdir: '.', file: 'summary.txt' },
      ],
    },
    browserDisconnectTimeout: 60 * 1e3,
    browserNoActivityTimeout: 300 * 1e3,
  });
};
