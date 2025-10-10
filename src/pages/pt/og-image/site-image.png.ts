import getPng from '@/components/pages/site_image';
import type { APIContext } from 'astro'; // Adjust import path if needed

export async function GET(context: APIContext) {
const result = await getPng(context);

  // Ensure buffer is a valid Uint8Array
const buffer = 'buffer' in result ? result.buffer : Buffer.from([]);
let uint8Array: Uint8Array;

if (buffer instanceof Uint8Array) {
    uint8Array = buffer;
} else if (buffer instanceof ArrayBuffer) {
    uint8Array = new Uint8Array(buffer);
} else if (Array.isArray(buffer)) {
    uint8Array = new Uint8Array(buffer);
} else {
    uint8Array = new Uint8Array(0);
}

  // Ensure headers are valid, cast them if necessary
const headers = 'headers' in result ? (result.headers as HeadersInit) : {};

return new Response(uint8Array as BodyInit, { headers });
}
