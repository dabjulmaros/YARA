// https://svelte.dev/repl/c6a402704224403f96a3db56c2f48dfc?version=4.0.0
let intersectionObserver;

function ensureIntersectionObserver() {
	if (intersectionObserver) return;

  intersectionObserver = new IntersectionObserver(
		(entries) => {
			entries.forEach(entry => {
				const eventName = entry.isIntersecting ? 'enterView' : 'exitView';
				entry.target.dispatchEvent(new CustomEvent(eventName));
			});
		}
	);
}

export default function inView(element) {
	ensureIntersectionObserver();

	intersectionObserver.observe(element);

	return {
		destroy() {
			intersectionObserver.unobserve(element);
		}
	}
}