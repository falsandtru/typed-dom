import assert from 'power-assert';
import i18next from 'i18next';

type Assert = typeof assert;

declare global {
  const assert: Assert;
  const i18next: i18next.i18n;
}
