<script lang="ts">
	import * as m from "$lib/paraglide/messages";
	import { Users, Unplug, UserPlus } from "@lucide/svelte";
	import MenuCard from "@/components/menus/MenuCard.svelte";
	import { getIconTeam } from "$lib/services/uicons.svelte";
	import { mTeam } from "$lib/services/ingameLocale";
	import Button from "@/components/ui/input/Button.svelte";
	import ConnectAccountDialog from "@/components/autoBattle/ConnectAccountDialog.svelte";
	import {
		getConnectedAccounts,
		removeConnectedAccount,
		type ConnectedAccount
	} from "@/lib/features/autoBattle";
	import { onMount } from "svelte";

	let accounts = $state<ConnectedAccount[]>([]);
	let isConnecting = $state(false);
	let requestError = $state<string | undefined>(undefined);

	onMount(() => {
		getConnectedAccounts(true)
			.then((result) => (accounts = result.accounts))
			.catch(() => {
				// Accounts are only available to authenticated users.
			});
	});
</script>

<MenuCard title={m.auto_battle_connected_accounts()} Icon={Users}>
	<div class="py-3 px-4 w-full space-y-3">
		{#each accounts as account (account.friendCode)}
			<div>
				<div class="flex gap-2 items-center" class:opacity-60={account.state !== "active"}>
					<img class="size-6 shrink-0" src={getIconTeam(account.team)} alt={mTeam(account.team)} />
					<span class="font-medium">
						{account.nickname}
					</span>
					<span class="text-muted-foreground">
						{m.auto_battle_account_level({ level: account.level })}
					</span>
					<Button
						class="ml-auto"
						size="icon"
						variant="outline"
						title={m.auto_battle_remove_account()}
						onclick={async () => {
							requestError = undefined;
							try {
								await removeConnectedAccount(account.friendCode);
								accounts = accounts.filter((item) => item.friendCode !== account.friendCode);
							} catch (error) {
								requestError =
									error instanceof Error ? error.message : "Unable to remove this account.";
							}
						}}
					>
						<Unplug class="size-3.5" />
					</Button>
				</div>
				{#if account.state === "pending"}
					<p class="mt-1 text-sm text-muted-foreground">{m.auto_battle_account_pending()}</p>
				{:else if account.state === "inactive"}
					<p class="mt-1 text-sm text-muted-foreground">{m.auto_battle_account_inactive()}</p>
				{/if}
			</div>
		{/each}

		{#if requestError}
			<p class="text-sm text-destructive">{requestError}</p>
		{/if}

		<Button
			class="w-full"
			variant="outline"
			onclick={() => {
				requestError = undefined;
				isConnecting = true;
			}}
		>
			<UserPlus class="size-3.5" />
			{m.auto_battle_connect_new_account()}
		</Button>
	</div>
</MenuCard>

<ConnectAccountDialog
	bind:open={isConnecting}
	onaccountconnected={(account) => {
		accounts = [...accounts.filter((item) => item.friendCode !== account.friendCode), account];
	}}
/>
