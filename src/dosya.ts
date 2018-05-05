#!/usr/bin/env node

import { SimpleFileWalker } from "./core/simple-file-walker";
import { CreationDateStrategy } from "./strategies/creation-date-strategy";
import { NopOrderingStrategy } from "./strategies/nop-strategy";
import { RegexStrategy } from "./strategies/regex-strategy";

import chalk from "chalk";
import program = require("commander");
import ora = require("ora");

class Startup {
    public static main() {
        this.printWelcomeScreen();
        let directoryValue: string;
        const spinner = ora("Parsing program arguments").succeed();
        program
            .version("0.1.0")
            .option("-d, --debug", "output additional debug information")
            .option("-n, --dryrun", "Run the program without changing any files " +
                "(combine with -d to show all changes that would be performed)")
            .option("-s, --strategy [strategy]", "Use one of the following ordering stategies: "
                + "byCreationDate, byMappingFile")
            .option("-e, --exclude [directories]", "Exclude the given directories (separated by ',')")
            .arguments("<directory>")
            .action((directory: string) => {
                directoryValue = directory;
                if (typeof directoryValue === "undefined") {
                    const msg = "You have to provide a directory as first argument." +
                        "Run the program with --help to get a manual page.";
                    ora(msg).fail();
                    return 1;
                }
                if (program.strategy && program.strategy === "nop") {
                    new SimpleFileWalker(
                        directoryValue,
                        new NopOrderingStrategy(
                            directoryValue,
                            program.debug,
                            program.dryrun,
                        ),
                        program.debug,
                        program.exclude).walk();
                } else if (program.strategy && program.strategy === "byCreationDate") {
                    new SimpleFileWalker(
                        directoryValue,
                        new CreationDateStrategy(
                            directoryValue,
                            program.debug,
                            program.dryrun,
                        ),
                        program.debug,
                        program.exclude).walk();
                } else if (program.strategy && program.strategy === "byMappingFile") {
                    new SimpleFileWalker(
                        directoryValue,
                        new RegexStrategy(
                            directoryValue,
                            program.debug,
                            program.dryrun,
                            "mapping.json",
                        ),
                        program.debug,
                        program.exclude).walk();
                } else {
                    ora("The given strategy is unknown. Run the program with --help to get a manual page.").fail();
                    return 1;
                }
                return 0;
            })
            .parse(process.argv);
    }

    public static printWelcomeScreen() {
        console.log(chalk.red("    __"));
        console.log(chalk.red(".--|  |") + chalk.green(".-----.-----.--.--.---.-."));
        console.log(chalk.red("|  _  |") + chalk.green("|  _  |__ --|  |  |  _  |"));
        console.log(chalk.red("|_____|") + chalk.green("|_____|_____|___  |___._|"));
        console.log(chalk.green("                   |_____|"));
        console.log(chalk.underline(chalk.red("Your handy tool for automated file organization")));
        console.log(chalk.gray("2018 by https://github.com/PySualk/dosya"));
    }

}

Startup.main();
