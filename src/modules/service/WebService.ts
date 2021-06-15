/*******************************************************************************

    The superclass for web service

    Copyright:
        Copyright (c) 2020-2021 BOSAGORA Foundation
        All rights reserved.

    License:
        MIT License. See LICENSE for details.

*******************************************************************************/

import express from 'express';
import http  from 'http' ;
import { logger } from '../common/Logger';

export class WebService
{
    /**
     * The bind address
     */
    private readonly address: string;

    /**
     * The bind port
     */
    private readonly port: number;
    
    /**
     * The bind trusted port
     */
    private readonly trusted_port: number;
    
    /**
     * The application of express module
     */
    protected app: express.Application;
    
    /**
     * The internal application of express module
     */
    protected internal_app: express.Application;
    
    
    /**
     * The Http server
     */
    protected server: http.Server | null = null;
    
    /**
     * The Http intenal server
     */
    protected internal_server: http.Server | null = null;
    
    /**
     * Constructor
     * @param port The bind port
     * @param trusted_port The bind trusted port
     * @param address The bind address
     */
    constructor (port: number | string, trusted_port: number | string, address?: string)
    {
        if (typeof port == "string")
            this.port = parseInt(port, 10);
        else
            this.port = port;
    
        if (typeof trusted_port == "string")
            this.trusted_port = parseInt(trusted_port, 10);
        else
            this.trusted_port = trusted_port;

        if (address !== undefined)
            this.address = address;
        else
            this.address = "";

        this.app = express();
        this.internal_app = express();
    }

    /**
     * Asynchronously start the web server
     */
    public async start (): Promise<void>
    {
        this.app.set('port', this.port);
        this.internal_app.set('port', this.trusted_port);

        // Listen on provided ports on this.address.
        return new Promise<void>((resolve, reject) => {
            // Create HTTP server.
            this.server = http.createServer(this.app);
            // Create HTTP internal server.
            this.internal_server = http.createServer(this.internal_app);
            this.server.on('error', reject);
            this.internal_server.on('error', reject);
            this.server.listen(this.port, this.address, () => {
                if(this.internal_server)
                    this.internal_server.listen(this.trusted_port, this.address, () => {
                        resolve();
                    });
                else
                    reject();
            });
        });
    }
}
