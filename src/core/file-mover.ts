import fs = require("fs");
import mkdirp = require("mkdirp");
import ora = require("ora");
import path = require("path");

export class FileMover {
    /**
     * Moves a file from ´source´ to ´destination´.
     * @param source        The full source including filename (e.g. /home/user/myfile.txt)
     * @param destination   The full destination including filename (e.g. /home/user/target/myfile.txt)
     * @returns             true in case the file was moved, false in case the file was not moved
     */
    public static move(source: string, destination: string): Promise<boolean> {
        console.log("called " + source + ", " + destination);
        return new Promise<boolean>((resolve: any, reject: any) => {
            const renameCallback = (err: Error) => {
                if (err) {
                    reject(false);
                }
                resolve(true);
            };
            const mkdirpCallback = (err: Error) => {
                if (err) {
                    reject(false);
                } else {
                    fs.rename(source, destination, renameCallback);
                }
            };
            const sourceStatCallback = (err: Error, stats: fs.Stats) => {
                if (err) {
                    reject(false);
                }
                const destinationPath = path.dirname(destination);
                fs.stat(destination, destinationStatCallback);
            };
            const destinationStatCallback = (err: Error, stats: fs.Stats) => {
                if (stats && stats.isFile() === true) {
                    reject(false);
                }
                if (path.dirname(source) === path.dirname(destination)) {
                    fs.rename(source, destination, renameCallback);
                }
                mkdirp(path.dirname(destination), mkdirpCallback);
            };
            fs.stat(source, sourceStatCallback);
        });
    }
}
