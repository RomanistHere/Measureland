<script>
	import { userStateStore, isDesktop } from '../../stores/state.js';
	import { API_URL } from '../../configs/env.js';
	import { logError, showSomethingWrongNotification } from "../utilities/helpers.js";

	const handleErrors = event => {
		logError(event);

		// can not get range of undefined error on phones is triggered
		if ($isDesktop)
			showSomethingWrongNotification();

		if (!$userStateStore.shouldSendEvent)
			return;

		try {
			const { message, filename, lineno, colno, error } = event;
			navigator.sendBeacon(`${API_URL}/flow/error`, new URLSearchParams({
				message,
				filename,
				lineno,
				colno,
				error,
			}));
		} catch (error) {
			logError(error);
		}
		return true;
	};
</script>

<svelte:window
	on:error={handleErrors}
	on:unhandledrejection={handleErrors}
/>
