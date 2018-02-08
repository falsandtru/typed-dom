import { uuid } from 'spica/uuid';
import { sqid } from 'spica/sqid';

const id = uuid().split('-').slice(-1).join('-');

export function uid(): string {
  return `${id}-${String(Number(sqid())).padStart(6, '0')}`;
}
