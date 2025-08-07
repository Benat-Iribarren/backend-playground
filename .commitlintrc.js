const headerPattern = /^\[#\d+\] - .{1,80}$/;

module.exports = {
  rules: {
    'header-pattern': (parsed) => {
      if (!parsed || !parsed.header) {
        return [false, 'commit header is missing'];
      }
      if (!headerPattern.test(parsed.header)) {
        return [false, `header must match pattern ${headerPattern.toString()}`];
      }
      return [true];
    },
    'header-pattern': [2, 'always'],
    'header-max-length': [2, 'always', 80],
  },
  plugins: [
    {
      rules: {
        'header-pattern': (parsed) => {
          if (!parsed || !parsed.header) {
            return [false, 'commit header is missing'];
          }
          if (!headerPattern.test(parsed.header)) {
            return [false, `header must match pattern ${headerPattern.toString()}`];
          }
          return [true];
        },
      },
    },
  ],
};
