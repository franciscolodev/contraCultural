import getPng from '@/components/pages/site_image'

// Import APIContext type from the appropriate Astro package
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
	const result = await getPng(context);
	if (
		typeof result === 'object' &&
		result !== null &&
		'headers' in result &&
		result.headers &&
		typeof result.headers === 'object'
	) {
		// result is { headers: ... }
		return new Response(null, { headers: result.headers as HeadersInit });
	} else {
		// result is Buffer/ArrayBuffer
		// If result is an array, extract the first element (assuming that's the image buffer)
		const body =
			Array.isArray(result)
				? result.find(item => typeof item !== 'object' || item instanceof ArrayBuffer || Buffer.isBuffer?.(item))
				: result;
		return new Response(body as BodyInit, {
			headers: {
				'Content-Type': 'image/png',
				'Cache-Control': 'public, max-age=31536000, immutable'
			}
		});
	}
}
