import { uuid } from 'spica/uuid';
import { sqid } from 'spica/sqid';

const id = uuid().split('-').pop()!;

export function uid(): string {
  return `id-${id}-${String(+sqid()).padStart(6, '0')}`;
}
