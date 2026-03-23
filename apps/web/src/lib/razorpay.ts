const RAZORPAY_SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";

let loadPromise: Promise<void> | null = null;

export function loadRazorpayScript(): Promise<void> {
	if (window.Razorpay) return Promise.resolve();

	if (loadPromise) return loadPromise;

	loadPromise = new Promise<void>((resolve, reject) => {
		const script = document.createElement("script");
		script.src = RAZORPAY_SCRIPT_URL;
		script.async = true;
		script.onload = () => resolve();
		script.onerror = () => {
			loadPromise = null;
			reject(new Error("Failed to load Razorpay SDK"));
		};
		document.body.appendChild(script);
	});

	return loadPromise;
}

export async function openRazorpayCheckout(options: RazorpayOptions) {
	await loadRazorpayScript();
	const rzp = new window.Razorpay!(options);
	rzp.open();
}
