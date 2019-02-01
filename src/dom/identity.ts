import { uuid } from 'spica/uuid';
import { sqid } from 'spica/sqid';

const id = uuid().slice(-7);

export function uid(): string {
  return `id-${id}-${+sqid()}`;
}
