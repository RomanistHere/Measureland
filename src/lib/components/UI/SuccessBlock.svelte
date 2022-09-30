<script>
	import { json } from "svelte-i18n";

	const types = {
		"PasswordChanged": "Пароль успешно изменён!",
		"PasswordResetLinkSent": "Ссылка для подтверждения отправлена на почту",
		"PasswordChangeLinkSent": "Ссылка для смены пароля отправлена на почту",
	};

	export let successType = "PasswordResetLinkSent";
</script>

<div class="rounded-lg bg-bg_green py-3 px-8 text-on-green text-center leading-5 flex justify-center items-center min-h-[4rem]">
	{types[successType]}
</div>
