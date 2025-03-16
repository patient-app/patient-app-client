export default async function Home() {
  let data;
  try {
    const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL ?? "");
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    data = await response.text();
  } catch (e) {
    console.error(e);
  }

  return (
    <main>
      <h1 className="text-2xl font-bold">Fetched From Backend:</h1>
      {data ? (
        <pre className="bg-black/[.05] dark:bg-white/[.06] p-4 rounded">{data}</pre>
      ) : (
        <div>Could not fetch data. Did you start the server?</div>
      )}
    </main>
  );
}
