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

    return new Response(JSON.stringify({ result: 'OK' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    })
  } catch (error) {
    console.log(error)
    return new Response(JSON.stringify({ result: 'Error' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    })
  }
}

