const assert = require('assert')
const moment = require('moment')
const KEY_STATUS_TYPE = ['Assigned', 'Unassigned', 'Disabled', 'Active']

const offset = -new Date().getTimezoneOffset()
const offset_suffix = offset >= 0 ? "+" : "-"
var offset_time = ''
{
	offset_time += offset_suffix;
	var hours = String(offset/60).split('.')
	var minutes = 0
	if (hours.length !== 2) minutes = 0
	else minutes = Number(hours.pop())
	hours = Number(hours.join(''))
	if (offset_suffix === "-") hours *= -1
	if (moment(new Date()).isDST()) hours += 1
	offset_time += `${hours > 9 ? hours : '0' + String(hours)}:${minutes > 9 ? minutes : '0' + String(minutes)}`
};

async function send_post(href, body) {
	return await (await (await import('node-fetch')).default(`https://api.luawl.com${href}`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(Object.assign({
			token: require('./constants').token
		}, body))
	}).then(response => response.text()))
}

async function addWhitelist(discord_id, trial_hours, wl_script_id) {
	return await send_post('/whitelistUser.php', { discord_id, trial_hours, isTrial: typeof trial_hours === 'number' ? 1 : 0, wl_script_id: typeof wl_script_id === 'number' ? String(wl_script_id) : undefined })
}

async function deleteKey(discord_id) {
	return await send_post('/deleteKey.php', { discord_id })
}

async function getWhitelist(data) {
	const whitelist = JSON.parse(await send_post('/getKey.php', data) || '{}')

	if (typeof whitelist === "object" && !Array.isArray(whitelist)) {
		if (whitelist.expiration) {
			whitelist.expiration = moment.utc(`${whitelist.expiration}+04:00`).utcOffset(offset_time)
		}
		
		if (whitelist.isTrial) {
			whitelist.isTrial = Number(whitelist.isTrial) == 1
		}

		if (!isNaN(Number(whitelist.hours_remaining))) {
			whitelist.hours_remaining = Number(whitelist.hours_remaining)
		}
	}
	
	return whitelist
}

async function resetHWID(data) {
	return await send_post('/resetHWID.php', data)
}

async function createBlacklist(data) {
	return await send_post('/createBlacklist.php', data)
}

async function removeBlacklist(data) {
	return await send_post('/removeBlacklist.php', data)
}

async function disableUser(data) {
	return await send_post('/disableKey.php', data)
}

async function isOnCooldown(discord_id) {
	return await send_post('/isOnCooldown.php', { discord_id })
}

async function removeCooldown(discord_id) {
	return await send_post('/removeCooldown.php', { discord_id })
}

async function updateKeyStatus(discord_id, key_status) {
	assert(KEY_STATUS_TYPE.indexOf(key_status) !== -1, new Error(`\`key_status\` must be either \`${KEY_STATUS_TYPE.join('`, `')}\` (got \`${key_status}\`)`))

	return await send_post('/updateKeyStatus.php', { discord_id, status: key_status })
}

function getLogs(data = { discord_id, wl_key, HWID }) {
	return new Promise(async (resolve, reject) => {
		assert(typeof data === 'object' && !Array.isArray(data), new TypeError(`\`data\` must be an object (got \`${typeof data === 'object' ? 'array' : typeof data})\``))
		const response = JSON.parse(await send_post('/getLogs.php', data))
		if ('error' in response) return reject(new Error(response.error))

		return resolve(response)
	})
}

async function getScripts() {
	const scripts = JSON.parse((await send_post('/getAccountScripts.php', {})) || '[]')

	for (const script of scripts) {
		script.enabled = Number(script.enabled) === 1
	}

	return scripts
}

module.exports = {
	addWhitelist,
	getWhitelist,
	resetHWID,
	disableUser,
	createBlacklist,
	removeBlacklist,
	isOnCooldown,
	removeCooldown,
	updateKeyStatus,
	getLogs,
	deleteKey,
	getScripts
}