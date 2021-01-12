import config, { IConfig } from 'config';
const conf: IConfig = config.get('App');

// implementação de cluster in nodejs
import cluster from 'cluster';

// manipulação de cores no terminal
import chalk from 'chalk';

export interface ConnectionStance {
    user: string;
    password: string;
    host: string;
    poolMin: number;
    poolMax: number;
    poolIncrement: number;
    poolTimeout: number;
}

export let ESTANCE = {} as ConnectionStance;

function ConnectToStance(): void {
    ESTANCE = conf.get<ConnectionStance>(`connection.${process.argv[2]}`);
    process.env.HR_USER = ESTANCE.user;
    process.env.HR_PASSWORD = ESTANCE.password;
    process.env.HR_CONNECTIONSTRING = ESTANCE.host;
    console.log(`${process.argv[2]}:`, ESTANCE);
    console.log(`Connected to stance ${process.argv[2]}!`);
}

function GetDataBaseConnection(): void {
    if (process.argv[2] && process.argv[2] !== null) {
        if (conf.has(`connection.${process.argv[2]}`)) {
            // console.log(`has ${process.argv[2]}`);
            // ConnectToStance();
            startupServer();
        } else {
            console.log(chalk.yellow.bgBlack('\nATENÇÃO!\n'));
            console.log('A estancia informada não existe!\n');
        }
    } else {
        console.log(chalk.red('\nATENÇÃO! \n'));
        console.log('Parametro de conexão não informado!');
        console.log(chalk.green.bgBlack('\nnpm run start <NOME DA ESTANCIA>'));
        console.log(chalk.green.bgBlack('\nExemplo: npm run start desenv \n'));
        process.exit();
    }
}

async function startupServer(): Promise<void> {
    if (cluster.isMaster) {
        console.log(chalk.black.bgGreen('\n Master process executando \n'));

        // Fork workers
        for (let i = 0; i < 1; i++) {
            cluster.fork();
        }

        cluster.on('exit', (worker, code, signal) => {
            console.log(
                `Worker ${worker.process.pid} died with code: ${code}, and signal: ${signal}`
            );
            console.log('Iniciando um novo worker');
            cluster.fork();
        });
    } else {
        console.log('Iniciando aplicação');

        try {
            console.log('Inicializando database module');
            // await database.initialize();
        } catch (err) {
            console.error(err);
            // loggererror.error('Erro:', err + '\r\n');
            process.exit(1); // Código de falha diferente de zero
        }

        try {
            console.log('Inicializando web server module');

            // await webServer.initialize();
        } catch (err) {
            console.error(err);
            // loggererror.error('\nErro:', err + '\r\n');
            process.exit(1); // Código de falha diferente de zero
        }
    }
}

GetDataBaseConnection();
