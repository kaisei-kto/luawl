import * as moment from "moment"

type luawl_key_status = 'Assigned'|'Unassigned'|'Disabled'|'Active'

interface luawl_p {
	discord_id?: string
	wl_key?: string
}

interface luawl_r {
	wl_key?: string
	discord_id?: string
	key_status?: 'Assigned'|'Unassigned'|'Disabled'|'Active'|'Blacklisted'|'Perm Blacklisted',
	HWID?: string,
	isTrial?: boolean,
	expiration?: moment,
	hours_remaining?: number
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

interface luawl_delkey_data {
	discord_id?: string,
	wl_key?: string
}

interface luawl_scripts {
	wl_script_id: string,
	script_name: string,
	script_notes?: string,
	shoppy_link: string,
	enabled: boolean,
	created_on: string
}

interface luawl_tags extends luawl_p {
	wl_script_id?: string,
	tags?: Array<string>
}

/**
 * @description You must always set the token before accessing any other property/method
 */
export var token: string?;

export async function addWhitelist(discord_id: string, trial_hours?: number, wl_script_id?: number) : Promise<string>;
export async function getWhitelist(data: luawl_p) : Promise<luawl_r|"No key found.">;
export async function resetHWID(data: luawl_p) : Promise<string>;
export async function createBlacklist(data: luawl_p) : Promise<string>;
export async function removeBlacklist(data: luawl_p) : Promise<string>;
export async function disableUser(data: luawl_p) : Promise<string>;
export async function isOnCooldown(discord_id: string) : Promise<string>;
export async function removeCooldown(discord_id: string) : Promise<string>;
export async function updateKeyStatus(discord_id: string, key_status: luawl_key_status) : Promise<string>;
export async function getLogs(data: { wl_key?: string, discord_id?: string, HWID?: string }) : Promise<luawl_logs_response[]>;
export async function getScripts() : Promise<luawl_scripts[]>
export async function deleteKey(data: luawl_delkey_data) : Promise<string>
export async function getBuyerRole() : Promise<?string>
export async function addKeyTags(data: luawl_tags) : Promise<string>