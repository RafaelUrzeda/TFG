import { Pool, PoolConfig } from "pg";
let pool: Pool;
const init = async (connectionData: PoolConfig) => {
  pool = new Pool(connectionData);
  await status();
};
const status = async () => {
  try {
    await pool.query("SELECT NOW()");
    return { status: "ok" };
  } catch (error) {
    const e = error as ErrorEvent;
    return { status: "fail" };
  }
};

const executeQuery = async ({
  text,
  values,
}: {
  text: string;
  values: Array<
    string | number | Date | boolean | Buffer | JSON | undefined | null
  >;
}) => {
  const start = Date.now();
  try {
    const response = await pool.query(text, values);
    const duration = Date.now() - start;
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export { executeQuery, init, status };

