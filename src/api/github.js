const BASE = 'https://api.github.com'

const headers = {
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
}

/**
 * @param {string} query
 * @returns {Promise<{ ok: boolean, data?: object, status: number, errorMessage?: string }>}
 */
export async function searchUsers(query) {
  const q = query.trim()
  if (!q) {
    return { ok: false, status: 400, errorMessage: 'Enter a search query.' }
  }

  const url = `${BASE}/search/users?q=${encodeURIComponent(q)}&per_page=30`
  const res = await fetch(url, { headers })

  let data
  try {
    data = await res.json()
  } catch {
    return {
      ok: false,
      status: res.status,
      errorMessage: 'Could not read the response from GitHub.',
    }
  }

  if (!res.ok) {
    const msg =
      data?.message ||
      data?.errors?.[0]?.message ||
      `Request failed (${res.status})`
    return { ok: false, status: res.status, errorMessage: msg }
  }

  return { ok: true, status: res.status, data }
}

/**
 * @param {string} login
 */
export async function getUser(login) {
  const trimmed = login?.trim()
  if (!trimmed) {
    return { ok: false, status: 400, errorMessage: 'Missing username.' }
  }

  const url = `${BASE}/users/${encodeURIComponent(trimmed)}`
  const res = await fetch(url, { headers })

  let data
  try {
    data = await res.json()
  } catch {
    return {
      ok: false,
      status: res.status,
      errorMessage: 'Could not read the response from GitHub.',
    }
  }

  if (!res.ok) {
    const msg =
      data?.message ||
      data?.errors?.[0]?.message ||
      `Request failed (${res.status})`
    return { ok: false, status: res.status, errorMessage: msg }
  }

  return { ok: true, status: res.status, data }
}
