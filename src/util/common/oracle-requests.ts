import oracledb, { ExecuteOptions, Result } from 'oracledb';

export async function simpleExecute<T>(
    statement: string,
    binds = [],
    opts: ExecuteOptions = {}
): Promise<Result<T | T[]>> {
    let conn;

    opts.outFormat = oracledb.OUT_FORMAT_OBJECT;
    opts.autoCommit = true;

    try {
        conn = await oracledb.getConnection();
        const result = await conn.execute<T | T[]>(statement, binds, opts);
        return result;
    } catch (err) {
        console.error(err.message);
        return err;
    } finally {
        if (conn) {
            try {
                await conn.close();
            } catch (err) {
                console.log(err);
            }
        }
    }
}
