export async function onRequestGet({ request }) {
    const url = new URL(request.url);
    const userIds = url.searchParams.get('userIds');
    const size = url.searchParams.get('size') || '420x420';

    if (!userIds || !/^[\d]+(,[\d]+)*$/.test(userIds)) {
        return new Response(JSON.stringify({ error: 'Invalid userIds' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const robloxUrl = `https://thumbnails.roblox.com/v1/users/avatar?userIds=${userIds}&size=${size}&format=Png&isCircular=false`;

    try {
        const upstream = await fetch(robloxUrl, {
            headers: { 'Accept': 'application/json' },
            cf: { cacheTtl: 300, cacheEverything: true },
        });
        const body = await upstream.text();
        return new Response(body, {
            status: upstream.status,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'public, max-age=300',
            },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: String(error) }), {
            status: 502,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
