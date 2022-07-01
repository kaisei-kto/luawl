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
	const response = await (await import('node-fetch')).default(`https://api.luawl.com${href}`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(Object.assign({
			token: require('./constants').token
		}, body))
	})

	return await response.json()
}

async function addWhitelist(discord_id, trial_hours, wl_script_id) {
	return await send_post('/whitelistUser.php', { discord_id, trial_hours, isTrial: typeof trial_hours === 'number' ? 1 : 0, wl_script_id: typeof wl_script_id === 'number' ? String(wl_script_id) : undefined })
}

async function deleteKey(discord_id) {
	return await send_post('/deleteKey.php', { discord_id })
}

async function getWhitelist(data) {
	const whitelist = await send_post('/getKey.php', data)

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

async function isOnCooldown(data) {
	return await send_post('/isOnCooldown.php', data)
}

async function removeCooldown(data) {
	return await send_post('/removeCooldown.php', data)
}

async function updateKeyStatus(data) {
	assert(typeof data === 'object' && !Array.isArray(data), new TypeError(`\`data\` must be an object (got \`${typeof data === 'object' ? 'array' : typeof data})\``))
	assert(KEY_STATUS_TYPE.indexOf(data.status) !== -1, new Error(`\`data.status\` must be either \`${KEY_STATUS_TYPE.join('`, `')}\` (got \`${data.status}\`)`))

	return await send_post('/updateKeyStatus.php', data)
}

function getLogs(data = { discord_id, wl_key, HWID }) {
	return new Promise(async (resolve, reject) => {
		assert(typeof data === 'object' && !Array.isArray(data), new TypeError(`\`data\` must be an object (got \`${typeof data === 'object' ? 'array' : typeof data})\``))
		const response = await send_post('/getLogs.php', data)
		if ('error' in response) return reject(new Error(response.error))

		return resolve(response)
	})
}

async function getScripts() {
	const scripts = await send_post('/getAccountScripts.php', {})

	for (const script of scripts) {
		script.enabled = Number(script.enabled) === 1
	}

	return scripts
}

async function getBuyerRole() {
	return await send_post('/getBuyerRole.php', {})
}

async function addKeyTags(data) {
	assert(typeof data === 'object' && !Array.isArray(data), new TypeError(`\`data\` must be an object (got \`${typeof data === 'object' ? 'array' : typeof data})\``))

	return await send_post('/addKeyTags.php', data)
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
	getScripts,
	getBuyerRole,
	addKeyTags
}