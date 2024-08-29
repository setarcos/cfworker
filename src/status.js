export async function statusRequest(request, env) {
  const db = env.DB

  const tableRows = (row) => `
<tr>
<td>${row.name}</td>
<td>${row.loong_ver}</td>
<td>${row.x86_ver}</td>
<td>${row.repo}</td>
<td>${row.build_status}</td>
</tr>`

  const htmlContent = (rows) => `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="stylesheet" href="https://unpkg.com/chota@latest">
<title>Package List</title>
</head>
<body>
<div class="container">
<h1>Package List</h1>
<table class="striped" id="pkgTable">
  <tr>
    <th>Name</th>
    <th>loongarch</th>
    <th>x86</th>
    <th>Repo</th>
    <th>Build Status</th>
  </tr>
  ${rows}
</table>
</div>
</body>
</html>`

  try {
    const { results } = await db.prepare('SELECT * FROM packages').all()
    const table = results.map(row => tableRows(row)).join('')
    return new Response(htmlContent(table), {
      headers: { 'Content-Type': 'text/html' },
    })
  } catch (error) {
    console.log(error)
    return new Response('Error querying the database', { status: 500 })
  }
}
