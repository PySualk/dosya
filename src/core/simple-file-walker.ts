import { MyFile } from "../shared/file";
import { MoveResult } from "../shared/move-result";
import { IOrderingStrategy } from "../strategies/i-ordering-strategy";
import { FileWalker } from "./i-file-walker";

import fs = require("fs");
import ora = require("ora");
import path = require("path");

export class SimpleFileWalker extends FileWalker {
    private numberOfProcessedFiles = 0;

    constructor(
        directory: string,
        strategy: IOrderingStrategy,
        debug?: boolean,
        excludedDirectories?: string,
    ) {
        super(directory, strategy, debug, excludedDirectories);
    }

    public walk(): void {
        const spinner = ora().info("Working in directory " + this.absoluteDirectory);
        const BreakException = {};
        fs.readdir(this.absoluteDirectory, (err, files) => {
            if (err) {
                spinner.fail("Unable to read directory. Aborting.");
                process.exit(0);
            }
            const promises = Array<Promise<MoveResult>>();
            try {
                files.forEach((file) => {
                    if (this.excludedDirectories.indexOf(file) !== -1) {
                        return;
                    }
                    if (this.numberOfProcessedFiles >= this.fileLimit) {
                        throw BreakException;
                    }
                    const absolutePath = path.join(this.absoluteDirectory, file);
                    const myFile = new MyFile(file, absolutePath);
                    promises.push(this.strategy.run(myFile));
                    this.numberOfProcessedFiles++;
                });
            } catch (e) {
                spinner.warn("Reached file limit of " + this.fileLimit + ". Aborting.");
            }
            this.accumulateResults(promises).then((accumulator) => {
                this.displayResults(accumulator);
            });
        });
    }

    protected displayResults(accumulator: any) {
        this.spinner.succeed("Successfully moved " + accumulator.movedFiles + " files."
            + " (" + accumulator.skippedFiles + " files/directories were skipped.)");
    }

    private accumulateResults(promises: Array<Promise<MoveResult>>) {
        const accumulator = {
            movedFiles: 0,
            skippedFiles: 0,
        };
        let ready = Promise.resolve(null);
        promises.forEach((promise: Promise<MoveResult>, ndx: number) => {
            ready = ready.then(() => {
                return promise;
            }).then((value) => {
                if (value.moved === true) {
                    accumulator.movedFiles++;
                } else {
                    accumulator.skippedFiles++;
                }
            });
        });
        return ready.then(() => {
            return accumulator;
        });
    }
}
