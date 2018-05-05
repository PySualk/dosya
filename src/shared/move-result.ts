import { MyFile } from "./file";

export class MoveResult {
    constructor(
        public before: MyFile,
        public after: MyFile,
        public moved: boolean,
    ) { }

    public toString = (): string => {
        return `MoveResult (before: ${this.before}, after: ${this.after}, moved: ${this.moved})`;
    }
}
