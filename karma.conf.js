module.exports = function (config) {
  config.set({
    browsers: ['Chrome', 'Firefox'],
    frameworks: ['mocha'],
    files: [
      { pattern: 'https://cdn.jsdelivr.net/npm/power-assert@1.6.1/build/power-assert.js', watched: false, served: false, included: true, integrity: 'sha256-MuDC5CQFh3oWtiG0YE000HlkK08xAilD2v0ndZR+Kds=' },
      { pattern: 'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.js', watched: false, served: false, included: true, integrity: 'sha512-2iwCHjuj+PmdCyvb88rMOch0UcKQxVHi/gsAml1fN3eg82IDaO/cdzzeXX4iF2VzIIes7pODE1/G0ts3QBwslA==' },
      { pattern: 'https://cdnjs.cloudflare.com/ajax/libs/benchmark/2.1.4/benchmark.js', watched: false, served: false, included: true, integrity: 'sha512-XnVGk21Ij51MbU8XezQpkwZ1/GA8b5qmoVGIOdJLBYycutjkaeemipzRJP7P6mEJl99OfnweA7M3e4WLfuG7Aw==' },
      { pattern: 'https://cdnjs.cloudflare.com/ajax/libs/i18next/21.8.2/i18next.js', watched: false, served: false, included: true, integrity: 'sha512-EVhL1duaW91yzWs3H1LKLMEy3DvZYOCVT6Oi1C7n2yOR3hM72H3tIWJnw+IXeQeRVXeT1zsiJnfTDlpBkGs2YA==' },
      { pattern: 'dist/**/*.{js,map}', watched: true, served: true, included: true },
    ],
    reporters: ['dots', 'coverage'],
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
    browserNoActivityTimeout: 90 * 1e3,
  });
};
