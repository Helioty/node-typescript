import oracledb from 'oracledb';
import { ProcExecute } from '../util/common/oracle-requests';
import { OracleError } from './../util/errors/oracle-erros';

export interface InfoPessoal {
    matricula: number;
    nome: string;
    cargo: string;
    empresa: number;
}

export interface IndicadorDesempenho {
    empresa: number;
    matricula: number;
    nomeColab: string;
    setor: number;
    nomeSetor: string;
    codigoCartao: string;
    cargo: string;
    idPerfil: number;
    nomeCargo: string;
    idGR: number;
    nomeGR: string;
    descricaoGR: string;
    propositoGR: string;
    formulaCalculoGR: string;
    cadeiaValorGR: string;
    grupoGR: string;
    orientacao: string;
    metaMinima: number;
    superMeta: number;
}

export interface Projetos {
    planest: string;
    codigoProjeto: string;
    nomeProjeto: string;
    objetivo: string;
    minimoEsperado: string;
    pilar: string;
    dataInicio: string;
    dataFim: string;
    matpat: number;
    numEmp: number;
    matRes: number;
}

export class AquilaService {
    public async getInfoPessoal(
        matricula: number
    ): Promise<InfoPessoal | InfoPessoal[]> {
        const query =
            'BEGIN SFC.PKG_GESTAO.GET_INFO_PESSOAL(:P_MATRICULA, :P_RESULT); END;';
        const binds = {
            P_MATRICULA: matricula,
            P_RESULT: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
        };
        console.log('Parametros:', binds);
        try {
            const result: any[] = await ProcExecute(query, binds);
            if (result.length === 1) {
                return this.formataObjetoInfoPessoal(result)[0];
            } else {
                return this.formataObjetoInfoPessoal(result);
            }
        } catch (error) {
            if (error.errorNum && error.message) {
                throw new OracleError(String(error.message));
            } else {
                return error;
            }
        }
    }

    private formataObjetoInfoPessoal(dados: any[]): InfoPessoal[] {
        return dados.map<InfoPessoal>((e: any) => {
            return {
                matricula: e.MATRICULA,
                nome: e.NOME,
                cargo: e.CARGO,
                empresa: e.EMPRESA,
            };
        });
    }

    public async getIndicadoresDesempenho(
        matricula: number
    ): Promise<IndicadorDesempenho[] | OracleError> {
        const query =
            'BEGIN SFC.PKG_GESTAO.GET_INDICADORES_DESEMPENHO(:P_MATRICULA, :P_RESULT); END;';
        const binds = {
            P_MATRICULA: matricula,
            P_RESULT: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
        };
        console.log('Parametros:', binds);
        try {
            const result: any[] = await ProcExecute(query, binds);
            return this.formataObjetoIndicadorDesempenho(result);
        } catch (error) {
            if (error.errorNum && error.message && error.offset) {
                throw new OracleError(error.message);
            }
            return error;
        }
    }

    private formataObjetoIndicadorDesempenho(
        dados: any[]
    ): IndicadorDesempenho[] {
        return dados.map<IndicadorDesempenho>((e: any) => {
            return {
                empresa: e.COD_EMPRESA,
                matricula: e.NUMCAD,
                nomeColab: e.NOMFUN,
                setor: e.NUMLOC,
                nomeSetor: e.NOMLOC,
                codigoCartao: e.CODCAR,
                cargo: e.TITRED,
                idPerfil: e.ID_PERFIL,
                nomeCargo: e.PROF_NAME,
                idGR: e.ID,
                nomeGR: e.NOME,
                descricaoGR: e.DESCRICAO,
                propositoGR: e.PROPOSITO,
                formulaCalculoGR: e.FORMULA_CALCULO,
                cadeiaValorGR: e.CADEIA_VALOR,
                grupoGR: e.GRUPO,
                orientacao: e.ORIENTACAO,
                metaMinima: e.META_MINIMA,
                superMeta: e.SUPER_META,
            };
        });
    }

    public async getProjetos(): Promise<Projetos[] | OracleError> {
        const query = 'BEGIN SFC.PKG_GESTAO.GET_PROJETOS(:P_RESULT); END;';
        const binds = {
            P_RESULT: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT },
        };
        console.log('Parametros:', binds);
        try {
            const result: any[] = await ProcExecute(query, binds);
            return this.formataObjetoProjetos(result);
        } catch (error) {
            if (error.errorNum && error.message && error.offset) {
                throw new OracleError(error.message);
            }
            return error;
        }
    }

    private formataObjetoProjetos(dados: any[]): Projetos[] {
        return dados.map<Projetos>((e: any) => {
            return {
                planest: e.PLANEST,
                codigoProjeto: e.COD_PROJ,
                nomeProjeto: e.NOME_PROJ,
                objetivo: e.OBJETIVO,
                minimoEsperado: e.MIN_ESPERADO,
                pilar: e.PILAR,
                dataInicio: e.DATINI,
                dataFim: e.DATFIM,
                matpat: e.MATPAT,
                numEmp: e.NUMEMP,
                matRes: e.MATRES,
            };
        });
    }
}
