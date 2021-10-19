import config from 'config';
import oracledb, { Pool, PoolAttributes } from 'oracledb';
import chalk from 'chalk';

export const dbConfig = ((): ConnectionStance => {
    try {
        console.log(config.get<ConnectionStance>('db'));
        return config.get<ConnectionStance>('db');
    } catch (error) {
        if (process.argv[2] && process.argv[2] !== null) {
            if (config.has(`App.connection.${process.argv[2]}`)) {
                return config.get<ConnectionStance>(
                    `App.connection.${process.argv[2]}`
                );
            } else {
                console.log(chalk.red('\nATENÇÃO!\n'));
                console.log('A estancia informada não existe!\n');
                process.exit(1);
            }
        } else {
            console.log(chalk.yellow('\nATENÇÃO! \n'));
            console.log('Parametro de conexão não informado!');
            console.log(chalk.green.bgBlack('\nnpm run start <NOME DA ESTANCIA>'));
            console.log(chalk.green.bgBlack('\nExemplo: npm run start desenv \n'));
            process.exit(1);
        }
    }
})();

export interface ConnectionStance {
    user: string;
    password: string;
    host: string;
    poolMin: number;
    poolMax: number;
    poolIncrement: number;
    poolTimeout: number;
}

export const connect = async (): Promise<Pool> => {
    const configConnection: PoolAttributes = {
        ...dbConfig,
        ...{ connectString: dbConfig.host },
    };
    return await oracledb.createPool(configConnection);
};

export const close = async (): Promise<void> => {
    return await oracledb.getPool().close();
};
