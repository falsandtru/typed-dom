import assert from 'power-assert';
import { i18n } from 'i18next';

declare namespace NS {
  export {
    assert,
  }
}

declare global {
  const assert: typeof NS.assert;
  const i18next: i18n;
}
