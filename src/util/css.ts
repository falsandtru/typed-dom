export function scope<T extends string>(rule: T): `@scope { ${T} }` {
  return `@scope { ${rule} }`;
}
