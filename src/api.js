const assert = require('assert')
const KEY_STATUS_TYPE = ['Assigned', 'Unassigned', 'Disabled', 'Active']

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
	const user = await getWhitelist({ discord_id })

	if (user.discord_id === discord_id) {
		return user.wl_key
	}

	return await send_post('/whitelistUser.php', { discord_id, trial_hours, isTrial: typeof trial_hours === 'number' ? 1 : 0, wl_script_id })
}

async function deleteKey(discord_id) {
	return await send_post('/deleteKey.php', { discord_id })
}

async function getWhitelist(data) {
	return JSON.parse((await send_post('/getKey.php', data)) || '{}')
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

async function getLogs(data = { discord_id, wl_key, HWID }) {
	assert(typeof data === 'object' && !Array.isArray(data), new TypeError(`\`data\` must be an object (got \`${typeof data === 'object' ? 'array' : typeof data})\``))
	const response = JSON.parse(await send_post('/getLogs.php', data))
	if ('error' in response) throw new Error(response.error)
	return response
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
	deleteKey
}