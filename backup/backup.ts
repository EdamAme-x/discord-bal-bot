// BACKUP 復元用

const targetFile = "";

if (!Deno.statSync(targetFile).isFile) {
  console.error(`"${targetFile}" は存在しません。`);
} else {
  const kv = await Deno.openKv();

  const backup = await Deno.readTextFile(targetFile);

  const json: {
    key: string[];
    value: any;
  } = JSON.parse(backup);

  for (const entry of json) {
    await kv.set(entry.key, entry.value);
  }

  await kv.close();

  console.log(`"${targetFile}" を復元しました。`);
}
