import { FileMover } from "../core/file-mover";
import { MyFile } from "../shared/file";
import { MappingEntry } from "../shared/mapping-entry";
import { MoveResult } from "../shared/move-result";
import { IOrderingStrategy } from "./i-ordering-strategy";

import chalk from "chalk";
import fs = require("fs");
import ora = require("ora");
import path = require("path");

export class RegexStrategy extends IOrderingStrategy {

    private mappings: MappingEntry[];

    constructor(
        directory: string,
        debug: boolean,
        dryRun: boolean,
        mappingFile: string,
    ) {
        const label = "Ordering by mapping file";
        const description = "You have to provide a mapping.json file in the follwing format:";
        super(directory, debug, dryRun, label, description);
        this.mappings = [];
        try {
            this.mappings = JSON.parse(fs.readFileSync(mappingFile, "utf8"));
            for (const mapping of this.mappings) {
                mapping.regex = new RegExp(mapping.regex);
            }
        } catch (e) {
            this.spinner.fail("Unable to read mapping file " + mappingFile + ". Aborting.");
            // BAD
            process.exit(1);
        }
    }

    public run(sourceFile: MyFile): Promise<MoveResult> {
        return new Promise<MoveResult>((resolve: any, reject: any) => {
            fs.stat(sourceFile.absolutePath, (err, stats) => {
                if (err) {
                    reject(new Error("An error occured while reading the file " + sourceFile.name));
                }
                if (stats && stats.isDirectory() === true) {
                    resolve(new MoveResult(sourceFile, sourceFile, false));
                    return;
                }
                const destinationPath = path.join(
                    path.resolve(this.directory),
                    this.determineDestinationPath(sourceFile),
                    sourceFile.name,
                );
                // No rule matched the filename => do nothing
                if (destinationPath === "")  {
                    resolve(new MoveResult(sourceFile, sourceFile, false));
                }
                if (!this.dryRun && this.debug) {
                    this.spinner.succeed("Moving file " + sourceFile.name + " to " + destinationPath);
                    // FileMover.move(sourceFile.absolutePath, destinationPath);
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
                    return resolve(new MoveResult(sourceFile, destinationFile, false));                }
            });
        });
    }

    private determineDestinationPath(file: MyFile): string {
        for (const mapping of this.mappings) {
            if (mapping.regex.test(file.name)) {
                return mapping.destination;
            }
        }
        return "";
    }
}
