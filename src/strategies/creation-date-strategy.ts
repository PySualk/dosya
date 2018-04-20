import fs = require("fs");
import ora = require("ora");
import path = require("path");
import walk = require("walk");

import { dirname } from "path";
import { setTimeout } from "timers";

const log = console.log;

export class CreationDateStrategy {

    constructor(
        private directory: string,
        private debug: boolean,
    ) { }

    public run() {
        const absoluteDirectory = path.resolve(this.directory);
        const hrstart = process.hrtime();
        const debug = this.debug;
        const fileLimit = 10000;
        let spinner = ora("Working in directory " + absoluteDirectory).succeed();
        if (debug) {
            spinner.info("TODO DESCRIPTION OF STRATEGRY");
        } else {
            spinner = ora("Running \"Ordering by creation date\" strategy").start();
        }
        const options = {
            filters: ["Temp", "_Temp", "node_modules/"],
            followLinks: false,
        };
        let fileCount = 0;
        const walker = walk.walk(this.directory, options);

        walker.on("file", (root, fileStats, next) => {
            fs.readFile(fileStats.name, () => {
                fileCount++;
                if (fileCount >= fileLimit) {
                    spinner.fail();
                    spinner.fail("Limit of " + fileLimit + " files reached. Exiting.");
                    return;
                }
                const destinationFolder = this.getDestinationFolder(fileStats);
                if (debug) {
                    spinner.info("Moving file " + fileStats.name + " to " + destinationFolder);
                }
                next();
            });
        });

        walker.on("errors", (root, nodeStatsArray, next) => {
            next();
        });

        walker.on("end", () => {
            spinner.succeed("Running \"Ordering by creation date\" strategy");
            spinner.info("Processed files: " + fileCount);
            const hrend = process.hrtime(hrstart);
            spinner.info("Execution time: " + hrend[1] / 1000000 + " ms.");
        });
    }

    private getDestinationFolder(fileStats: any): string {
        return fileStats.birthtime.getFullYear() + "/";
    }

}
