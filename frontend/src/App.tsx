export default function () {
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]!;

    // 1. Get the pre-signed URL
    const url = "http://localhost:3000/pre-signed-url";
    const response = await fetch(url, { method: "POST" });

    const { url: uploadUrl, key } = await response.json();

    // 2. Upload the file
    await fetch(uploadUrl, { method: "PUT", body: file });

    // 3. Get the file
    const downloadResponse = await fetch(`http://localhost:3000/file/${key}`);
    const { url: downloadUrl } = await downloadResponse.json();

    window.open(downloadUrl, "_blank");
  };

  return (
    <main className="containter mx-auto bg-zinc-900 text-zinc-50 h-screen flex flex-col gap-6 items-center justify-center">
      <input type="file" onChange={handleFileChange} />
    </main>
  );
}
