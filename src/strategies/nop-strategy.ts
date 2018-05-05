import { MyFile } from "../shared/file";
import { MoveResult } from "../shared/move-result";
import { IOrderingStrategy } from "./i-ordering-strategy";

import chalk from "chalk";

/**
 * Simple "no operation" strategy for testng
 */
export class NopOrderingStrategy extends IOrderingStrategy {
    constructor(
        directory: string,
        debug: boolean,
        dryRun: boolean,
    ) {
        const label = "NOP strategy";
        const description = "Simple strategy that does not move any files for testing.";
        super(directory, debug, dryRun, label, description);
    }

    public run(file: MyFile): Promise<MoveResult> {
        return new Promise<MoveResult>((resolve: any, reject: any) => {
            const destinationFolder = file.absolutePath;
            if (!this.dryRun && this.debug) {
                this.spinner.succeed("Moving file " + file.name + " to " + destinationFolder);
            } else if (this.dryRun && this.debug) {
                const dryRun = chalk.gray("[dry run]");
                this.spinner.succeed(dryRun + " Moving file " + file.name + " to " + destinationFolder);
            }
            resolve(new MoveResult(file, file, true));
        });

    }
}
