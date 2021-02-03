/*******************************************************************************

    The superclass of storages.

    This has a DB instance.

    Copyright:
        Copyright (c) 2020 BOS Platform Foundation Korea
        All rights reserved.

    License:
        MIT License. See LICENSE for details.

*******************************************************************************/

import mkdirp from 'mkdirp';
import path from 'path';
import * as sqlite from 'sqlite3';
import mysql, {Connection} from 'mysql';

export class Storages
{
    /**
     *  The instance of sqlite
     */
    protected pool: mysql.Pool;

    protected connetion_config = {
        host: 'localhost',
        user: 'root',
        password: 'henry1000je',
        database: 'stoa',
        connectionLimit : 10,
        queueLimit: 0,
        waitForConnections: true,
        multipleStatements: true,
        acquireTimeout: 10
    };

    /**
     * Constructor
     * @param filename Valid values are filenames,
     * ":memory:" for an anonymous in-memory database and
     * an empty string for an anonymous disk-based database
     * @param callback If provided, this function will be called when
     * the database was opened successfully or when an error occurred.
     * The first argument is an error object. If there is no error, this value is null.
     */
    constructor (filename: string, callback: (err: Error | null) => void)
    {
        this.pool = mysql.createPool(this.connetion_config);

        this.createTables()
            .then(() =>
            {
                if (callback != null)
                    callback(null);
            })
            .catch((err) => {
                if (callback != null)
                    callback(err);
            });
    }

    /**
     * Creates tables.
     * @returns Returns the Promise. If it is finished successfully the `.then`
     * of the returned Promise is called and if an error occurs the `.catch`
     * is called with an error.
     */
    public createTables (): Promise<void>
    {
        return new Promise<void>((resolve, reject) =>
        {
            resolve();
        });
    }

    /**
     * Close the database
     */
    public close ()
    {
        // this.db.close();
    }

    /**
     * Execute SQL to query the database for data.
     * @param sql The SQL query to run.
     * @param params When the SQL statement contains placeholders,
     * you can pass them in here.
     * @returns Returns the Promise. If it is finished successfully the `.then`
     * of the returned Promise is called with the records
     * and if an error occurs the `.catch` is called with an error.
     */
    protected query (sql: string, params: any): Promise<any[]>
    {
        return new Promise<any[]>((resolve, reject) =>
        {
            this.pool.getConnection(function(err: any, connection: mysql.PoolConnection) {
                if (err) reject(err);

                connection.query(sql, params, function (error: any, results: any, fields: any) {
                    connection.release();

                    if (error)
                    {
                        reject(error);
                        return;
                    }
                    else
                        resolve(results);
                });
            });
        });
    }

    /**
     * Execute SQL to enter data into the database.
     * @param sql The SQL query to run.
     * @param params When the SQL statement contains placeholders,
     * you can pass them in here.
     * @returns Returns the Promise. If it is finished successfully the `.then`
     * of the returned Promise is called with the result
     * and if an error occurs the `.catch` is called with an error.
     */
    protected run (sql: string, params: any): Promise<any>
    {
        return new Promise<any>((resolve, reject) =>
        {
            this.pool.getConnection(function(err: any, connection: mysql.PoolConnection) {
                if (err) reject(err);

                connection.query(sql, params, function (error: any, results: any, fields: any) {
                    connection.release();

                    if (error)
                    {
                        reject(error);
                        return;
                    }
                    else
                        resolve(results);
                });
            });
        });
    }

    /**
     * Create the SQL query
     * @param sql The SQL query to run.
     * @returns Returns the Promise. If it is finished successfully the `.then`
     * of the returned Promise is called and if an error occurs the `.catch`
     * is called with an error.
     */
    protected create (sql: string): Promise<void>
    {
        return new Promise<void>((resolve, reject) =>
        {
            var connection: Connection = mysql.createConnection(this.connetion_config);
                connection.query(sql, function (error: any, results: any, fields: any) {
                    if (error)
                    {
                        reject(error);
                        return;
                    }
                    else
                        resolve();
                        return;
                });
        });
    }

    /**
     * SQLite transaction statement
     * To start a transaction explicitly,
     * Open a transaction by issuing the begin function
     * the transaction is open until it is explicitly
     * committed or rolled back.
     * @returns Returns the Promise. If it is finished successfully the `.then`
     * of the returned Promise is called and if an error occurs the `.catch`
     * is called with an error.
     */
    protected begin (): Promise<void>
    {
        return new Promise<void>((resolve, reject) =>
        {
            resolve();
        });
        //return this.exec('BEGIN');
    }

    /**
     * SQLite transaction statement
     * Commit the changes to the database by using this.
     * @returns Returns the Promise. If it is finished successfully the `.then`
     * of the returned Promise is called and if an error occurs the `.catch`
     * is called with an error.
     */
    protected commit (): Promise<void>
    {
        return new Promise<void>((resolve, reject) =>
        {
            resolve();
        });
        // return this.exec('COMMIT');
    }

    /**
     * SQLite transaction statement
     * If it do not want to save the changes,
     * it can roll back using this.
     * @returns Returns the Promise. If it is finished successfully the `.then`
     * of the returned Promise is called and if an error occurs the `.catch`
     * is called with an error.
     */
    protected rollback (): Promise<void>
    {
        return new Promise<void>((resolve, reject) =>
        {
            resolve();
        });

        // return new Promise<void>((resolve, reject) =>
        // {
        //     this.pool.getConnection(function(err: any, connection: mysql.PoolConnection) {
        //         if (err) reject(err);
        //
        //         connection.rollback(function () {
        //             connection.release();
        //             resolve();
        //         });
        //     });
        // });
    }
}
