import { FileMover } from "../core/file-mover";
import { MyFile } from "../shared/file";
import { MoveResult } from "../shared/move-result";
import { IOrderingStrategy } from "./i-ordering-strategy";

import chalk from "chalk";
import fs = require("fs");
import ora = require("ora");
import path = require("path");

export class CreationDateStrategy extends IOrderingStrategy {
    constructor(
        directory: string,
        debug: boolean,
        dryRun: boolean,
    ) {
        const label = "Ordering by creation date";
        const description = "This strategy orders files based on their creation date";
        super(directory, debug, dryRun, label, description);
    }

    public run(sourceFile: MyFile): Promise<MoveResult> {
        return new Promise<MoveResult>((resolve: any, reject: any) => {
            fs.stat(sourceFile.absolutePath, (err: Error, stats: fs.Stats) => {
                if (!stats) {
                    return reject(new Error("An error occured while reading the file " + sourceFile.name));
                }
                if (stats && stats.isDirectory() === true) {
                    return reject(new Error("The given file " + sourceFile.absolutePath + " is a directory"));
                }
                const destinationPath = path.join(
                    path.resolve(this.directory),
                    this.determineDestinationPath(stats),
                    sourceFile.name,
                );
                if (!this.dryRun && this.debug) {
                    this.spinner.succeed("Moving file " + sourceFile.name + " to " + destinationPath);
                    FileMover.move(sourceFile.absolutePath, destinationPath).then((result) => {
                        const destinationFile: MyFile = new MyFile(path.basename(destinationPath), destinationPath);
                        return resolve(new MoveResult(sourceFile, destinationFile, true));
                    }).catch((error) => {
                        return reject(new Error("File " + sourceFile.name + " could not be moved."));
                    });
                } else if (this.dryRun && this.debug) {
                    const dryRun = chalk.gray("[dry run]");
                    this.spinner.succeed(dryRun + " Moving file " + sourceFile.name + " to " + destinationPath);
                    const destinationFile: MyFile = new MyFile(path.basename(destinationPath), destinationPath);
                    return resolve(new MoveResult(sourceFile, destinationFile, false));
                }
            });
        });
    }

    private determineDestinationPath(fileStats: fs.Stats): string {
        return fileStats.birthtime.getFullYear() + "/";
    }
}
