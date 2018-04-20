#!/usr/bin/env node

import program = require("commander");
import ora = require("ora");

import { CreationDateStrategy } from "./strategies/creation-date-strategy";

class Startup {

    public static main() {
        let directoryValue: string;
        let enableDebuggingMode = false;
        const spinner = ora("Parsing program arguments").succeed();

        program
            .version("0.1.0")
            .option("-d, --debug", "output additional debug information")
            .option("-n, --dry-run", "Run the program without chaning any files " +
                "(combine with -d to show all changes that would be performed)")
            .option("-s, --strategy [strategy]", "Use one of the following ordering stategies: byCreationDate")
            .option("-e, --exclude", "Exclude the given directories")
            .arguments("<directory>")
            .action((directory: string) => {
                directoryValue = directory;
                if (typeof directoryValue === "undefined") {
                    const msg = "You have to provide a directory as first argument." +
                        "Run the program with --help to get a manual page.";
                    ora(msg).fail();
                    return 1;
                }
                if (program.debug) {
                    spinner.succeed("Debugging mode enabled");
                    enableDebuggingMode = true;
                }
                if (program.strategy && program.strategy === "byCreationDate") {
                    new CreationDateStrategy(directoryValue, enableDebuggingMode).run();
                } else {
                    ora("The given strategy is unknown. Run the program with --help to get a manual page.").fail();
                    return 1;
                }
                return 0;
            })
            .parse(process.argv);
    }
}

Startup.main();
