import { MyFile } from "../shared/file";
import { MoveResult } from "../shared/move-result";

import chalk from "chalk";
import fs = require("fs");
import ora = require("ora");

export abstract class IOrderingStrategy {
    protected readonly spinner = ora();

    constructor(
        // The working directory
        protected directory: string,
        // Enable debugging output
        protected debug: boolean,
        // Enable dry-run
        protected dryRun: boolean,
        // A short label usually the strategy name
        private label: string,
        // A description of what the strategy does
        private description: string,
    ) {
        const terminalWidth = process.stdout.columns ? process.stdout.columns : 50;
        const headerLine = Array(terminalWidth + 1).join("=");
        console.log(chalk.gray(headerLine));
        console.log(chalk.gray("[ ") + label + chalk.gray(" ]"));
        console.log(description);
        const footerLine = Array(terminalWidth + 1).join("=");
        console.log(chalk.grey(footerLine));
    }

    public abstract run(file: MyFile): Promise<MoveResult>;
}
