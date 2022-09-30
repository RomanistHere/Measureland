<script>
	import { json } from "svelte-i18n";

	const types = {
		"PasswordChanged": "Пароль успешно изменён!",
		"unrecognizedError": "Ссылка для подтверждения отправлена на почту",
	};

	export let successType = "unrecognizedError";
</script>

<div class="rounded-lg bg-bg_green py-3 px-8 text-on-green text-center leading-5 flex justify-center items-center min-h-[4rem]">
	{types[successType]}
</div>
