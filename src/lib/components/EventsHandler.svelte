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
    				flowString = multiplier > 1 ? `${flowString}${prevElem}*${multiplier}` : `${flowString}${prevElem}`;
    			}
    		} else {
    			flowString = multiplier > 1 ? `${flowString}${prevElem}*${multiplier},` : `${flowString}${prevElem},`;
    			prevElem = curElem;
    			multiplier = 1;
    			if (length === i + 1) {
    				flowString = `${flowString}${curElem}`;
    			}
    		}
    	}
    	flowString.length > 10 && navigator.sendBeacon(`${API_URL}/flow/add`, new URLSearchParams({ flowString, uniqID }));
    };

    onMount(() => {
	    const onVisibilityChange = () => {
		    if (document.visibilityState === 'hidden' && $userStateStore.shouldSendEvent) {
			    sendFeedback();
		    }
	    };

    	document.addEventListener('visibilitychange', onVisibilityChange);

	return () => document.removeEventListener('visibilitychange', onVisibilityChange);
    });
</script>
