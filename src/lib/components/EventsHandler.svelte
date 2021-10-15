<script>
    import { onMount } from "svelte";
    import { userStateStore, flowStore } from '../../stores/state.js';
    import { API_URL } from '../../configs/env.js';

    const sendFeedback = () => {
    	const { uniqID } = $userStateStore;
    	const flow = $flowStore;
    	const length = flow.length;
    	let flowString = '';
    	let prevElem = flow[0];
    	let multiplier = 1;
    	for (let i = 1; i < length; i++) {
    		const curElem = flow[i];
    		if (prevElem === curElem) {
    			multiplier++;
    			if (length === i + 1) {
    				flowString = 1 < multiplier ? `${flowString}${prevElem}*${multiplier}` : `${flowString}${prevElem}`;
    			}
    		} else {
    			flowString = 1 < multiplier ? `${flowString}${prevElem}*${multiplier},` : `${flowString}${prevElem},`;
    			prevElem = curElem;
    			multiplier = 1;
    			if (length === i + 1) {
    				flowString = `${flowString}${curElem}`;
    			}
    		}
    	}
    	10 < flowString.length && navigator.sendBeacon(`${API_URL}/flow/add`, new URLSearchParams({ flowString, uniqID }));
    };

    onMount(() => {
    	document.addEventListener('visibilitychange', () => {
    		if ('hidden' === document.visibilityState && $userStateStore.shouldSendEvent) {
    			sendFeedback();
    		}
    	});
    });
</script>
