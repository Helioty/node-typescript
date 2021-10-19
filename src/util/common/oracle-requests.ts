import oracledb, {
    BindParameters,
    Connection,
    ExecuteOptions,
    Result,
    ResultSet,
} from 'oracledb';
import { dbConfig } from './../../database';

oracledb.fetchAsString = [oracledb.CLOB];
oracledb.fetchAsBuffer = [oracledb.BLOB];

export async function simpleExecute<T>(
    statement: string,
    binds: BindParameters = [],
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

// by Ryuge 12/08/2019
export async function ProcExecute(
    statement: string,
    binds: BindParameters = [],
    opts: ExecuteOptions = {}
): Promise<any> {
    return new Promise(async (resolve, reject) => {
        const numRows = 9999;
        // let connection: Connection;

        opts.outFormat = oracledb.OUT_FORMAT_OBJECT;
        opts.autoCommit = true;
        opts.resultSet = true;

        await oracledb
            .getConnection({
                ...dbConfig,
                ...{ connectString: dbConfig.host },
            })
            .then(
                async (connection: Connection) => {
                    await connection.execute(statement, binds, opts).then(
                        async (result: Result<any>) => {
                            const resultSet: ResultSet<any> =
                                result.outBinds.P_RESULT;
                            const res = await resultSet.getRows(numRows);
                            console.log(`Got ${res.length} rows.`);
                            resolve(res);
                        },
                        (error) => {
                            if (error) {
                                console.error(error.message);
                                reject(error);
                                doRelease(connection);
                                return;
                            }
                        }
                    );
                },
                (err) => {
                    if (err) {
                        console.error(err.message);
                        return;
                    }
                }
            );

        // try {
        //     oracledb.getConnection(
        //         {
        //             ...dbConfig,
        //             ...{ connectString: dbConfig.host },
        //         },
        //         function (err, connection) {
        //             if (err) {
        //                 console.error(err.message);
        //                 return;
        //             }
        //             console.log('connection 1 feito', connection);
        //             connection.execute(
        //                 statement,
        //                 binds,
        //                 opts,
        //                 async function (err, result: Result<any>) {
        //                     if (err) {
        //                         console.error(err.message);
        //                         reject(err);
        //                         doRelease(connection);
        //                         return;
        //                     } else {
        //                         console.log('connection 2 feito', result);
        //                         const resultSet = result.outBinds.P_RESULT;
        //                         let row;
        //                         while ((row = await resultSet.getRow())) {
        //                             console.log(row);
        //                         }
        //                         const record = fetchRowsFromRS(
        //                             connection,
        //                             result.outBinds.P_RESULT ||
        //                             result.outBinds.R_CURSOR,
        //                             numRows
        //                         );
        //                         resolve(record);
        //                     }
        //                 }
        //             );
        //         }
        //     );
        // } catch (err) {
        //     reject(err);
        // } finally {
        //     if (connection) {
        //         // connection assignment worked, need to close
        //         try {
        //             await connection.close();
        //         } catch (err) {
        //             console.log(err);
        //         }
        //     }
        // }
    });
}

// by Ryuge 12/08/2019
function fetchRowsFromRS(
    connection: Connection,
    resultSet: ResultSet<any>,
    numRows: number
): Promise<any> {
    return new Promise((resolve, reject) => {
        resultSet.getRows(numRows, (err: any, rows: any) => {
            if (err) {
                console.error(err);
                doClose(connection, resultSet); // always close the ResultSet
                reject(err);
            } else if (rows.length > 0) {
                console.log('fetchRowsFromRS(): Got ' + rows.length + ' rows.');

                if (rows.length === numRows)
                    // might be more rows
                    fetchRowsFromRS(connection, resultSet, numRows);
                else {
                    doClose(connection, resultSet); // always close the ResultSet
                }
            } else {
                doClose(connection, resultSet); // always close the ResultSet
            }
            resolve(rows);
        });
    });
}

function doRelease(connection: Connection): void {
    connection.close(function (err: any) {
        if (err) {
            console.error(err.message);
        }
    });
}

function doClose(connection: Connection, resultSet: ResultSet<any>): void {
    resultSet.close(function (err: any) {
        if (err) {
            console.error(err.message);
        }
        doRelease(connection);
    });
}
