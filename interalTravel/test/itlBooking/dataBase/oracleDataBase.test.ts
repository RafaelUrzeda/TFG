import { logger } from 'aea-logger';
import { createPool, Pool } from 'oracledb';
import { init, status, Status } from '../../../src/database/interline.oracle.datasource';

jest.mock('aea-logger');
jest.mock('oracledb');

describe('Oracle DataSource', () => {
    let mockPool: Pool;

    beforeEach(() => {
        mockPool = {
            getConnection: jest.fn().mockResolvedValue({
                execute: jest.fn().mockResolvedValue({ rows: [] }),
                close: jest.fn().mockResolvedValue(undefined),
            }),
        } as unknown as Pool;

        (createPool as jest.Mock).mockResolvedValue(mockPool);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('init', () => {
        it('should initialize the pool and call status', async () => {
            const connectionData = { user: 'user', password: 'password', connectionString: 'ip:host/SID' };
            await init(connectionData);

            expect(createPool).toHaveBeenCalledWith(connectionData);
            expect(logger.info).toHaveBeenCalledWith(`jdbc:oracle:thin:@${connectionData.connectionString} connecting...`);
            expect(mockPool.getConnection).toHaveBeenCalled();
        });
    });

    describe('status', () => {
        it('should return status ok if connection is successful', async () => {
            const result: Status = await status();
            expect(result.status).toBe('ok');
            expect(logger.info).toHaveBeenCalledWith('Oracle Connected Successfully');
        });

    });



});