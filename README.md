# React Simple useIntersectionObserver hook
![Minified](https://badgen.net/bundlephobia/min/react-simple-use-intersection-observer)
 ![Minified + GZip](https://badgen.net/bundlephobia/minzip/react-simple-use-intersection-observer)
 ![Dependency count](https://badgen.net/bundlephobia/dependency-count/react-simple-use-intersection-observer)
 ![Unit tests](https://github.com/tomaskavka/react-simple-use-intersection-observer/actions/workflows/unit-tests.yml/badge.svg)
 ![Linter](https://github.com/tomaskavka/react-simple-use-intersection-observer/actions/workflows/linter.yml/badge.svg)
 [![codecov](https://codecov.io/gh/tomaskavka/react-simple-use-intersection-observer/branch/main/graph/badge.svg?token=OMdqIJe8u3)](https://codecov.io/gh/tomaskavka/react-simple-use-intersection-observer)


useIntersectionObserver React hook, easy to use! Zero dependencies, blasting fast and size around 0.5kB (minified + GZipped).

## Getting started
### Install
`npm install --save react-simple-use-intersection-observer`

or

`yarn add react-simple-use-intersection-observer`

### Use it
```javascript
import useIntersectionObserver from 'react-simple-use-intersection-observer';

...

const { isInViewport } = useIntersectionObserver(ref);

```
