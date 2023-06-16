import { error,json } from '@sveltejs/kit';
/** @type {import('./$types').RequestHandler} */
// export async function POST({ request }) {
//   console.log(request)
//   const { a, b } = await request.json();
//   return json(a + b);
// }
export async function POST({ url,request }) {
    console.log(url)
    console.log(request);
    const {r,params} = await request.json();
    console.log("r= "+r+" params= "+params);

    return new Response((url+" "+request+" "+r+" "+params));
}