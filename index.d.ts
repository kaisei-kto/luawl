type luawl_key_status = 'Assigned'|'Unassigned'|'Disabled'|'Active'

interface luawl_p {
	discord_id?: string
	wl_key?: string
}

interface luawl_r {
	wl_key?: string
	discord_id?: string
	key_status?: 'Assigned'|'Unassigned'|'Disabled'|'Active'|'Perm Blacklisted',
	HWID?: string
}

interface luawl_logs_response {
	executed_on: string,
	type: string,
	discord_id: string,
	wl_key: string,
	key_status: string,
	assigned_HWID: string,
	exec_HWID: string,
	executor_fingerprint: string,
	game_userid: string,
	message: string
}

/**
 * @description You must always set the token before accessing any other property/method
 */
export var token: string?;

export async function addWhitelist(discord_id: string, trial_hours?: number, wl_script_id?: number) : Promise<string>;
export async function getWhitelist(data: luawl_p) : Promise<luawl_r>;
export async function resetHWID(data: luawl_p) : Promise<string>;
export async function createBlacklist(data: luawl_p) : Promise<string>;
export async function removeBlacklist(data: luawl_p) : Promise<string>;
export async function disableUser(data: luawl_p) : Promise<string>;
export async function isOnCooldown(discord_id: string) : Promise<string>;
export async function removeCooldown(discord_id: string) : Promise<string>;
export async function updateKeyStatus(discord_id: string, key_status: luawl_key_status) : Promise<string>;
export async function getLogs(data: { wl_key?: string, discord_id?: string, HWID?: string }) : Promise<luawl_logs_response[]>;
export async function deleteKey(discord_id: string) : Promise<string>