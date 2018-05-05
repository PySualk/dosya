import { IOrderingStrategy } from "../strategies/i-ordering-strategy";

import ora = require("ora");
import path = require("path");

export abstract class FileWalker {
    // The working directory
    protected readonly directory: string;
    // The absolute path of the directory the user provided
    protected readonly absoluteDirectory: string;
    // Enable debugging output
    protected readonly debug: boolean;
    // The following directories will be skipped
    protected readonly excludedDirectories: string[];
    // The given ordering strategy
    protected readonly strategy: IOrderingStrategy;
    // The FileWalker should stop working after a limit number of files
    // TODO make this configurable
    protected readonly fileLimit = 10000;
    protected readonly spinner = ora();

    constructor(
        directory: string,
        strategy: IOrderingStrategy,
        debug?: boolean,
        excludedDirectories?: string,
    ) {
        this.directory = directory;
        this.absoluteDirectory = path.resolve(this.directory);
        this.strategy = strategy;
        this.debug = debug === true;
        if (debug) {
            this.spinner.info("Debugging mode enabled");
            this.debug = true;
        } else {
            this.debug = false;
        }
        if (excludedDirectories) {
            this.excludedDirectories = excludedDirectories.split(",");
            this.spinner.info("Excluded directories: " + this.excludedDirectories);
        } else {
            this.excludedDirectories = [];
        }
    }

    public abstract walk(): void;

    // You shall present information to the user about
    // the number of moved files and the execution time here
    protected abstract displayResults(accumulator: any): void;
}
