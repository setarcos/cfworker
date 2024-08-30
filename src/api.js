export async function addRecord(request, env) {
  const db = env.DB

  try {
    const formData = await request.formData()
    const name = formData.get('name')
    const loong_ver = formData.get('loong_ver')
    const x86_ver = formData.get('x86_ver')
    const repo = formData.get('repo')
    const status = formData.get('status')

    await db.prepare('INSERT INTO packages (name, loong_ver, x86_ver, repo, build_status) VALUES (?, ?, ?, ?, ?)')
       .bind(name, loong_ver, x86_ver, repo, status)
       .run()

    return createJsonResponse('OK', 200)
  } catch (error) {
    console.log(error)
    return createJsonResponse('Error', 500)
  }
}

export async function deleteRecord(name, env) {
  const db = env.DB

  try {
    await db.prepare('DELETE FROM packages WHERE name = ?').bind(name).run()
    return createJsonResponse('OK', 200)
  } catch (error) {
    return createJsonResponse('Error', 500)
  }
}

export async function updateRecord(request, name, env) {
  const db = env.DB

  try {
    const formData = await request.formData()
    const status = formData.get('status')
    await db.prepare('UPDATE packages SET build_status = ? WHERE name = ?')
       .bind(status, name)
       .run()
    return createJsonResponse('OK', 200)
  } catch (error) {
    return createJsonResponse('Error', 500)
  }
}

export async function editRecord(request, name, env) {
  const db = env.DB

  try {
    const formData = await request.formData()
    const loong_ver = formData.get('loong_ver')
    const x86_ver = formData.get('x86_ver')
    const repo = formData.get('repo')
    const status = formData.get('status')

    await db.prepare('UPDATE packages SET loong_ver = ?, x86_ver = ?, repo = ?, build_status = ? WHERE name = ?')
       .bind(loong_ver, x86_ver, repo, status, name)
       .run()

    return createJsonResponse('OK', 200)
  } catch (error) {
    return createJsonResponse('Error', 500)
  }
}

function createJsonResponse(result, status) {
  return new Response(JSON.stringify({ result }), {
    headers: { 'Content-Type': 'application/json' },
    status: status
  })
}
