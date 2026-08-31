/**
 * utility to join class names together,
 * e.g classNames('class1', 'class2', undefined) => 'class1 class2'
 * */
export const cn = (...args: unknown[]) =>
  args
    .flat()
    .filter((x) => typeof x === 'string')
    .join(' ')
    .trim()
